package com.uml.tool.controller;

import com.uml.tool.DTO.ProjectCreateDTO;
import com.uml.tool.DTO.ProjectDTO;
import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.service.ProjectService;
import com.uml.tool.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class ProjectController {
    @Autowired
    private ProjectService projectService;
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public Project createProject(@RequestBody ProjectCreateDTO dto) {
        // Change to use ownerEmail instead of ownerUsername
        return projectService.createProject(dto.getName(), dto.getDiagramType(), dto.getOwnerEmail());
    }

    @GetMapping("/own")
    public List<ProjectDTO> getOwnProjects(@RequestParam String email) {
        // Only return minimal project info, not full entity
        return projectService.getOwnProjectsByEmail(email)
                .stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/shared")
    public List<ProjectDTO> getSharedProjects(@RequestParam String email) {
        // Only show projects where user is a group member, not owner
        return projectService.getSharedProjects(email)
                .stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PutMapping("/updateDiagram")
    public Project updateDiagram(@RequestParam Long projectId, @RequestBody String diagramJson) {
        return projectService.updateDiagram(projectId, diagramJson);
    }

    @GetMapping("/{id:\\d+}")
    public ProjectDTO getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ProjectDTO.fromEntity(project);
    }

    @DeleteMapping("/{id:\\d+}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}
