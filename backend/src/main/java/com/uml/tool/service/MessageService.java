package com.uml.tool.service;

import com.uml.tool.model.*;
import com.uml.tool.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MessageService {
        @Autowired
        private MessageRepository messageRepository;
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private ProjectRepository projectRepository;

        public Message sendMessage(String senderId, Long projectId, String content) {
                UserLoginDetails sender = userRepository.findByEmail(senderId)
                                .orElseThrow(() -> new RuntimeException("Sender not found"));
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));
                Message message = Message.builder()
                                .sender(sender)
                                .project(project)
                                .content(content)
                                .timestamp(Instant.now()) // Use UTC
                                .build();
                return messageRepository.save(message);
        }

        public List<Message> getMessagesForProject(Long projectId) {
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));
                return messageRepository.findByProjectOrderByTimestampAsc(project);
        }
}
