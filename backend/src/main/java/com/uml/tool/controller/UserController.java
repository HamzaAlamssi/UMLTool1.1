package com.uml.tool.controller;

import com.uml.tool.DTO.*;
import com.uml.tool.exception.UserNotFoundException;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
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

    @GetMapping("/by-username/{username}")
    public UserDTO getUserByUsername(@PathVariable String username) {
        return userService.getByUsername(username)
                .map(this::toDTO)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
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
        user.setEmail(dto.getEmail()); // Optional, for notifications/password reset
        UserLoginDetails saved = userService.addUser(user);
        return toDTO(saved);
    }

    @PutMapping("/{email}")
    public ResponseEntity<?> updateUser(@PathVariable String email, @Valid @RequestBody UserUpdateDTO dto) {
        try {
            if (dto.getUsername() != null) {
                userService.getByUsername(dto.getUsername()).ifPresent(existingUser -> {
                    if (!existingUser.getEmail().equals(email)) {
                        throw new RuntimeException("Username already exists");
                    }
                });
            }
            if (dto.getEmail() != null) {
                userService.getByEmail(dto.getEmail()).ifPresent(existingUser -> {
                    if (!existingUser.getEmail().equals(email)) {
                        throw new RuntimeException("Email already exists");
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
            return ResponseEntity.ok().body(saved);
        } catch (RuntimeException ex) {
            String msg = ex.getMessage();
            if ("Username already exists".equals(msg) || "Email already exists".equals(msg)) {
                return ResponseEntity.status(409).body("{\"error\":\"" + msg + "\"}");
            }
            // Only update email if provided (for password reset/notifications)
            if (dto.getEmail() != null) {
                existing.setEmail(dto.getEmail());
            }
            existing.setFirstName(dto.getFirstName());
            existing.setLastName(dto.getLastName());
            existing.setOccupation(dto.getOccupation());
            existing.setProfileImage(dto.getProfileImage());
            UserLoginDetails saved = userService.saveUser(existing);
            return ResponseEntity.ok().body(saved);
        } catch (Exception ex) {
            return ResponseEntity.status(400).body("{\"error\":\"Failed to update user: " + ex.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        userService.deleteUserByUsername(username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{username}/password")
    public ResponseEntity<?> changePassword(@PathVariable String username, @Valid @RequestBody ChangePasswordDTO dto) {
        userService.changePasswordByUsername(username, dto.getNewPassword());
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
