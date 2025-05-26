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
    void testGetOwnProjectsByEmail() {
        String email = "test@example.com";
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        projectService.getOwnProjectsByEmail(email);
        verify(projectRepository, times(1)).findByOwner(user);
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
    void testDeleteProject() {
        Long id = 1L;
        projectService.deleteProject(id);
        verify(projectRepository, times(1)).deleteById(id);
    }

    @Test
    void testSaveProject() {
        Project project = new Project();
        when(projectRepository.save(project)).thenReturn(project);
        Project result = projectService.saveProject(project);
        assertEquals(project, result);
    }
}
