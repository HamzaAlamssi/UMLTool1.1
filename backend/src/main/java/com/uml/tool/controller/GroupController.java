package com.uml.tool.controller;

import com.uml.tool.DTO.GroupCreateDTO;
import com.uml.tool.DTO.AddUserToGroupDTO;
import com.uml.tool.model.Group;
import com.uml.tool.model.GroupMember;
import com.uml.tool.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class GroupController {
    @Autowired
    private GroupService groupService;

    @PostMapping("/create")
    public Group createGroup(@RequestBody GroupCreateDTO dto) {
        return groupService.createGroup(dto.getProjectId(), dto.getName());
    }

    @PostMapping("/addUser")
    public GroupMember addUserToGroup(@RequestBody AddUserToGroupDTO dto) {
        return groupService.addUserToGroup(dto.getGroupId(), dto.getUsername());
    }
}
