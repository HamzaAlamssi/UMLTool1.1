package com.uml.tool.controller;

import com.uml.tool.DTO.*;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            Optional<UserLoginDetails> userOpt = userService.getUserByEmail(email);
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(toDTO(userOpt.get()));
            } else {
                return ResponseEntity.status(404).body("{\"error\":\"User not found\"}");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("{\"error\":\"Failed to get user: " + ex.getMessage() + "\"}");
        }
    }

    @PostMapping
    public UserDTO addUser(@Valid @RequestBody UserCreateDTO dto) {
        UserLoginDetails user = new UserLoginDetails();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setOccupation(dto.getOccupation());
        user.setProfileImage(dto.getProfileImage());
        user.setEmail(dto.getEmail());
        UserLoginDetails saved = userService.addUser(user);
        return toDTO(saved);
    }

    @PutMapping("/{email}")
    public ResponseEntity<?> updateUser(@PathVariable String email, @Valid @RequestBody UserUpdateDTO dto) {
        try {
            boolean changingEmail = dto.getEmail() != null && !dto.getEmail().equals(email);
            boolean changingUsername = dto.getUsername() != null && !dto.getUsername().isBlank();
            // Only check for duplicate email if actually changing email
            if (changingEmail) {
                userService.getUserByEmail(dto.getEmail()).ifPresent(existingUser -> {
                    throw new org.springframework.web.server.ResponseStatusException(
                            org.springframework.http.HttpStatus.CONFLICT, "Email already exists");
                });
            }
            // Only check for duplicate username if actually changing username
            if (changingUsername) {
                userService.findByUsername(dto.getUsername()).ifPresent(u -> {
                    if (!u.getEmail().equals(email)) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.CONFLICT, "Username already exists");
                    }
                });
            }
            UserLoginDetails updated = new UserLoginDetails();
            updated.setEmail(dto.getEmail());
            updated.setUsername(dto.getUsername());
            updated.setFirstName(dto.getFirstName());
            updated.setLastName(dto.getLastName());
            updated.setOccupation(dto.getOccupation());
            updated.setProfileImage(dto.getProfileImage());
            UserLoginDetails saved = userService.updateUserProfile(email, updated);
            return ResponseEntity.ok().body(toDTO(saved));
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            if (ex.getStatusCode() == org.springframework.http.HttpStatus.CONFLICT) {
                return ResponseEntity.status(409).body("{\"error\":\"" + ex.getReason() + "\"}");
            } else if (ex.getStatusCode() == org.springframework.http.HttpStatus.NOT_FOUND) {
                return ResponseEntity.status(404).body("{\"error\":\"User not found\"}");
            } else {
                return ResponseEntity.status(ex.getStatusCode().value()).body("{\"error\":\"" + ex.getReason() + "\"}");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(400).body("{\"error\":\"Failed to update user: " + ex.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        try {
            boolean deleted = userService.deleteUserByEmailWithResult(email);
            if (!deleted) {
                return ResponseEntity.status(404).body("{\"error\":\"User not found\"}");
            }
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("{\"error\":\"Failed to delete user: " + ex.getMessage() + "\"}");
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUsers(@RequestBody List<String> emails) {
        try {
            for (String email : emails) {
                userService.deleteUserByEmail(email);
            }
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("{\"error\":\"Failed to delete users: " + ex.getMessage() + "\"}");
        }
    }

    @PutMapping("/{email}/password")
    public ResponseEntity<?> changePassword(@PathVariable String email, @Valid @RequestBody ChangePasswordDTO dto) {
        userService.changePasswordByEmail(email, dto.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public List<UserDTO> searchUsers(@RequestParam("q") String query) {
        return userService.searchUsers(query).stream().map(this::toDTO).collect(Collectors.toList());
    }

    private UserDTO toDTO(UserLoginDetails user) {
        UserDTO dto = new UserDTO();
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setOccupation(user.getOccupation());
        dto.setProfileImage(user.getProfileImage());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        return dto;
    }
}
