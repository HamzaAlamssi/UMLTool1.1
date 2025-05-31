package com.uml.tool;

import com.uml.tool.repository.TemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

class DataInitializerTest {
    private TemplateRepository templateRepository;
    private DataInitializer dataInitializer;

    @BeforeEach
    void setUp() {
        templateRepository = mock(TemplateRepository.class);
        dataInitializer = new DataInitializer();
        java.lang.reflect.Field field;
        try {
            field = DataInitializer.class.getDeclaredField("templateRepository");
            field.setAccessible(true);
            field.set(dataInitializer, templateRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testInit_WhenTemplatesEmpty() {
        when(templateRepository.count()).thenReturn(0L);
        dataInitializer.init();
        verify(templateRepository, times(1)).saveAll(anyList());
    }

    @Test
    void testInit_WhenTemplatesExist() {
        when(templateRepository.count()).thenReturn(1L);
        dataInitializer.init();
        verify(templateRepository, never()).saveAll(anyList());
    }
}
