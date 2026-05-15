package com.eventbooking.controller;
import com.eventbooking.dto.MessageResponse;
import com.eventbooking.model.Event;
import com.eventbooking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired EventRepository eventRepository;

    @GetMapping("/public")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        // Date validation: must be >= today
        LocalDate minDate = LocalDate.now();
        if (event.getEventDate() != null && event.getEventDate().isBefore(minDate)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Event date must be from today onwards."));
        }
        // Venue clash validation
        if (event.getVenue() != null && event.getEventDate() != null && eventRepository.existsByVenueAndEventDate(event.getVenue(), event.getEventDate())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Another event is already scheduled at this venue on this date."));
        }
        
        event.setTotalCapacity(event.getAvailableTickets());
        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Event deleted successfully."));
    }
}
