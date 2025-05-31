package com.uml.tool.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectCreateDTO {
    private String name;

    @NotBlank(message = "Owner email is required")
    private String ownerEmail;
    private String ownerUsername;
}
