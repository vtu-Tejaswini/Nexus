package com.eventbooking.dto;

import java.util.List;

public class BookingRequest {
    private Long eventId;
    private Integer numberOfTickets;
    private String teamName;
    private List<java.util.Map<String, String>> teamMembers;

    public Long getEventId() { return eventId; } 
    public void setEventId(Long eventId) { this.eventId = eventId; }
    
    public Integer getNumberOfTickets() { return numberOfTickets; } 
    public void setNumberOfTickets(Integer numberOfTickets) { this.numberOfTickets = numberOfTickets; }
    
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    
    public List<java.util.Map<String, String>> getTeamMembers() { return teamMembers; } 
    public void setTeamMembers(List<java.util.Map<String, String>> teamMembers) { this.teamMembers = teamMembers; }
}
