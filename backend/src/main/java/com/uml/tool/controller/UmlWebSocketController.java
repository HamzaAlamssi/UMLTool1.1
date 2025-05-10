package com.uml.tool.controller;

import com.uml.tool.DTO.UmlActionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class UmlWebSocketController {
    private static final Logger logger = LoggerFactory.getLogger(UmlWebSocketController.class);
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Client sends to /app/uml.action
    @MessageMapping("/uml.action")
    public void handleUmlAction(@Payload UmlActionDTO action) {
        logger.info("WebSocket UML action: type={}, elementType={}, projectId={}", action.getType(), action.getElementType(), action.getProjectId());
        messagingTemplate.convertAndSend("/topic/uml-project-" + action.getProjectId(), action);
    }
}
