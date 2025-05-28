package com.uml.tool.controller;

import com.uml.tool.DTO.UserCreateDTO;
import com.uml.tool.DTO.UserDTO;
import com.uml.tool.DTO.UserUpdateDTO;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping("/add-admin")
    public UserDTO addAdmin(@RequestBody UserCreateDTO dto) {
        UserLoginDetails admin = new UserLoginDetails();
        admin.setEmail(dto.getEmail());
        admin.setUsername(dto.getUsername());
        admin.setPassword(dto.getPassword());
        admin.setFirstName(dto.getFirstName());
        admin.setLastName(dto.getLastName());
        admin.setOccupation(dto.getOccupation());
        admin.setProfileImage(dto.getProfileImage());
        UserLoginDetails saved = adminService.addAdmin(admin);
        return toDTO(saved);
    }

    @PostMapping("/add-user")
    public UserDTO addUser(@RequestBody UserCreateDTO dto) {
        UserLoginDetails user = new UserLoginDetails();
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setOccupation(dto.getOccupation());
        user.setProfileImage(dto.getProfileImage());
        user.setRole(com.uml.tool.constants.UserRoles.USER);
        UserLoginDetails saved = adminService.addUser(user);
        return toDTO(saved);
    }

    @DeleteMapping("/delete-user/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        adminService.deleteUserByUsername(username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return adminService.getAllUsers().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PutMapping("/profile/{email}")
    public UserDTO updateAdminProfile(@PathVariable String email, @RequestBody UserUpdateDTO dto) {
        UserLoginDetails updated = new UserLoginDetails();
        updated.setEmail(dto.getEmail());
        updated.setUsername(dto.getUsername());
        updated.setFirstName(dto.getFirstName());
        updated.setLastName(dto.getLastName());
        updated.setOccupation(dto.getOccupation());
        updated.setProfileImage(dto.getProfileImage());
        UserLoginDetails saved = adminService.updateAdminProfile(email, updated);
        return toDTO(saved);
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
