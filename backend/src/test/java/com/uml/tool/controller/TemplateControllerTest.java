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

    @Test
    void testCreateProjectFromTemplate_OwnerNotFound() throws Exception {
        Template template = new Template();
        template.setDiagramJson("{}\n");
        when(templateService.getTemplateById(anyLong())).thenReturn(template);
        when(userService.getUserByEmail(any())).thenReturn(Optional.empty());
        mockMvc.perform(post("/api/templates/1/create-project?projectName=Test&ownerEmail=a@b.com"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testSaveTemplate() throws Exception {
        Template template = new Template();
        template.setId(1L);
        template.setName("Test Template");
        template.setType("UML");
        template.setDiagramJson("{}\n");
        when(templateService.saveTemplate(any(Template.class))).thenReturn(template);
        mockMvc.perform(post("/api/templates")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"id\":1," +
                        "\"name\":\"Test Template\"," +
                        "\"type\":\"UML\"," +
                        "\"diagramJson\":\"{}\\n\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateTemplate() throws Exception {
        Template existing = new Template();
        existing.setId(1L);
        existing.setName("Old");
        existing.setType("OLD");
        existing.setDiagramJson("old");
        Template updated = new Template();
        updated.setId(1L);
        updated.setName("New");
        updated.setType("NEW");
        updated.setDiagramJson("new");
        when(templateService.getTemplateById(1L)).thenReturn(existing);
        when(templateService.saveTemplate(any(Template.class))).thenReturn(updated);
        mockMvc.perform(put("/api/templates/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"id\":1," +
                        "\"name\":\"New\"," +
                        "\"type\":\"NEW\"," +
                        "\"diagramJson\":\"new\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteTemplate() throws Exception {
        doNothing().when(templateService).deleteTemplate(1L);
        mockMvc.perform(delete("/api/templates/1"))
                .andExpect(status().isOk());
    }
}
