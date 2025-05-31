package com.uml.tool;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.SpringApplication;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.mockStatic;

class ToolApplicationTest {
    @Test
    void testMain() {
        try (MockedStatic<SpringApplication> mocked = mockStatic(SpringApplication.class)) {
            mocked.when(() -> SpringApplication.run(ToolApplication.class, new String[] {})).thenReturn(null);
            assertDoesNotThrow(() -> ToolApplication.main(new String[] {}));
            mocked.verify(() -> SpringApplication.run(ToolApplication.class, new String[] {}));
        }
    }
}
