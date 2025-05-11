package com.uml.tool.controller;

import org.springframework.http.MediaType;
import com.uml.tool.DTO.MessageDTO;
import com.uml.tool.model.Message;
import com.uml.tool.service.MessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public Message sendMessage(@RequestBody MessageDTO dto) {
        return messageService.sendMessage(dto.getSenderId(), dto.getProjectId(), dto.getContent());
    }

    @GetMapping(value = "/project/{projectId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Message> getMessagesForProject(@PathVariable Long projectId) {
        return messageService.getMessagesForProject(projectId);
    }
}
