import os

base_dir = r"c:\Users\DELL\Desktop\Smart campus Event ticket booking system\backend\src\main\java\com\eventbooking"

directories = [
    "model", "repository", "security", "dto", "service", "controller", "config"
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = {}

# MODELS
files["model/Role.java"] = """package com.eventbooking.model;
public enum Role {
    ROLE_STUDENT,
    ROLE_ADMIN
}
"""

files["model/User.java"] = """package com.eventbooking.model;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    @JsonIgnore
    private String password;
    private String department;
    @Enumerated(EnumType.STRING)
    private Role role;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
    public String getDepartment() { return department; } public void setDepartment(String department) { this.department = department; }
    public Role getRole() { return role; } public void setRole(Role role) { this.role = role; }
}
"""

files["model/Event.java"] = """package com.eventbooking.model;
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
    public String getOrganizerContact() { return organizerContact; } public void setOrganizerContact(String organizerContact) { this.organizerContact = organizerContact; }
}
"""

files["model/Booking.java"] = """package com.eventbooking.model;
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
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public User getUser() { return user; } public void setUser(User user) { this.user = user; }
    public Event getEvent() { return event; } public void setEvent(Event event) { this.event = event; }
    public Integer getNumberOfTickets() { return numberOfTickets; } public void setNumberOfTickets(Integer numberOfTickets) { this.numberOfTickets = numberOfTickets; }
    public Double getTotalAmount() { return totalAmount; } public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getBookingDate() { return bookingDate; } public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
}
"""

# REPOSITORIES
files["repository/UserRepository.java"] = """package com.eventbooking.repository;
import com.eventbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
"""

files["repository/EventRepository.java"] = """package com.eventbooking.repository;
import com.eventbooking.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
public interface EventRepository extends JpaRepository<Event, Long> {
    boolean existsByVenueAndEventDate(String venue, LocalDate eventDate);
}
"""

files["repository/BookingRepository.java"] = """package com.eventbooking.repository;
import com.eventbooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
}
"""

# DTOS
files["dto/AuthRequest.java"] = """package com.eventbooking.dto;
public class AuthRequest {
    private String email;
    private String password;
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
}
"""

files["dto/RegisterRequest.java"] = """package com.eventbooking.dto;
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String department;
    private String adminSecret;
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
    public String getDepartment() { return department; } public void setDepartment(String department) { this.department = department; }
    public String getAdminSecret() { return adminSecret; } public void setAdminSecret(String adminSecret) { this.adminSecret = adminSecret; }
}
"""

files["dto/JwtResponse.java"] = """package com.eventbooking.dto;
import com.eventbooking.model.User;
public class JwtResponse {
    private String token;
    private User user;
    public JwtResponse(String token, User user) { this.token = token; this.user = user; }
    public String getToken() { return token; }
    public User getUser() { return user; }
}
"""

files["dto/MessageResponse.java"] = """package com.eventbooking.dto;
public class MessageResponse {
    private String message;
    public MessageResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
}
"""

files["dto/BookingRequest.java"] = """package com.eventbooking.dto;
public class BookingRequest {
    private Long eventId;
    private Integer numberOfTickets;
    public Long getEventId() { return eventId; } public void setEventId(Long eventId) { this.eventId = eventId; }
    public Integer getNumberOfTickets() { return numberOfTickets; } public void setNumberOfTickets(Integer numberOfTickets) { this.numberOfTickets = numberOfTickets; }
}
"""

# SECURITY
files["security/UserDetailsImpl.java"] = """package com.eventbooking.security;
import com.eventbooking.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {
    private User user;
    public UserDetailsImpl(User user) { this.user = user; }
    public User getUser() { return user; }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()));
    }
    @Override public String getPassword() { return user.getPassword(); }
    @Override public String getUsername() { return user.getEmail(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
"""

files["security/UserDetailsServiceImpl.java"] = """package com.eventbooking.security;
import com.eventbooking.model.User;
import com.eventbooking.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    public UserDetailsServiceImpl(UserRepository userRepository) { this.userRepository = userRepository; }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + username));
        return new UserDetailsImpl(user);
    }
}
"""

files["security/JwtUtils.java"] = """package com.eventbooking.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${app.jwtSecret}")
    private String jwtSecret;
    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
               .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (JwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        }
        return false;
    }
}
"""

files["security/AuthTokenFilter.java"] = """package com.eventbooking.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired private JwtUtils jwtUtils;
    @Autowired private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            System.out.println("Cannot set user authentication: " + e);
        }
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
"""

files["config/SecurityConfig.java"] = """package com.eventbooking.config;
import com.eventbooking.security.AuthTokenFilter;
import com.eventbooking.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    public SecurityConfig(UserDetailsServiceImpl userDetailsService) { this.userDetailsService = userDetailsService; }

    @Bean public AuthTokenFilter authenticationJwtTokenFilter() { return new AuthTokenFilter(); }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/events/public/**").permitAll()
                .requestMatchers("/api/chat/**").permitAll()
                .anyRequest().authenticated()
            );
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
"""

files["controller/AuthController.java"] = """package com.eventbooking.controller;
import com.eventbooking.dto.*;
import com.eventbooking.model.Role;
import com.eventbooking.model.User;
import com.eventbooking.repository.UserRepository;
import com.eventbooking.security.JwtUtils;
import com.eventbooking.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired AuthenticationManager authenticationManager;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    private static final String ADMIN_SECRET = "SECRET_ADMIN_2026";

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUser()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setDepartment(signUpRequest.getDepartment());
        
        if (ADMIN_SECRET.equals(signUpRequest.getAdminSecret())) {
            user.setRole(Role.ROLE_ADMIN);
        } else {
            user.setRole(Role.ROLE_STUDENT);
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully as " + user.getRole().name()));
    }
}
"""

files["controller/EventController.java"] = """package com.eventbooking.controller;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        // Date validation: must be >= May 2026
        LocalDate minDate = LocalDate.of(2026, 5, 1);
        if (event.getEventDate().isBefore(minDate)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Event date must be from May 2026 onwards."));
        }
        // Venue clash validation
        if (eventRepository.existsByVenueAndEventDate(event.getVenue(), event.getEventDate())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Another event is already scheduled at this venue on this date."));
        }
        
        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Event deleted successfully."));
    }
}
"""

files["controller/BookingController.java"] = """package com.eventbooking.controller;
import com.eventbooking.dto.BookingRequest;
import com.eventbooking.dto.MessageResponse;
import com.eventbooking.model.Booking;
import com.eventbooking.model.Event;
import com.eventbooking.model.User;
import com.eventbooking.repository.BookingRepository;
import com.eventbooking.repository.EventRepository;
import com.eventbooking.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired BookingRepository bookingRepository;
    @Autowired EventRepository eventRepository;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> bookTickets(@RequestBody BookingRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userDetails.getUser();
        
        Optional<Event> eventOpt = eventRepository.findById(request.getEventId());
        if (!eventOpt.isPresent()) return ResponseEntity.badRequest().body(new MessageResponse("Error: Event not found."));
        
        Event event = eventOpt.get();
        if (event.getAvailableTickets() < request.getNumberOfTickets()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not enough tickets available."));
        }
        
        // Update tickets
        event.setAvailableTickets(event.getAvailableTickets() - request.getNumberOfTickets());
        eventRepository.save(event);
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setNumberOfTickets(request.getNumberOfTickets());
        booking.setTotalAmount(event.getRegistrationFee() * request.getNumberOfTickets());
        booking.setBookingDate(LocalDateTime.now());
        
        bookingRepository.save(booking);
        return ResponseEntity.ok(new MessageResponse("Tickets booked successfully."));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Booking> getMyBookings() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return bookingRepository.findByUserId(userDetails.getUser().getId());
    }
}
"""

files["dto/ChatRequest.java"] = """package com.eventbooking.dto;
public class ChatRequest {
    private String query;
    private String pageContext;
    public String getQuery() { return query; } public void setQuery(String query) { this.query = query; }
    public String getPageContext() { return pageContext; } public void setPageContext(String pageContext) { this.pageContext = pageContext; }
}
"""

files["dto/ChatResponse.java"] = """package com.eventbooking.dto;
public class ChatResponse {
    private String response;
    public ChatResponse(String response) { this.response = response; }
    public String getResponse() { return response; }
}
"""

files["controller/ChatbotController.java"] = """package com.eventbooking.controller;
import com.eventbooking.dto.ChatRequest;
import com.eventbooking.dto.ChatResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String query = request.getQuery().toLowerCase();
        String context = request.getPageContext().toLowerCase();
        String reply = "I am here to help you. ";
        
        // MOCK AI LOGIC FOR CONTEXT-AWARENESS
        if (context.contains("admin") && context.contains("event")) {
            if (query.contains("date") || query.contains("may 2026")) {
                reply = "As an admin, please ensure the event date is set to May 2026 or later, otherwise the system will reject it.";
            } else if (query.contains("venue") || query.contains("clash")) {
                reply = "The system checks for venue clashes. Two events cannot be hosted at the same venue on the same date.";
            } else if (query.contains("description")) {
                reply = "Make sure to write a detailed description. Students will rely on this, along with guidelines, to understand the event format and rules.";
            } else {
                reply = "You are on the Admin Event Creation page. I can help you fill out the form. You need to provide a name, description, category, venue, and fee in Rupees (₹).";
            }
        } else if (context.contains("student") || context.contains("booking")) {
            if (query.contains("fee") || query.contains("price")) {
                reply = "The fees are listed in Rupees (₹). You will see the total amount automatically calculated based on the number of tickets you select.";
            } else if (query.contains("how many")) {
                reply = "You can book tickets as long as the available ticket count is greater than zero. The system will prevent you from booking more tickets than are available.";
            } else {
                reply = "You are currently viewing the event details/booking page. Select the number of tickets you want and confirm. Make sure you have enough available tickets!";
            }
        } else {
            if (query.contains("register") || query.contains("admin")) {
                reply = "To register as an admin, you must enter the secret Admin Key ('SECRET_ADMIN_2026'). Otherwise, you will be registered as a student.";
            } else {
                reply = "Welcome to the Smart Campus Event Booking portal! Navigate to the dashboard to see events or create new ones.";
            }
        }
        
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
"""

for path, content in files.items():
    with open(os.path.join(base_dir, path), "w", encoding="utf-8") as f:
        f.write(content)

print("Backend files generated successfully!")
