# 📋 Line-by-Line Security Code Explanation

This guide explains **every single line** of the critical security classes. This is exactly how you should explain it in an interview.

---

## 1. JwtUtils.java (The Logic)

```java
@Component // Tells Spring to manage this class as a Bean (Singleton)
public class JwtUtils {
    
    @Value("${petconnect.app.jwtSecret}") // Injects the secret key from application.properties
    private String jwtSecret;

    @Value("${petconnect.app.jwtExpirationMs}") // Injects expiration time (86400000 = 24 hours)
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        // authentication helps get the currently logged-in user's details
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder() // Starts building the JWT string
                .setSubject((userPrincipal.getUsername())) // Payload: Store the username
                .setIssuedAt(new Date()) // Payload: When was it created?
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Payload: When does it expire?
                .signWith(key(), SignatureAlgorithm.HS256) // Signature: Sign using our Secret + HS256 algorithm
                .compact(); // Finalize and turn into a string
    }

    private Key key() {
        // Converts the string secret into a safe cryptographic Key object
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public boolean validateJwtToken(String authToken) {
        try {
            // Tries to parse the token. If it's forged, expired, or tampered, it throws an error.
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true; // Token is valid!
        } catch (Exception e) {
            // Logs error if token is invalid
            return false;
        }
    }
}
```

---

## 2. JwtAuthenticationFilter.java (The Interceptor)

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter { 
    // OncePerRequestFilter guarantees this runs EXACTLY ONCE per HTTP request.

    @Autowired private JwtUtils jwtUtils; // Use our helper class
    @Autowired private UserDetailsServiceImpl userDetailsService; // Use our database clerk

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        try {
            String jwt = parseJwt(request); // 1. Extract token from Header
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) { // 2. Check if token is valid
                String username = jwtUtils.getUserNameFromJwtToken(jwt); // 3. Get username from token

                // 4. Go to Database and get full user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // 5. Create an "Authentication object" (Permission slip)
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                // 6. Give the permission slip to Spring's Security Context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // Handle errors
        }
        // 7. Let the request continue to the Controller
        filterChain.doFilter(request, response);
    }
}
```

---

## 3. SecurityConfig.java (The Rules)

```java
@Configuration // Designates this as a class where we define Spring Beans
public class SecurityConfig {

    @Bean // Tells Spring: "Keep this object in memory and use it everywhere"
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Strong hashing algorithm for passwords
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF (not needed for stateless JWT APIs)
            
            // Set session management to STATELESS. No sessions on server!
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeHttpRequests(auth ->
                auth.requestMatchers("/api/auth/**").permitAll() // Open the door for login/register
                    .anyRequest().authenticated() // Lock all other doors
            );

        // Add our Guard (Filter) BEFORE the standard username/password filter
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build(); // Finalize the security rules
    }
}
```

---

## 4. UserDetailsServiceImpl.java (The DB Bridge)

```java
@Service // Marks this as a Business Logic Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired UserRepository userRepository; // Access the "users" table

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Query database: "SELECT * FROM users WHERE username = ..."
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        // Convert our DB User to Spring's "Identitity Card" format
        return UserDetailsImpl.build(user);
    }
}
```

---

### 🔥 Interview Master Tip:
If the interviewer asks: **"What is the most important line in your Security Filter?"**
Point to: `SecurityContextHolder.getContext().setAuthentication(authentication);`
**Why?** Because this is the exact moment the user goes from being a "Stranger" to being "Authenticated" in the eyes of Spring Boot.
