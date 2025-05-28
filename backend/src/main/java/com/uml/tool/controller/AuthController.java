package com.uml.tool.controller;

import com.uml.tool.constants.UserRoles;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.UserLoginDetailsRepository;
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
    public ResponseEntity<?> login(@RequestBody UserLoginDetails loginDetails) {
        log.info("Attempting login for username: {}", loginDetails.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDetails.getUsername(), loginDetails.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("Login successful for username: {}", loginDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (AuthenticationException e) {
            log.error("Login failed for username: {}. Reason: {}", loginDetails.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
    @GetMapping("/aUser")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
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
