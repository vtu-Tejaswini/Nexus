package com.eventbooking.repository;
import com.eventbooking.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
public interface EventRepository extends JpaRepository<Event, Long> {
    boolean existsByVenueAndEventDate(String venue, LocalDate eventDate);
}
