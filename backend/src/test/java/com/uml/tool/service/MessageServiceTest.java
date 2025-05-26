package com.uml.tool.service;

import com.uml.tool.model.Message;
import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.MessageRepository;
import com.uml.tool.repository.ProjectRepository;
import com.uml.tool.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MessageServiceTest {
    @Mock
    private MessageRepository messageRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProjectRepository projectRepository;
    @InjectMocks
    private MessageService messageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendMessage() {
        String senderId = "sender@example.com";
        Long projectId = 1L;
        String content = "Hello";
        UserLoginDetails sender = new UserLoginDetails();
        Project project = new Project();
        Message message = new Message();
        when(userRepository.findByEmail(senderId)).thenReturn(Optional.of(sender));
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(messageRepository.save(any())).thenReturn(message);
        Message result = messageService.sendMessage(senderId, projectId, content);
        assertEquals(message, result);
    }

    @Test
    void testGetMessagesForProject() {
        Long projectId = 1L;
        Project project = new Project();
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        messageService.getMessagesForProject(projectId);
        verify(messageRepository, times(1)).findByProjectOrderByTimestampAsc(project);
    }
}
