package com.uml.tool.controller;

import com.uml.tool.constants.UserRoles;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.UserLoginDetailsRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserLoginDetailsRepository userLoginDetailsRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
            UserLoginDetailsRepository userLoginDetailsRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userLoginDetailsRepository = userLoginDetailsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }
        request.getSession(true);
        log.debug("Login attempt - Email: {}, Password: {}", loginRequest.getEmail(), loginRequest.getPassword());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            return ResponseEntity.ok("Login successful");
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        if (userLoginDetailsRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }
        UserLoginDetails newUser = new UserLoginDetails();
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRole(UserRoles.USER);
        newUser.setUsername(registerRequest.getUsername());
        userLoginDetailsRepository.save(newUser);
        log.debug("Register attempt - Email: {}, Password: {}", registerRequest.getEmail(),
                registerRequest.getPassword());
        return ResponseEntity.ok("User registered successfully");
    }

    // Endpoint to get current authenticated user
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            // Return the principal details. You might choose to map it to a DTO if needed.
            return ResponseEntity.ok(authentication.getPrincipal());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
    }

    @Getter
    @Setter
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Getter
    @Setter
    public static class RegisterRequest {
        private String email;
        private String password;
        private String username;
    }
}
