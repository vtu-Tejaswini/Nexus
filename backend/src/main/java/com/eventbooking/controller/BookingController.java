package com.eventbooking.controller;
import com.eventbooking.dto.BookingRequest;
import com.eventbooking.dto.MessageResponse;
import com.eventbooking.model.Booking;
import com.eventbooking.model.Event;
import com.eventbooking.model.User;
import com.eventbooking.repository.BookingRepository;
import com.eventbooking.repository.EventRepository;
import com.eventbooking.repository.UserRepository;
import com.eventbooking.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired BookingRepository bookingRepository;
    @Autowired EventRepository eventRepository;
    @Autowired UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<?> bookTickets(@RequestBody java.util.Map<String, Object> payload) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userDetails.getUser();
        
        Long eventId = Long.valueOf(payload.get("eventId").toString());
        Integer numberOfTickets = Integer.valueOf(payload.get("numberOfTickets").toString());
        
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent()) return ResponseEntity.badRequest().body(new MessageResponse("Error: Event not found."));
        
        Event event = eventOpt.get();
        if (event.getAvailableTickets() < numberOfTickets) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not enough tickets available."));
        }
        
        // Verify team member emails exist
        Object teamMembersObj = payload.get("teamMembers");
        String namesStr = null;
        String emailsStr = null;
        
        if (teamMembersObj instanceof List) {
            List<?> teamList = (List<?>) teamMembersObj;
            if (!teamList.isEmpty()) {
                java.util.List<String> namesList = new java.util.ArrayList<>();
                java.util.List<String> emailsList = new java.util.ArrayList<>();
                
                for (Object item : teamList) {
                    if (item instanceof java.util.Map) {
                        java.util.Map<?, ?> tm = (java.util.Map<?, ?>) item;
                        String email = tm.get("email") != null ? tm.get("email").toString().trim() : "";
                        String name = tm.get("name") != null ? tm.get("name").toString().trim() : "";
                        
                        if (!email.isEmpty()) {
                            if (!userRepository.existsByEmail(email)) {
                                return ResponseEntity.badRequest().body(new MessageResponse("Error: User with email " + email + " does not have an account. Please ask them to register first."));
                            }
                            emailsList.add(email);
                            namesList.add(name);
                        }
                    }
                }
                if (!namesList.isEmpty()) {
                    namesStr = String.join(", ", namesList);
                    emailsStr = String.join(", ", emailsList);
                }
            }
        }
        
        // Update tickets
        event.setAvailableTickets(event.getAvailableTickets() - numberOfTickets);
        eventRepository.save(event);
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setNumberOfTickets(numberOfTickets);
        booking.setTotalAmount(event.getRegistrationFee() * numberOfTickets);
        booking.setBookingDate(LocalDateTime.now());
        
        if (payload.get("teamName") != null) {
            booking.setTeamName(payload.get("teamName").toString().trim());
        }
        
        if (namesStr != null) {
            booking.setTeamMembers(namesStr);
            booking.setTeamEmails(emailsStr);
        }
        
        bookingRepository.save(booking);
        return ResponseEntity.ok(new MessageResponse("Tickets booked successfully."));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public List<Booking> getMyBookings() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userDetails.getUser();
        return bookingRepository.findByUserIdOrTeamEmailsContaining(user.getId(), user.getEmail());
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Booking> getEventBookings(@PathVariable Long eventId) {
        return bookingRepository.findByEventId(eventId);
    }
}
