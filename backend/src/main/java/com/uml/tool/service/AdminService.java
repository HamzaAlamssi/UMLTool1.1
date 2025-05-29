package com.uml.tool.service;

import com.uml.tool.constants.UserRoles;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserLoginDetails addAdmin(UserLoginDetails admin) {
        admin.setRole(UserRoles.ADMIN);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return userRepository.save(admin);
    }

    public UserLoginDetails addUser(UserLoginDetails user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with this username already exists.");
        }
        user.setRole(UserRoles.USER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<UserLoginDetails> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserLoginDetails> getAdminByUsername(String username) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getRole() == UserRoles.ADMIN);
    }

    public UserLoginDetails updateAdminProfile(String username, UserLoginDetails updated) {
        return userRepository.findByUsername(username).map(admin -> {
            admin.setFirstName(updated.getFirstName());
            admin.setLastName(updated.getLastName());
            admin.setUsername(updated.getUsername());
            admin.setOccupation(updated.getOccupation());
            admin.setProfileImage(updated.getProfileImage());
            return userRepository.save(admin);
        }).orElseThrow();
    }

    public void deleteUserByUsername(String username) {
        userRepository.deleteById(username);
    }
}