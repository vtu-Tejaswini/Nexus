package com.eventbooking.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
@Entity
@Table(name = "events")
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(columnDefinition = "TEXT")
    private String guidelines;
    private String category;
    private String participationType;
    private Integer teamSize;
    private Double registrationFee;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venue;
    private Integer availableTickets;
    private Integer totalCapacity;
    private String organizerContact;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public String getGuidelines() { return guidelines; } public void setGuidelines(String guidelines) { this.guidelines = guidelines; }
    public String getCategory() { return category; } public void setCategory(String category) { this.category = category; }
    public String getParticipationType() { return participationType; } public void setParticipationType(String participationType) { this.participationType = participationType; }
    public Integer getTeamSize() { return teamSize; } public void setTeamSize(Integer teamSize) { this.teamSize = teamSize; }
    public Double getRegistrationFee() { return registrationFee; } public void setRegistrationFee(Double registrationFee) { this.registrationFee = registrationFee; }
    public LocalDate getEventDate() { return eventDate; } public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public LocalTime getEventTime() { return eventTime; } public void setEventTime(LocalTime eventTime) { this.eventTime = eventTime; }
    public String getVenue() { return venue; } public void setVenue(String venue) { this.venue = venue; }
    public Integer getAvailableTickets() { return availableTickets; } public void setAvailableTickets(Integer availableTickets) { this.availableTickets = availableTickets; }
    public Integer getTotalCapacity() { return totalCapacity; } public void setTotalCapacity(Integer totalCapacity) { this.totalCapacity = totalCapacity; }
    public String getOrganizerContact() { return organizerContact; } public void setOrganizerContact(String organizerContact) { this.organizerContact = organizerContact; }
}
