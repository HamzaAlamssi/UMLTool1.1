package com.uml.tool.service;

import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserLoginDetails> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserLoginDetails> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserLoginDetails addUser(UserLoginDetails user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUserByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    @Transactional
    public boolean deleteUserByEmailWithResult(String email) {
        if (!userRepository.existsByEmail(email)) {
            return false;
        }
        userRepository.deleteByEmail(email);
        return true;
    }

    public UserLoginDetails updateUserProfile(String email, UserLoginDetails updated) {
        return userRepository.findByEmail(email).map(user -> {
            if (updated.getEmail() != null && !updated.getEmail().equals(email)) {
                user.setEmail(updated.getEmail());
            }
            if (updated.getUsername() != null) {
                user.setUsername(updated.getUsername());
            }
            if (updated.getFirstName() != null) {
                user.setFirstName(updated.getFirstName());
            }
            if (updated.getLastName() != null) {
                user.setLastName(updated.getLastName());
            }
            if (updated.getOccupation() != null) {
                user.setOccupation(updated.getOccupation());
            }
            if (updated.getProfileImage() != null) {
                user.setProfileImage(updated.getProfileImage());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "User not found"));
    }

    public boolean changePasswordWithResult(String email, String newPassword) {
        return userRepository.findByEmail(email).map(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }).orElse(false);
    }

    public void changePasswordByEmail(String email, String newPassword) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        });
    }

    public List<UserLoginDetails> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    public UserLoginDetails saveUser(UserLoginDetails user) {
        return userRepository.save(user);
    }

    public Optional<UserLoginDetails> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<UserLoginDetails> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
