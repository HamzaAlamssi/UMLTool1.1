package com.uml.tool.service;

import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        userService.getAllUsers();
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetByUsername() {
        String username = "testuser";
        userService.getByUsername(username);
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testGetByEmail() {
        String email = "test@example.com";
        userService.getByEmail(email);
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void testAddUser() {
        UserLoginDetails user = new UserLoginDetails();
        user.setPassword("plain");
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any())).thenReturn(user);
        UserLoginDetails result = userService.addUser(user);
        assertEquals(user, result);
        verify(passwordEncoder, times(1)).encode("plain");
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testDeleteUserByEmail() {
        String email = "test@example.com";
        userService.deleteUserByEmail(email);
        verify(userRepository, times(1)).deleteByEmail(email);
    }

    @Test
    void testUpdateUserProfile() {
        String email = "test@example.com";
        UserLoginDetails updated = new UserLoginDetails();
        UserLoginDetails existing = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));
        when(userRepository.save(any())).thenReturn(existing);
        UserLoginDetails result = userService.updateUserProfile(email, updated);
        assertEquals(existing, result);
        verify(userRepository, times(1)).save(existing);
    }

    @Test
    void testChangePassword() {
        String email = "test@example.com";
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        userService.changePassword(email, "newpass");
        verify(userRepository, times(1)).save(user);
        verify(passwordEncoder, times(1)).encode("newpass");
    }

    @Test
    void testSearchUsers() {
        String query = "search";
        userService.searchUsers(query);
        verify(userRepository, times(1)).findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }
}
