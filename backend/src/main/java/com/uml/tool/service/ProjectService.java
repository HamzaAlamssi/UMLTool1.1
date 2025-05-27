package com.uml.tool.service;

import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.ProjectRepository;
import com.uml.tool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;

    public Project createProject(String name, String ownerEmail) {
        UserLoginDetails owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));
        Project project = Project.builder()
                .name(name)
                .owner(owner)
                .diagramJson("\"{\\\"classes\\\":[],\\\"relationships\\\":[]}\"") // <-- valid Apollon model
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return projectRepository.save(project);
    }

    public List<Project> getOwnProjects(String username) {
        UserLoginDetails owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return projectRepository.findByOwner(owner);
    }

    public List<Project> getOwnProjectsByEmail(String email) {
        UserLoginDetails owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return projectRepository.findByOwner(owner);
    }

    public List<Project> getSharedProjects(String email) {
        return projectRepository.findSharedProjectsByEmail(email);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found with ID: " + id));
    }

    public Project updateDiagram(Long projectId, String diagramJson) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        project.setDiagramJson(diagramJson);
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
        try {
            projectRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Failed to delete project: " + ex.getMessage());
        }
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }
}