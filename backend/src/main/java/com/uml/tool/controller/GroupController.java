package com.uml.tool.controller;

import com.uml.tool.DTO.CreateGroupRequest;
import com.uml.tool.DTO.GroupMemberRequest;
import com.uml.tool.model.Group;
import com.uml.tool.model.GroupMember;
import com.uml.tool.repository.GroupRepository;
import com.uml.tool.repository.GroupMemberRepository;
import com.uml.tool.repository.UserRepository;
import com.uml.tool.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5000" }, allowCredentials = "true")
public class GroupController {
    @Autowired
    private GroupService groupService;

    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private GroupMemberRepository groupMemberRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody CreateGroupRequest request) {
        Group group = groupService.createGroup(request);
        return ResponseEntity.ok(group);
    }

    // Get group by projectId (with members)
    @GetMapping("/by-project/{projectId}")
    public ResponseEntity<?> getGroupByProjectId(@PathVariable Long projectId) {
        Group group = groupRepository.findByProjectId(projectId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found for project");
        }
        // Eagerly fetch members and user info
        group.getMembers().forEach(m -> m.getUser().getEmail());
        return ResponseEntity.ok(group);
    }

    // Add member to group by email
    @PostMapping("/{groupId}/add-member")
    public ResponseEntity<?> addMemberToGroup(@PathVariable Long groupId, @RequestBody GroupMemberRequest request) {
        Group group = groupRepository.findById(groupId).orElse(null);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found");
        }
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        GroupMember.Permission perm;
        try {
            perm = GroupMember.Permission.valueOf(request.getPermission());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid permission");
        }
        // Check if already a member
        boolean exists = group.getMembers().stream().anyMatch(m -> m.getUser().getEmail().equals(request.getEmail()));
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already a member");
        }
        GroupMember member = GroupMember.builder()
                .group(group)
                .user(userOpt.get())
                .permission(perm)
                .build();
        group.getMembers().add(member);
        groupMemberRepository.save(member);
        groupRepository.save(group);
        return ResponseEntity.ok(member);
    }

    // Remove member from group by email
    @DeleteMapping("/{groupId}/remove-member")
    public ResponseEntity<?> removeMemberFromGroup(@PathVariable Long groupId, @RequestParam String email) {
        Group group = groupRepository.findById(groupId).orElse(null);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found");
        }
        GroupMember member = group.getMembers().stream()
                .filter(m -> m.getUser().getEmail().equals(email))
                .findFirst().orElse(null);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");
        }
        group.getMembers().remove(member);
        groupMemberRepository.delete(member);
        groupRepository.save(group);
        return ResponseEntity.ok("Member removed");
    }

    // Update member permission
    @PatchMapping("/{groupId}/update-member-permission")
    public ResponseEntity<?> updateMemberPermission(@PathVariable Long groupId, @RequestBody GroupMemberRequest request) {
        Group group = groupRepository.findById(groupId).orElse(null);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found");
        }
        GroupMember member = group.getMembers().stream()
                .filter(m -> m.getUser().getEmail().equals(request.getEmail()))
                .findFirst().orElse(null);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");
        }
        GroupMember.Permission perm;
        try {
            perm = GroupMember.Permission.valueOf(request.getPermission());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid permission");
        }
        member.setPermission(perm);
        groupMemberRepository.save(member);
        return ResponseEntity.ok(member);
    }
}
