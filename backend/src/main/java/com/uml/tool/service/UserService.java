package com.uml.tool.service;

import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public Optional<UserLoginDetails> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserLoginDetails addUser(UserLoginDetails user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void deleteUserByUsername(String username) {
        userRepository.deleteById(username);
    }

    public boolean deleteUserByEmailWithResult(String email) {
        if (!userRepository.existsByEmail(email)) {
            return false;
        }
        userRepository.deleteByEmail(email);
        return true;
    }

    public UserLoginDetails updateUserProfile(String email, UserLoginDetails updated) {
        return userRepository.findByEmail(email).map(user -> {
            user.setFirstName(updated.getFirstName());
            user.setLastName(updated.getLastName());
            user.setOccupation(updated.getOccupation());
            user.setProfileImage(updated.getProfileImage());
            return userRepository.save(user);
        }).orElseThrow();
    }

    public void changePasswordByUsername(String username, String newPassword) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        });
    }

    public boolean changePasswordWithResult(String email, String newPassword) {
        return userRepository.findByEmail(email).map(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }).orElse(false);
    }

    public List<UserLoginDetails> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query);
    }

    public UserLoginDetails saveUser(UserLoginDetails user) {
        return userRepository.save(user);
    }
}
