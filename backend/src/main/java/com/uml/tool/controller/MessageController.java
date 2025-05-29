package com.uml.tool.controller;

import com.uml.tool.DTO.MessageDTO;
import com.uml.tool.model.Message;
import com.uml.tool.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class MessageController {
    @Autowired
    private MessageService messageService;

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @PostMapping("/send")
    public Message sendMessage(@RequestBody MessageDTO dto) {
        logger.info("Received sendMessage request: senderId={}, projectId={}, content={}", dto.getSenderId(), dto.getProjectId(), dto.getContent());
        try {
            Message message = messageService.sendMessage(dto.getSenderId(), dto.getProjectId(), dto.getContent());
            logger.info("Message successfully sent: id={}, sender={}, projectId={}", message.getId(), message.getSender().getUsername(), message.getProject().getId());
            return message;
        } catch (Exception e) {
            logger.error("Error while sending message: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/project/{projectId}")
    public List<Message> getMessagesForProject(@PathVariable Long projectId) {
        return messageService.getMessagesForProject(projectId);
    }
}
