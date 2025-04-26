package com.uml.tool.DTO;

import lombok.Data;

@Data
public class AddUserToGroupDTO {
    private Long groupId;
    private String username;
}
