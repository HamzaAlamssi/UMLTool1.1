package com.uml.tool.service;

import com.uml.tool.DTO.CreateGroupRequest;
import com.uml.tool.DTO.GroupMemberRequest;
import com.uml.tool.model.*;
import com.uml.tool.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@Service
public class GroupService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private GroupMemberRepository groupMemberRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Group createGroup(CreateGroupRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project not found"));

        // Only one group per project
        if (groupRepository.findByProjectId(project.getId()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Group already exists for this project");
        }

        Group group = Group.builder()
                .name(request.getGroupName())
                .cursorColor(request.getCursorColor())
                .project(project)
                .build();

        if (request.getMembers() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Members list cannot be null");
        }

        List<GroupMember> members = new ArrayList<>();
        for (GroupMemberRequest memberReq : request.getMembers()) {
            UserLoginDetails user = userRepository.findByEmail(memberReq.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "User not found: " + memberReq.getEmail()));

            GroupMember.Permission perm;
            try {
                perm = GroupMember.Permission.valueOf(memberReq.getPermission());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid permission: " + memberReq.getPermission());
            }
            // Don't add owner as member
            if (user.getEmail().equals(project.getOwner().getEmail()))
                continue;

            GroupMember member = GroupMember.builder()
                    .group(group)
                    .user(user)
                    .permission(perm)
                    .build();
            members.add(member);
        }
        group.setMembers(members);
        Group savedGroup = groupRepository.save(group);
        groupMemberRepository.saveAll(members);
        return savedGroup;
    }

    public Group getGroupByProjectId(Long projectId) {
        return groupRepository.findByProjectId(projectId);
    }

    @Transactional
    public GroupMember addMemberToGroup(Long groupId, String email, String permission) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
        UserLoginDetails user = userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        GroupMember.Permission perm;
        try {
            perm = GroupMember.Permission.valueOf(permission);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid permission");
        }
        boolean exists = group.getMembers().stream().anyMatch(m -> m.getUser().getEmail().equals(email));
        if (exists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already a member");
        }
        GroupMember member = GroupMember.builder()
                .group(group)
                .user(user)
                .permission(perm)
                .build();
        group.getMembers().add(member);
        groupMemberRepository.save(member);
        groupRepository.save(group);
        return member;
    }

    @Transactional
    public void removeMemberFromGroup(Long groupId, String email) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
        GroupMember member = group.getMembers().stream()
                .filter(m -> m.getUser().getEmail().equals(email))
                .findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
        group.getMembers().remove(member);
        groupMemberRepository.delete(member);
        groupRepository.save(group);
    }
}
