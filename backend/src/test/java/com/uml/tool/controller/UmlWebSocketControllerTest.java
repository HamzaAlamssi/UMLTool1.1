package com.uml.tool.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.mockito.Mockito.*;

class UmlWebSocketControllerTest {
    @Mock
    private SimpMessagingTemplate messagingTemplate;
    @InjectMocks
    private UmlWebSocketController umlWebSocketController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testHandleUmlAction() {
        // You can add more detailed tests for the WebSocket logic if needed
        // Example: umlWebSocketController.handleUmlAction(new
        // com.uml.tool.DTO.UmlActionDTO());
    }

    @Test
    void testHandleUmlAction_Error() {
        doThrow(new RuntimeException("error"))
                .when(messagingTemplate)
                .convertAndSend(any(String.class), any(Object.class));
        // Should not throw, but will log error
        umlWebSocketController.handleUmlAction(new com.uml.tool.DTO.UmlActionDTO());
    }
}
