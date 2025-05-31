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
    void testSearchUsers() {
        String query = "search";
        userService.searchUsers(query);
        verify(userRepository, times(1)).findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    @Test
    void testUpdateUserProfile_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertThrows(Exception.class, () -> userService.updateUserProfile("email", new UserLoginDetails()));
    }

    @Test
    void testChangePassword() {
        String email = "test@example.com";
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        userService.changePasswordByEmail(email, "newpass");
        verify(userRepository, times(1)).save(user);
        verify(passwordEncoder, times(1)).encode("newpass");
    }

    @Test
    void testChangePassword_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertDoesNotThrow(() -> userService.changePasswordByEmail("email", "newpass"));
    }

    @Test
    void testDeleteUserByEmailWithResult_UserDoesNotExist() {
        String email = "notfound@example.com";
        when(userRepository.existsByEmail(email)).thenReturn(false);
        boolean result = userService.deleteUserByEmailWithResult(email);
        assertFalse(result);
        verify(userRepository, never()).deleteByEmail(anyString());
    }

    @Test
    void testDeleteUserByEmailWithResult_UserExists() {
        String email = "found@example.com";
        when(userRepository.existsByEmail(email)).thenReturn(true);
        boolean result = userService.deleteUserByEmailWithResult(email);
        assertTrue(result);
        verify(userRepository, times(1)).deleteByEmail(email);
    }

    @Test
    void testChangePasswordWithResult_UserExists() {
        String email = "test@example.com";
        String newPassword = "newpass";
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(newPassword)).thenReturn("encoded");
        boolean result = userService.changePasswordWithResult(email, newPassword);
        assertTrue(result);
        verify(userRepository, times(1)).save(user);
        verify(passwordEncoder, times(1)).encode(newPassword);
    }

    @Test
    void testChangePasswordWithResult_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        boolean result = userService.changePasswordWithResult("notfound@example.com", "pass");
        assertFalse(result);
    }

    @Test
    void testSaveUser() {
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.save(user)).thenReturn(user);
        UserLoginDetails result = userService.saveUser(user);
        assertEquals(user, result);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testUpdateUserProfile_ProfileImageSet() {
        String email = "test@example.com";
        UserLoginDetails updated = new UserLoginDetails();
        updated.setProfileImage("imgdata");
        UserLoginDetails existing = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));
        when(userRepository.save(any())).thenReturn(existing);
        userService.updateUserProfile(email, updated);
        assertEquals("imgdata", existing.getProfileImage());
    }

    @Test
    void testUpdateUserProfile_EmailChanged() {
        String email = "old@example.com";
        UserLoginDetails updated = new UserLoginDetails();
        updated.setEmail("new@example.com");
        UserLoginDetails existing = new UserLoginDetails();
        existing.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));
        when(userRepository.save(any())).thenReturn(existing);
        userService.updateUserProfile(email, updated);
        assertEquals("new@example.com", existing.getEmail());
    }
}
