package com.uml.tool.service;

import com.uml.tool.constants.UserRoles;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private com.uml.tool.repository.ProjectRepository projectRepository;
    @Mock
    private com.uml.tool.repository.GroupRepository groupRepository;
    @Mock
    private com.uml.tool.repository.GroupMemberRepository groupMemberRepository;
    @Mock
    private ProjectService projectService;
    @InjectMocks
    private AdminService adminService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddAdmin() {
        UserLoginDetails admin = new UserLoginDetails();
        admin.setPassword("plain");
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any())).thenReturn(admin);
        UserLoginDetails result = adminService.addAdmin(admin);
        assertEquals(UserRoles.ADMIN, result.getRole());
        verify(passwordEncoder, times(1)).encode("plain");
        verify(userRepository, times(1)).save(admin);
    }

    @Test
    void testAddUser_Duplicate() {
        UserLoginDetails user = new UserLoginDetails();
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        assertThrows(ResponseStatusException.class, () -> adminService.addUser(user));
    }

    @Test
    void testDeleteUserByEmail() {
        String email = "test@example.com";
        when(projectRepository.findAll()).thenReturn(java.util.Collections.emptyList());
        when(groupMemberRepository.findAll()).thenReturn(java.util.Collections.emptyList());
        adminService.deleteUserByEmail(email);
        verify(userRepository, times(1)).deleteByEmail(email);
    }

    @Test
    void testGetAllUsers() {
        adminService.getAllUsers();
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetAdminByEmail() {
        UserLoginDetails admin = new UserLoginDetails();
        admin.setRole(UserRoles.ADMIN);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(admin));
        Optional<UserLoginDetails> result = adminService.getAdminByEmail("test@example.com");
        assertTrue(result.isPresent());
        assertEquals(UserRoles.ADMIN, result.get().getRole());
    }

    @Test
    void testUpdateAdminProfile() {
        String email = "test@example.com";
        UserLoginDetails updated = new UserLoginDetails();
        UserLoginDetails existing = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));
        when(userRepository.save(any())).thenReturn(existing);
        UserLoginDetails result = adminService.updateAdminProfile(email, updated);
        assertEquals(existing, result);
        verify(userRepository, times(1)).save(existing);
    }

    @Test
    void testUpdateAdminProfile_AdminNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertThrows(Exception.class, () -> adminService.updateAdminProfile("email", new UserLoginDetails()));
    }
}
