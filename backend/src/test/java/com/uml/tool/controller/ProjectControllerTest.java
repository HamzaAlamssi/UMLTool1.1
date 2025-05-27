package com.uml.tool.controller;

import com.uml.tool.DTO.ProjectCreateDTO;
import com.uml.tool.DTO.ProjectDTO;
import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.service.ProjectService;
import com.uml.tool.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProjectControllerTest {
    @Mock
    private ProjectService projectService;
    @Mock
    private UserService userService;
    @InjectMocks
    private ProjectController projectController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(projectController)
                .setControllerAdvice(new com.uml.tool.exception.GlobalExceptionHandler())
                .build();
    }

    @Test
    void testCreateProject() throws Exception {
        Project project = new Project();
        when(projectService.createProject(any(), any())).thenReturn(project);
        mockMvc.perform(post("/api/projects/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\",\"ownerEmail\":\"a@b.com\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetOwnProjects() throws Exception {
        when(projectService.getOwnProjectsByEmail(any())).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/projects/own?email=a@b.com"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetSharedProjects() throws Exception {
        when(projectService.getSharedProjects(any())).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/projects/shared?email=a@b.com"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateDiagram() throws Exception {
        Project project = new Project();
        when(projectService.updateDiagram(anyLong(), any())).thenReturn(project);
        mockMvc.perform(put("/api/projects/updateDiagram?projectId=1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetProjectById() throws Exception {
        Project project = new Project();
        when(projectService.getProjectById(anyLong())).thenReturn(project);
        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteProject() throws Exception {
        doNothing().when(projectService).deleteProject(anyLong());
        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateProject_Error() throws Exception {
        when(projectService.createProject(any(), any())).thenThrow(new RuntimeException("error"));
        mockMvc.perform(post("/api/projects/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\",\"ownerEmail\":\"a@b.com\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetOwnProjects_Error() throws Exception {
        when(projectService.getOwnProjectsByEmail(any())).thenThrow(new RuntimeException("error"));
        mockMvc.perform(get("/api/projects/own?email=a@b.com"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testGetSharedProjects_Error() throws Exception {
        when(projectService.getSharedProjects(any())).thenThrow(new RuntimeException("error"));
        mockMvc.perform(get("/api/projects/shared?email=a@b.com"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testUpdateDiagram_Error() throws Exception {
        when(projectService.updateDiagram(anyLong(), any())).thenThrow(new RuntimeException("error"));
        mockMvc.perform(put("/api/projects/updateDiagram?projectId=1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testGetProjectById_Error() throws Exception {
        when(projectService.getProjectById(anyLong())).thenThrow(new RuntimeException("error"));
        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testDeleteProject_Error() throws Exception {
        doThrow(new RuntimeException("error")).when(projectService).deleteProject(anyLong());
        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isConflict());
    }
}
