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

    public UserLoginDetails updateUserProfile(String username, UserLoginDetails updated) {
        return userRepository.findByUsername(username).map(user -> {
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

    public List<UserLoginDetails> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query);
    }

    public UserLoginDetails saveUser(UserLoginDetails user) {
        return userRepository.save(user);
    }
}
