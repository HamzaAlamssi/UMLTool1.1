package com.uml.tool.service;

import com.uml.tool.model.*;
import com.uml.tool.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupMemberRepository groupMemberRepository;

    public Group createGroup(Long projectId, String name) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Group group = Group.builder()
                .name(name)
                .project(project)
                .build();
        return groupRepository.save(group);
    }

    public GroupMember addUserToGroup(Long groupId, String username) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        UserLoginDetails user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        GroupMember member = GroupMember.builder()
                .group(group)
                .user(user)
                .build();
        return groupMemberRepository.save(member);
    }
}
