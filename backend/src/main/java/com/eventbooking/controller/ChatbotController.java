package com.eventbooking.controller;
import com.eventbooking.dto.ChatRequest;
import com.eventbooking.dto.ChatResponse;
import com.eventbooking.model.Event;
import com.eventbooking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    @Autowired
    private EventRepository eventRepository;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=";
    private final String GEMINI_API_KEY = "AIzaSyCAMP_w2YEY16g3ZRbKZ2eFiM72PcqQVL0";

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String query = request.getQuery();
        String context = request.getPageContext();
        
        try {
            // Build dynamic context from database
            List<Event> events = eventRepository.findAll();
            StringBuilder eventsContext = new StringBuilder("Here is the list of active events currently in the system:\n");
            if (events.isEmpty()) {
                eventsContext.append("There are currently no active events.\n");
            } else {
                for (Event e : events) {
                    eventsContext.append(String.format("- %s (Category: %s, Date: %s, Price: ₹%.2f, Available Tickets: %d, Venue: %s)\n",
                            e.getName(), e.getCategory(), e.getEventDate(), e.getRegistrationFee(), e.getAvailableTickets(), e.getVenue()));
                }
            }

            String systemPrompt = "You are the 'Campus Assistant', an AI helper for the Nexus Smart Campus Event Ticket Booking System. " +
                                  "Be helpful, concise, and friendly. " +
                                  "The user is currently on the portal page context: " + context + ". " +
                                  "Answer their questions as best as you can. " +
                                  "Use the following real-time database information to answer questions about available events accurately. If they ask about an event, tell them about it:\n" +
                                  eventsContext.toString();

            String fullPrompt = systemPrompt + "\n\nUser Question: " + query;

            // Construct Gemini Payload
            Map<String, Object> body = new java.util.HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> contentMap = new java.util.HashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> partMap = new java.util.HashMap<>();
            
            partMap.put("text", fullPrompt);
            parts.add(partMap);
            contentMap.put("parts", parts);
            contents.add(contentMap);
            body.put("contents", contents);

            String requestUrl = GEMINI_API_URL + GEMINI_API_KEY;
            
            ObjectMapper mapper = new ObjectMapper();
            String jsonBody = mapper.writeValueAsString(body);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(requestUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                Map<String, Object> respMap = mapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) respMap.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                    if (content != null) {
                        List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
                        if (resParts != null && !resParts.isEmpty()) {
                            String reply = (String) resParts.get(0).get("text");
                            return ResponseEntity.ok(new ChatResponse(reply));
                        }
                    }
                }
            } else {
                System.err.println("Gemini API Error Response: " + response.body());
                return ResponseEntity.ok(new ChatResponse(getFallbackResponse(query, context, eventRepository)));
            }
            
            return ResponseEntity.ok(new ChatResponse("I am experiencing a temporary connection issue. Please try again later."));

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Gemini API Failed. Falling back to dynamic mock logic.");
            return ResponseEntity.ok(new ChatResponse(getFallbackResponse(query, context, eventRepository)));
        }
    }

    private String getFallbackResponse(String query, String context, EventRepository eventRepository) {
        query = query.toLowerCase();
        context = context.toLowerCase();

        if (context.contains("admin") || context.contains("create event")) {
            if (query.contains("date") || query.contains("may 2026") || query.contains("when")) {
                return "As an admin, please ensure the event date is set to today's date or later, otherwise the system will reject it.";
            } else if (query.contains("venue") || query.contains("clash") || query.contains("where")) {
                return "The system checks for venue clashes. Two events cannot be hosted at the same venue on the same date. Make sure to check the Active Events Registry below before creating one.";
            } else if (query.contains("hello") || query.contains("hi") || query.contains("hey")) {
                return "Hello Admin! I'm currently running in Fallback Mode. How can I help you manage events?";
            } else {
                return "I see you are managing events as an admin. Remember to double-check the venue availability and ensure dates are set correctly. If you have specific questions about creating events, teams, or refunds, just ask!";
            }
        } else {
            if (query.contains("fee") || query.contains("price") || query.contains("money") || query.contains("pay")) {
                return "The fees are listed in Rupees (₹). The total amount is automatically calculated based on the number of tickets you select (or the team fee if it's a team event).";
            } else if (query.contains("team") || query.contains("group")) {
                return "If an event is a 'Team' event, you will need to provide a Team Name and the details of all your team members during checkout. The booking counts as one single team registration.";
            } else if (query.contains("event") || query.contains("available") || query.contains("what")) {
                List<Event> events = eventRepository.findAll();
                if (events.isEmpty()) return "There are currently no active events scheduled. Please check back later!";
                StringBuilder sb = new StringBuilder("Here is what is currently available:\n");
                for (Event e : events) {
                    sb.append("- ").append(e.getName()).append(" on ").append(e.getEventDate()).append(" (Tickets left: ").append(e.getAvailableTickets()).append(")\n");
                }
                return sb.toString();
            } else if (query.contains("hello") || query.contains("hi") || query.contains("hey")) {
                return "Hello! I'm here to help you browse events and book tickets. Ask me what events are available!";
            } else {
                return "You are currently viewing the student dashboard. To book an event, click 'Initiate Booking' on an event card, fill in the required details, and confirm.";
            }
        }
    }
}
