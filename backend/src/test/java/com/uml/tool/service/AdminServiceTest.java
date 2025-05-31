package com.uml.tool.service;

import com.uml.tool.constants.UserRoles;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.model.Project;
import com.uml.tool.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
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

    @Test
    void testAddUser_Success() {
        UserLoginDetails user = new UserLoginDetails();
        user.setEmail("unique@example.com");
        user.setPassword("plain");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any())).thenReturn(user);
        UserLoginDetails result = adminService.addUser(user);
        assertEquals(UserRoles.USER, result.getRole());
        assertEquals("encoded", result.getPassword());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testGetAdminByEmail_NotAdmin() {
        UserLoginDetails user = new UserLoginDetails();
        user.setRole(UserRoles.USER);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        Optional<UserLoginDetails> result = adminService.getAdminByEmail("test@example.com");
        assertTrue(result.isEmpty());
    }

    @Test
    void testDeleteUserByEmail_ProjectsOwned() {
        String email = "owner@example.com";
        UserLoginDetails owner = new UserLoginDetails();
        owner.setEmail(email);
        Project project1 = new Project();
        project1.setId(1L);
        project1.setOwner(owner);
        Project project2 = new Project();
        project2.setId(2L);
        project2.setOwner(owner);
        List<Project> projects = List.of(project1, project2);
        when(projectRepository.findAll()).thenReturn(projects);
        when(groupMemberRepository.findAll()).thenReturn(java.util.Collections.emptyList());
        doNothing().when(projectService).deleteProject(anyLong());
        adminService.deleteUserByEmail(email);
        verify(projectService, times(2)).deleteProject(anyLong());
        verify(userRepository, times(1)).deleteByEmail(email);
    }

    @Test
    void testDeleteUserByEmail_ProjectsNotOwned() {
        String email = "notowner@example.com";
        UserLoginDetails owner = new UserLoginDetails();
        owner.setEmail("someoneelse@example.com");
        Project project1 = new Project();
        project1.setId(1L);
        project1.setOwner(owner);
        List<Project> projects = List.of(project1);
        when(projectRepository.findAll()).thenReturn(projects);
        when(groupMemberRepository.findAll()).thenReturn(java.util.Collections.emptyList());
        adminService.deleteUserByEmail(email);
        verify(projectService, never()).deleteProject(anyLong());
        verify(userRepository, times(1)).deleteByEmail(email);
    }

    @Test
    void testDeleteUserByEmail_ProjectsMixedOwnership() {
        String email = "owner@example.com";
        UserLoginDetails owner = new UserLoginDetails();
        owner.setEmail(email);
        UserLoginDetails notOwner = new UserLoginDetails();
        notOwner.setEmail("someoneelse@example.com");
        Project project1 = new Project();
        project1.setId(1L);
        project1.setOwner(owner);
        Project project2 = new Project();
        project2.setId(2L);
        project2.setOwner(notOwner);
        Project project3 = new Project();
        project3.setId(3L);
        project3.setOwner(null);
        List<Project> projects = List.of(project1, project2, project3);
        when(projectRepository.findAll()).thenReturn(projects);
        when(groupMemberRepository.findAll()).thenReturn(java.util.Collections.emptyList());
        doNothing().when(projectService).deleteProject(anyLong());
        adminService.deleteUserByEmail(email);
        verify(projectService, times(1)).deleteProject(1L);
        verify(projectService, never()).deleteProject(2L);
        verify(projectService, never()).deleteProject(3L);
        verify(userRepository, times(1)).deleteByEmail(email);
    }

    @Test
    void testDeleteUserByEmail_GroupMembersFilterCoverage() {
        String email = "target@example.com";
        UserLoginDetails user1 = new UserLoginDetails();
        user1.setEmail(email);
        UserLoginDetails user2 = new UserLoginDetails();
        user2.setEmail("other@example.com");
        com.uml.tool.model.GroupMember member1 = com.uml.tool.model.GroupMember.builder().user(user1).build();
        com.uml.tool.model.GroupMember member2 = com.uml.tool.model.GroupMember.builder().user(user2).build();
        List<com.uml.tool.model.GroupMember> members = List.of(member1, member2);
        when(projectRepository.findAll()).thenReturn(java.util.Collections.emptyList());
        when(groupMemberRepository.findAll()).thenReturn(members);
        adminService.deleteUserByEmail(email);
        verify(userRepository, times(1)).deleteByEmail(email);
    }
}
