package com.uml.tool.DTO;

import com.uml.tool.model.Project;
import lombok.Data;

@Data
public class ProjectDTO {
    private Long id;
    private String name;
    private String diagramType;
    private String createdAt;
    private String ownerUsername;

    public static ProjectDTO fromEntity(Project p) {
        ProjectDTO dto = new ProjectDTO();
        dto.id = p.getId();
        dto.name = p.getName();
        dto.diagramType = p.getDiagramType();
        dto.createdAt = p.getCreatedAt() != null ? p.getCreatedAt().toString() : null;
        dto.ownerUsername = p.getOwner() != null ? p.getOwner().getUsername() : null;
        return dto;
    }
}
