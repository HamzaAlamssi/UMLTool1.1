package com.uml.tool.controller;

import com.uml.tool.model.Project;
import com.uml.tool.model.Template;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.service.ProjectService;
import com.uml.tool.service.TemplateService;
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
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TemplateControllerTest {
    @Mock
    private TemplateService templateService;
    @Mock
    private ProjectService projectService;
    @Mock
    private UserService userService;
    @InjectMocks
    private TemplateController templateController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(templateController)
                .setControllerAdvice(new com.uml.tool.exception.GlobalExceptionHandler())
                .build();
    }

    @Test
    void testGetAllTemplates() throws Exception {
        when(templateService.getAllTemplates()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/templates"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllTemplates_Error() throws Exception {
        when(templateService.getAllTemplates()).thenThrow(new RuntimeException("error"));
        mockMvc.perform(get("/api/templates"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testGetTemplate() throws Exception {
        when(templateService.getTemplateById(anyLong())).thenReturn(new Template());
        mockMvc.perform(get("/api/templates/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetTemplate_Error() throws Exception {
        when(templateService.getTemplateById(anyLong())).thenThrow(new RuntimeException("error"));
        mockMvc.perform(get("/api/templates/1"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testCreateProjectFromTemplate() throws Exception {
        Template template = new Template();
        template.setDiagramJson("{}\n");
        when(templateService.getTemplateById(anyLong())).thenReturn(template);
        UserLoginDetails owner = new UserLoginDetails();
        when(userService.getUserByEmail(any())).thenReturn(Optional.of(owner));
        when(projectService.saveProject(any())).thenReturn(new Project());
        mockMvc.perform(post("/api/templates/1/create-project?projectName=Test&ownerEmail=a@b.com"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateProjectFromTemplate_Error() throws Exception {
        when(templateService.getTemplateById(anyLong())).thenThrow(new RuntimeException("error"));
        mockMvc.perform(post("/api/templates/1/create-project?projectName=Test&ownerEmail=a@b.com"))
                .andExpect(status().isInternalServerError());
    }
}
