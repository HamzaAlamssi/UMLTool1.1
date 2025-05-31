package com.uml.tool.service;

import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.ProjectRepository;
import com.uml.tool.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceTest {
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private com.uml.tool.repository.MessageRepository messageRepository;
    @Mock
    private com.uml.tool.repository.GroupRepository groupRepository;
    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProject() {
        String name = "Test Project";
        String ownerEmail = "owner@example.com";
        UserLoginDetails owner = new UserLoginDetails();
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        Project project = new Project();
        when(projectRepository.save(any())).thenReturn(project);
        Project result = projectService.createProject(name, ownerEmail);
        assertEquals(project, result);
        verify(projectRepository, times(1)).save(any());
    }

    @Test
    void testCreateProject_OwnerNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> projectService.createProject("name", "owner@example.com"));
    }

    @Test
    void testGetOwnProjectsByEmail() {
        String email = "test@example.com";
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        projectService.getOwnProjectsByEmail(email);
        verify(projectRepository, times(1)).findByOwner(user);
    }

    @Test
    void testGetOwnProjects_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> projectService.getOwnProjects("username"));
    }

    @Test
    void testGetOwnProjectsByEmail_UserNotFound() {
        String email = "notfound@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> projectService.getOwnProjectsByEmail(email));
    }

    @Test
    void testGetOwnProjectsByEmail_UserFound() {
        String email = "found@example.com";
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        projectService.getOwnProjectsByEmail(email);
        verify(projectRepository, times(1)).findByOwner(user);
    }

    @Test
    void testGetSharedProjects() {
        String email = "test@example.com";
        projectService.getSharedProjects(email);
        verify(projectRepository, times(1)).findSharedProjectsByEmail(email);
    }

    @Test
    void testGetProjectById() {
        Long id = 1L;
        Project project = new Project();
        when(projectRepository.findById(id)).thenReturn(Optional.of(project));
        Project result = projectService.getProjectById(id);
        assertEquals(project, result);
    }

    @Test
    void testGetProjectById_NotFound() {
        when(projectRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> projectService.getProjectById(1L));
    }

    @Test
    void testUpdateDiagram() {
        Long projectId = 1L;
        String diagramJson = "{}";
        Project project = new Project();
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(any())).thenReturn(project);
        Project result = projectService.updateDiagram(projectId, diagramJson);
        assertEquals(project, result);
    }

    @Test
    void testUpdateDiagram_ProjectNotFound() {
        when(projectRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> projectService.updateDiagram(1L, "{}"));
    }

    @Test
    void testDeleteProject() {
        Long id = 1L;
        when(projectRepository.existsById(id)).thenReturn(true);
        Project project = new Project();
        when(projectRepository.findById(id)).thenReturn(java.util.Optional.of(project));
        doNothing().when(messageRepository).deleteAllByProject(project);
        doNothing().when(groupRepository).deleteByProjectId(id);
        projectService.deleteProject(id);
        verify(projectRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteProject_NotFound() {
        Long id = 1L;
        when(projectRepository.existsById(id)).thenReturn(false);
        org.springframework.web.server.ResponseStatusException ex = assertThrows(
                org.springframework.web.server.ResponseStatusException.class, () -> projectService.deleteProject(id));
        assertEquals(org.springframework.http.HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void testDeleteProject_Conflict() {
        Long id = 1L;
        when(projectRepository.existsById(id)).thenReturn(true);
        when(projectRepository.findById(id)).thenThrow(new RuntimeException("DB error"));
        org.springframework.web.server.ResponseStatusException ex = assertThrows(
                org.springframework.web.server.ResponseStatusException.class, () -> projectService.deleteProject(id));
        assertEquals(org.springframework.http.HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void testSaveProject() {
        Project project = new Project();
        when(projectRepository.save(project)).thenReturn(project);
        Project result = projectService.saveProject(project);
        assertEquals(project, result);
    }
}
