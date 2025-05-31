package com.uml.tool.controller;

import com.uml.tool.DTO.MessageDTO;
import com.uml.tool.model.Message;
import com.uml.tool.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class MessageController {
    @Autowired
    private MessageService messageService;

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageDTO dto) {
        logger.info("Received sendMessage request: senderId={}, projectId={}, content={}", dto.getSenderId(),
                dto.getProjectId(), dto.getContent());
        try {
            Message message = messageService.sendMessage(dto.getSenderId(), dto.getProjectId(), dto.getContent());
            String senderUsername = (message.getSender() != null) ? message.getSender().getUsername() : "null";
            Long projectId = (message.getProject() != null) ? message.getProject().getId() : null;
            logger.info("Message successfully sent: id={}, sender={}, projectId={}", message.getId(), senderUsername,
                    projectId);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            logger.error("Error while sending message: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("{\"error\":\"Failed to send message: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/project/{projectId}")
    public List<Message> getMessagesForProject(@PathVariable Long projectId) {
        return messageService.getMessagesForProject(projectId);
    }
}
