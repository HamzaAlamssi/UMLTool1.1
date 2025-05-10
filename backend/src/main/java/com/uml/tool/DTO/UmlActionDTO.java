package com.uml.tool.DTO;

import lombok.Data;

@Data
public class UmlActionDTO {
    private String type; //  "add", "update", "delete"
    private String elementType; // "class", "relationship"
    private Object payload; // UML element data (can use Map or a specific class)
    private Long projectId;
}
