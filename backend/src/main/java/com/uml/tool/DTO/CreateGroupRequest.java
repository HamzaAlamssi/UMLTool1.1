package com.uml.tool.DTO;

import lombok.Data;
import java.util.List;

@Data
public class CreateGroupRequest {
    private Long projectId;
    private String groupName;
    private List<GroupMemberRequest> members;
}
