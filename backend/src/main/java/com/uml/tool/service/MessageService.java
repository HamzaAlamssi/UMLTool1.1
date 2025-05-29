package com.uml.tool.service;

import com.uml.tool.model.*;
import com.uml.tool.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

@Service
public class MessageService {
        @Autowired
        private MessageRepository messageRepository;
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private ProjectRepository projectRepository;

        private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

        public Message sendMessage(String senderId, Long projectId, String content) {
                logger.info("Attempting to send message: senderId={}, projectId={}, content={}", senderId, projectId, content);
                UserLoginDetails sender = userRepository.findByUsername(senderId)
                                .orElseThrow(() -> {
                                        logger.error("Sender not found: username={}", senderId);
                                        return new RuntimeException("Sender not found");
                                });
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> {
                                        logger.error("Project not found: projectId={}", projectId);
                                        return new RuntimeException("Project not found");
                                });
                Message message = Message.builder()
                                .sender(sender)
                                .project(project)
                                .content(content)
                                .timestamp(Instant.now().atZone(ZoneId.of("Asia/Amman")).toInstant()) // Use UTC+03:00 (Amman)
                                .build();
                logger.info("Message successfully created: sender={}, projectId={}, timestamp={}", sender.getUsername(), projectId, message.getTimestamp());
                return messageRepository.save(message);
        }

        public List<Message> getMessagesForProject(Long projectId) {
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));
                return messageRepository.findByProjectOrderByTimestampAsc(project);
        }
}
