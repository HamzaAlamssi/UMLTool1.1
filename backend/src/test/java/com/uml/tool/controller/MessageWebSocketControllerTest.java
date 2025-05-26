package com.uml.tool.controller;

import com.uml.tool.DTO.MessageDTO;
import com.uml.tool.model.Message;
import com.uml.tool.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.mockito.Mockito.*;

class MessageWebSocketControllerTest {
    @Mock
    private MessageService messageService;
    @Mock
    private SimpMessagingTemplate messagingTemplate;
    @InjectMocks
    private com.uml.tool.controller.MessageWebSocketController messageWebSocketController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendMessage() {
        MessageDTO dto = new MessageDTO();
        dto.setSenderId("1");
        dto.setProjectId(1L);
        dto.setContent("hi");
        Message message = new Message();
        when(messageService.sendMessage(any(), any(), any())).thenReturn(message);
        messageWebSocketController.sendMessage(dto);
        verify(messagingTemplate, times(1)).convertAndSend(anyString(), eq(message));
    }
}
