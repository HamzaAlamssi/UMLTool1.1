package com.uml.tool.service;

import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.ProjectRepository;
import com.uml.tool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;

    public Project createProject(String name, String diagramType, String ownerUsername) {
        UserLoginDetails owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        Project project = Project.builder()
                .name(name)
                .diagramType(diagramType)
                .owner(owner)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return projectRepository.save(project);
    }

    public List<Project> getOwnProjects(String username) {
        UserLoginDetails owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return projectRepository.findByOwner(owner);
    }

    public List<Project> getSharedProjects(String email) {
        return projectRepository.findProjectsSharedWithUser(email);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + id));
    }

    public Project updateDiagram(Long projectId, String diagramJson) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setDiagramJson(diagramJson);
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
