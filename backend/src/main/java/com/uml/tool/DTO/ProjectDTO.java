package com.uml.tool.DTO;

import com.uml.tool.model.Project;
import com.uml.tool.model.Group;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProjectDTO {
    private Long id;
    private String name;
    private String diagramType;
    private String createdAt;
    private String ownerUsername;
    private String diagramJson;
    private String groupName;
    private List<String> groupMembers;

    public static ProjectDTO fromEntity(Project p) {
        ProjectDTO dto = new ProjectDTO();
        dto.id = p.getId();
        dto.name = p.getName();
        dto.diagramType = p.getDiagramType();
        dto.createdAt = p.getCreatedAt() != null ? p.getCreatedAt().toString() : null;
        dto.ownerUsername = (p.getOwner() != null && p.getOwner().getUsername() != null)
                ? p.getOwner().getUsername()
                : "";
        dto.diagramJson = p.getDiagramJson();
        // Add group info if present
        Group group = p.getGroup();
        if (group != null) {
            dto.groupName = group.getName();
            if (group.getMembers() != null) {
                dto.groupMembers = group.getMembers().stream()
                        .map(m -> m.getUser() != null ? m.getUser().getUsername() : null)
                        .filter(username -> username != null)
                        .collect(Collectors.toList());
            }
        }
        return dto;
    }
}
