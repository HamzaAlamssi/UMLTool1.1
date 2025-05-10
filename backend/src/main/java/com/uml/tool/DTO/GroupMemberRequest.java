package com.uml.tool.DTO;

import lombok.Data;

@Data
public class GroupMemberRequest {
    private String email;
    private String permission;
}
