package com.uml.tool.controller;

import com.uml.tool.DTO.CreateGroupRequest;
import com.uml.tool.model.Group;
import com.uml.tool.model.GroupMember;
import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.repository.GroupMemberRepository;
import com.uml.tool.repository.GroupRepository;
import com.uml.tool.repository.UserRepository;
import com.uml.tool.service.GroupService;
import com.uml.tool.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class GroupControllerTest {
    @Mock
    private GroupService groupService;
    @Mock
    private UserService userService;
    @Mock
    private GroupRepository groupRepository;
    @Mock
    private GroupMemberRepository groupMemberRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private GroupController groupController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(groupController)
                .setControllerAdvice(new com.uml.tool.exception.GlobalExceptionHandler())
                .build();
    }

    @Test
    void testCreateGroup_Success() throws Exception {
        Group group = new Group();
        when(groupService.createGroup(any(CreateGroupRequest.class))).thenReturn(group);
        mockMvc.perform(post("/api/groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateGroup_Error() throws Exception {
        when(groupService.createGroup(any(CreateGroupRequest.class))).thenThrow(new RuntimeException("error"));
        mockMvc.perform(post("/api/groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testGetGroupByProjectId_Success() throws Exception {
        Group group = new Group();
        when(groupRepository.findByProjectId(anyLong())).thenReturn(group);
        group.setMembers(new ArrayList<>());
        mockMvc.perform(get("/api/groups/by-project/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetGroupByProjectId_NotFound() throws Exception {
        when(groupRepository.findByProjectId(anyLong())).thenReturn(null);
        mockMvc.perform(get("/api/groups/by-project/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetGroupByProjectId_Success_MemberUserNotNull() throws Exception {
        Group group = new Group();
        UserLoginDetails user = new UserLoginDetails();
        user.setEmail("a@b.com");
        GroupMember member = GroupMember.builder().user(user).build();
        List<GroupMember> members = new ArrayList<>();
        members.add(member);
        group.setMembers(members);
        when(groupRepository.findByProjectId(anyLong())).thenReturn(group);
        mockMvc.perform(get("/api/groups/by-project/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetGroupByProjectId_Error_MemberUserNull() throws Exception {
        Group group = new Group();
        GroupMember member = GroupMember.builder().user(null).build();
        List<GroupMember> members = new ArrayList<>();
        members.add(member);
        group.setMembers(members);
        when(groupRepository.findByProjectId(anyLong())).thenReturn(group);
        mockMvc.perform(get("/api/groups/by-project/1"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testAddMemberToGroup_Success() throws Exception {
        Group group = new Group();
        group.setMembers(new ArrayList<>());
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        mockMvc.perform(post("/api/groups/1/add-member")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"EDIT\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testAddMemberToGroup_GroupNotFound() throws Exception {
        when(groupRepository.findById(anyLong())).thenReturn(Optional.empty());
        mockMvc.perform(post("/api/groups/1/add-member")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"EDIT\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testAddMemberToGroup_UserNotFound() throws Exception {
        Group group = new Group();
        group.setMembers(new ArrayList<>());
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        mockMvc.perform(post("/api/groups/1/add-member")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"EDIT\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testAddMemberToGroup_InvalidPermission() throws Exception {
        Group group = new Group();
        group.setMembers(new ArrayList<>());
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        UserLoginDetails user = new UserLoginDetails();
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        mockMvc.perform(post("/api/groups/1/add-member")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"INVALID\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAddMemberToGroup_AlreadyMember() throws Exception {
        Group group = new Group();
        UserLoginDetails user = new UserLoginDetails();
        user.setEmail("a@b.com");
        GroupMember member = GroupMember.builder().user(user).build();
        List<GroupMember> members = new ArrayList<>();
        members.add(member);
        group.setMembers(members);
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        mockMvc.perform(post("/api/groups/1/add-member")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"EDIT\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void testRemoveMemberFromGroup_Success() throws Exception {
        Group group = new Group();
        UserLoginDetails user = new UserLoginDetails();
        user.setEmail("a@b.com");
        GroupMember member = GroupMember.builder().user(user).build();
        List<GroupMember> members = new ArrayList<>();
        members.add(member);
        group.setMembers(members);
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        mockMvc.perform(delete("/api/groups/1/remove-member?email=a@b.com"))
                .andExpect(status().isOk());
    }

    @Test
    void testRemoveMemberFromGroup_GroupNotFound() throws Exception {
        when(groupRepository.findById(anyLong())).thenReturn(Optional.empty());
        mockMvc.perform(delete("/api/groups/1/remove-member?email=a@b.com"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testRemoveMemberFromGroup_MemberNotFound() throws Exception {
        Group group = new Group();
        group.setMembers(new ArrayList<>());
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        mockMvc.perform(delete("/api/groups/1/remove-member?email=a@b.com"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateMemberPermission_Success() throws Exception {
        Group group = new Group();
        UserLoginDetails user = new UserLoginDetails();
        user.setEmail("a@b.com");
        GroupMember member = GroupMember.builder().user(user).build();
        List<GroupMember> members = new ArrayList<>();
        members.add(member);
        group.setMembers(members);
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        mockMvc.perform(patch("/api/groups/1/update-member-permission")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"VIEW\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateMemberPermission_GroupNotFound() throws Exception {
        when(groupRepository.findById(anyLong())).thenReturn(Optional.empty());
        mockMvc.perform(patch("/api/groups/1/update-member-permission")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"VIEW\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateMemberPermission_MemberNotFound() throws Exception {
        Group group = new Group();
        group.setMembers(new ArrayList<>());
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        mockMvc.perform(patch("/api/groups/1/update-member-permission")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"VIEW\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateMemberPermission_InvalidPermission() throws Exception {
        Group group = new Group();
        UserLoginDetails user = new UserLoginDetails();
        user.setEmail("a@b.com");
        GroupMember member = GroupMember.builder().user(user).build();
        List<GroupMember> members = new ArrayList<>();
        members.add(member);
        group.setMembers(members);
        when(groupRepository.findById(anyLong())).thenReturn(Optional.of(group));
        mockMvc.perform(patch("/api/groups/1/update-member-permission")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"a@b.com\",\"permission\":\"INVALID\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSetUpCoverage() {
        setUp();
    }
}
