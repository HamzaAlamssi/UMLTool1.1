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
        return projectService.createProject(dto.getName(), dto.getDiagramType(), dto.getOwnerUsername());
    }

    @GetMapping("/own")
    public List<ProjectDTO> getOwnProjects(@RequestParam String username) {
        // Only return minimal project info, not full entity
        return projectService.getOwnProjects(username)
                .stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PutMapping("/updateDiagram")
    public Project updateDiagram(@RequestParam Long projectId, @RequestBody String diagramJson) {
        return projectService.updateDiagram(projectId, diagramJson);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}
