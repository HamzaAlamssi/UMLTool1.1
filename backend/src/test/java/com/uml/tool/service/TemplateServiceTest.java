package com.uml.tool.service;

import com.uml.tool.model.Template;
import com.uml.tool.repository.TemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TemplateServiceTest {
    @Mock
    private TemplateRepository templateRepository;
    @InjectMocks
    private TemplateService templateService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllTemplates() {
        templateService.getAllTemplates();
        verify(templateRepository, times(1)).findAll();
    }

    @Test
    void testGetTemplateById() {
        Long id = 1L;
        Template template = new Template();
        when(templateRepository.findById(id)).thenReturn(Optional.of(template));
        Template result = templateService.getTemplateById(id);
        assertEquals(template, result);
    }

    @Test
    void testGetTemplateById_NotFound() {
        when(templateRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> templateService.getTemplateById(1L));
    }

    @Test
    void testSaveTemplate() {
        Template template = new Template();
        when(templateRepository.save(template)).thenReturn(template);
        Template result = templateService.saveTemplate(template);
        assertEquals(template, result);
        verify(templateRepository, times(1)).save(template);
    }

    @Test
    void testDeleteTemplate() {
        Long id = 1L;
        doNothing().when(templateRepository).deleteById(id);
        templateService.deleteTemplate(id);
        verify(templateRepository, times(1)).deleteById(id);
    }
}
