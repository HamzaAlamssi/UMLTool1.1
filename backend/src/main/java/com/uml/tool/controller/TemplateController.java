package com.uml.tool.controller;

import com.uml.tool.model.Template;
import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.service.TemplateService;
import com.uml.tool.service.ProjectService;
import com.uml.tool.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class TemplateController {
    @Autowired
    private TemplateService templateService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private UserService userService;

    @GetMapping
    public List<Template> getAllTemplates() {
        return templateService.getAllTemplates();
    }

    @GetMapping("/{id}")
    public Template getTemplate(@PathVariable Long id) {
        return templateService.getTemplateById(id);
    }

    // Create a new project from a template
    @PostMapping("/{id}/create-project")
    public Project createProjectFromTemplate(
            @PathVariable Long id,
            @RequestParam String projectName,
            @RequestParam String ownerEmail
    ) {
        Template template = templateService.getTemplateById(id);
        UserLoginDetails owner = userService.getUserByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        Project project = Project.builder()
                .name(projectName)
                .owner(owner)
                .diagramJson(template.getDiagramJson())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return projectService.saveProject(project);
    }

    @PostMapping
    public Template saveTemplate(@RequestBody Template template) {
        return templateService.saveTemplate(template);
    }

    @PutMapping("/{id}")
    public Template updateTemplate(@PathVariable Long id, @RequestBody Template updated) {
        Template template = templateService.getTemplateById(id);
        template.setName(updated.getName());
        template.setType(updated.getType());
        template.setDiagramJson(updated.getDiagramJson());
        return templateService.saveTemplate(template);
    }

    @DeleteMapping("/{id}")
    public void deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
    }
} 