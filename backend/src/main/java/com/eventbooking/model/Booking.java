package com.eventbooking.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "bookings")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name="user_id")
    private User user;
    @ManyToOne @JoinColumn(name="event_id")
    private Event event;
    private Integer numberOfTickets;
    private Double totalAmount;
    private LocalDateTime bookingDate;
    @Column(columnDefinition = "TEXT")
    private String teamMembers;
    @Column(columnDefinition = "TEXT")
    private String teamEmails;
    private String teamName;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public User getUser() { return user; } public void setUser(User user) { this.user = user; }
    public Event getEvent() { return event; } public void setEvent(Event event) { this.event = event; }
    public Integer getNumberOfTickets() { return numberOfTickets; } public void setNumberOfTickets(Integer numberOfTickets) { this.numberOfTickets = numberOfTickets; }
    public Double getTotalAmount() { return totalAmount; } public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getBookingDate() { return bookingDate; } public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    public String getTeamMembers() { return teamMembers; } public void setTeamMembers(String teamMembers) { this.teamMembers = teamMembers; }
    public String getTeamEmails() { return teamEmails; } public void setTeamEmails(String teamEmails) { this.teamEmails = teamEmails; }
    public String getTeamName() { return teamName; } public void setTeamName(String teamName) { this.teamName = teamName; }
}
