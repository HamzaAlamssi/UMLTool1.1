package com.uml.tool;

import com.uml.tool.DTO.*;
import com.uml.tool.model.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

public class DtoAndModelTest {
    @Test
    void testUserDTO() {
        UserDTO dto = new UserDTO();
        dto.setEmail("a@b.com");
        dto.setUsername("user");
        dto.setFirstName("First");
        dto.setLastName("Last");
        dto.setOccupation("Dev");
        dto.setProfileImage("img");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("user", dto.getUsername());
        assertEquals("First", dto.getFirstName());
        assertEquals("Last", dto.getLastName());
        assertEquals("Dev", dto.getOccupation());
        assertEquals("img", dto.getProfileImage());
    }

    @Test
    void testUserCreateDTO() {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setEmail("a@b.com");
        dto.setUsername("user");
        dto.setPassword("pass");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("user", dto.getUsername());
        assertEquals("pass", dto.getPassword());
    }

    @Test
    void testUserUpdateDTO() {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setEmail("a@b.com");
        dto.setUsername("user");
        dto.setFirstName("First");
        dto.setLastName("Last");
        dto.setOccupation("Dev");
        dto.setProfileImage("img");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("user", dto.getUsername());
        assertEquals("First", dto.getFirstName());
        assertEquals("Last", dto.getLastName());
        assertEquals("Dev", dto.getOccupation());
        assertEquals("img", dto.getProfileImage());
    }

    // Add explicit getter/setter calls to ensure JaCoCo counts them as covered
    @Test
    void testUserUpdateDTOGettersSetters() {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setEmail("a@b.com");
        dto.setUsername("user");
        dto.setFirstName("First");
        dto.setLastName("Last");
        dto.setOccupation("Dev");
        dto.setProfileImage("img");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("user", dto.getUsername());
        assertEquals("First", dto.getFirstName());
        assertEquals("Last", dto.getLastName());
        assertEquals("Dev", dto.getOccupation());
        assertEquals("img", dto.getProfileImage());
    }

    @Test
    void testUserLoginDTO() {
        // UserLoginDTO only has all-args constructor and fields: email, password, role
        UserLoginDTO dto = new UserLoginDTO("a@b.com", "pass", null);
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("pass", dto.getPassword());
        assertNull(dto.getRole());
    }

    @Test
    void testChangePasswordDTO() {
        ChangePasswordDTO dto = new ChangePasswordDTO();
        dto.setEmail("a@b.com");
        dto.setNewPassword("new");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("new", dto.getNewPassword());
    }

    @Test
    void testProjectDTO() {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(1L);
        dto.setName("proj");
        dto.setCreatedAt("2024-01-01T00:00:00");
        dto.setOwnerUsername("user");
        dto.setDiagramJson("{}");
        assertEquals(1L, dto.getId());
        assertEquals("proj", dto.getName());
        assertEquals("2024-01-01T00:00:00", dto.getCreatedAt());
        assertEquals("user", dto.getOwnerUsername());
        assertEquals("{}", dto.getDiagramJson());
    }

    @Test
    void testProjectCreateDTO() {
        ProjectCreateDTO dto = new ProjectCreateDTO();
        dto.setName("proj");
        dto.setOwnerEmail("a@b.com");
        assertEquals("proj", dto.getName());
        assertEquals("a@b.com", dto.getOwnerEmail());
    }

    @Test
    void testMessageDTO() {
        MessageDTO dto = new MessageDTO();
        dto.setSenderId("a@b.com");
        dto.setProjectId(2L);
        dto.setContent("hi");
        assertEquals("a@b.com", dto.getSenderId());
        assertEquals(2L, dto.getProjectId());
        assertEquals("hi", dto.getContent());
    }

    @Test
    void testGroupCreateDTO() {
        GroupCreateDTO dto = new GroupCreateDTO();
        dto.setProjectId(1L);
        dto.setName("g");
        assertEquals(1L, dto.getProjectId());
        assertEquals("g", dto.getName());
    }

    @Test
    void testAddUserToGroupDTO() {
        AddUserToGroupDTO dto = new AddUserToGroupDTO();
        dto.setGroupId(1L);
        dto.setEmail("user@example.com");
        assertEquals(1L, dto.getGroupId());
        assertEquals("user@example.com", dto.getEmail());
    }

    @Test
    void testUmlActionDTO() {
        UmlActionDTO dto = new UmlActionDTO();
        dto.setType("add");
        dto.setElementType("class");
        dto.setPayload(new Object());
        dto.setProjectId(1L);
        assertEquals("add", dto.getType());
        assertEquals("class", dto.getElementType());
        assertNotNull(dto.getPayload());
        assertEquals(1L, dto.getProjectId());
    }

    // === Model classes ===
    @Test
    void testUserModel() {
        // User is abstract, cannot instantiate
        // Test skipped or can only test via Admin subclass
    }

    @Test
    void testUserLoginDetailsModel() {
        UserLoginDetails u = new UserLoginDetails();
        u.setEmail("a@b.com");
        u.setPassword("pass");
        u.setUsername("user");
        u.setRole(com.uml.tool.constants.UserRoles.ADMIN);
        u.setFirstName("First");
        u.setLastName("Last");
        u.setOccupation("Dev");
        u.setProfileImage("img");
        assertEquals("a@b.com", u.getEmail());
        assertEquals("pass", u.getPassword());
        assertEquals("user", u.getUsername());
        assertEquals(com.uml.tool.constants.UserRoles.ADMIN, u.getRole());
        assertEquals("First", u.getFirstName());
        assertEquals("Last", u.getLastName());
        assertEquals("Dev", u.getOccupation());
        assertEquals("img", u.getProfileImage());
    }

    @Test
    void testProjectModel() {
        Project p = new Project();
        p.setId(1L);
        p.setName("proj");
        p.setDiagramJson("{}");
        UserLoginDetails owner = new UserLoginDetails();
        p.setOwner(owner);
        assertEquals(1L, p.getId());
        assertEquals("proj", p.getName());
        assertEquals("{}", p.getDiagramJson());
        assertEquals(owner, p.getOwner());
    }

    @Test
    void testMessageModel() {
        Message m = new Message();
        m.setId(1L);
        m.setSender(new UserLoginDetails());
        m.setProject(new Project());
        m.setContent("hi");
        m.setTimestamp(java.time.Instant.now());
        assertEquals(1L, m.getId());
        assertNotNull(m.getSender());
        assertNotNull(m.getProject());
        assertEquals("hi", m.getContent());
        assertNotNull(m.getTimestamp());
    }

    @Test
    void testGroupModel() {
        Group g = new Group();
        g.setId(1L);
        g.setProject(new Project());
        g.setName("g");
        java.util.List<GroupMember> members = new java.util.ArrayList<>();
        g.setMembers(members);
        assertEquals(1L, g.getId());
        assertNotNull(g.getProject());
        assertEquals("g", g.getName());
        assertEquals(members, g.getMembers());
    }

    @Test
    void testGroupMemberModel() {
        GroupMember gm = new GroupMember();
        gm.setId(1L);
        gm.setUser(new UserLoginDetails());
        gm.setGroup(new Group());
        gm.setPermission(GroupMember.Permission.EDIT);
        assertEquals(1L, gm.getId());
        assertNotNull(gm.getUser());
        assertNotNull(gm.getGroup());
        assertEquals(GroupMember.Permission.EDIT, gm.getPermission());
    }

    @Test
    void testTemplateModel() {
        Template t = new Template();
        t.setId(1L);
        t.setName("temp");
        t.setType("customized");
        t.setDiagramJson("{}");
        assertEquals(1L, t.getId());
        assertEquals("temp", t.getName());
        assertEquals("customized", t.getType());
        assertEquals("{}", t.getDiagramJson());
    }

    @Test
    void testAdminModel() {
        Admin a = new Admin();
        a.setEmail("admin@b.com");
        a.setPassword("pass");
        a.setName("admin");
        assertEquals("admin@b.com", a.getEmail());
        assertEquals("pass", a.getPassword());
        assertEquals("admin", a.getName());
        assertEquals(com.uml.tool.constants.UserRoles.ADMIN, a.getRole());
    }

    @Test
    void testGroupMemberRequestDTO() {
        GroupMemberRequest dto = new GroupMemberRequest();
        dto.setEmail("a@b.com");
        dto.setPermission("EDIT");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("EDIT", dto.getPermission());
    }

    @Test
    void testCreateGroupRequestDTO() {
        CreateGroupRequest dto = new CreateGroupRequest();
        dto.setProjectId(1L);
        dto.setGroupName("group");
        List<GroupMemberRequest> members = new ArrayList<>();
        dto.setMembers(members);
        assertEquals(1L, dto.getProjectId());
        assertEquals("group", dto.getGroupName());
        assertEquals(members, dto.getMembers());
    }

    @Test
    void testUserDTOGettersSetters() {
        UserDTO dto = new UserDTO();
        dto.setEmail("a@b.com");
        dto.setUsername("user");
        dto.setFirstName("First");
        dto.setLastName("Last");
        dto.setOccupation("Dev");
        dto.setProfileImage("img");
        dto.setRole("ADMIN");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("user", dto.getUsername());
        assertEquals("First", dto.getFirstName());
        assertEquals("Last", dto.getLastName());
        assertEquals("Dev", dto.getOccupation());
        assertEquals("img", dto.getProfileImage());
        assertEquals("ADMIN", dto.getRole());
    }

    @Test
    void testUserCreateDTOGettersSetters() {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setEmail("a@b.com");
        dto.setUsername("user");
        dto.setPassword("pass");
        dto.setFirstName("First");
        dto.setLastName("Last");
        dto.setOccupation("Dev");
        dto.setProfileImage("img");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("user", dto.getUsername());
        assertEquals("pass", dto.getPassword());
        assertEquals("First", dto.getFirstName());
        assertEquals("Last", dto.getLastName());
        assertEquals("Dev", dto.getOccupation());
        assertEquals("img", dto.getProfileImage());
    }

    @Test
    void testUserLoginDTOGettersSetters() {
        UserLoginDTO dto = new UserLoginDTO("a@b.com", "pass", com.uml.tool.constants.UserRoles.ADMIN);
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("pass", dto.getPassword());
        assertEquals(com.uml.tool.constants.UserRoles.ADMIN, dto.getRole());
    }

    @Test
    void testChangePasswordDTOGettersSetters() {
        ChangePasswordDTO dto = new ChangePasswordDTO();
        dto.setEmail("a@b.com");
        dto.setNewPassword("newpass123");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("newpass123", dto.getNewPassword());
    }

    @Test
    void testProjectDTOGettersSetters() {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(1L);
        dto.setName("proj");
        dto.setCreatedAt("2024-01-01T00:00:00");
        dto.setOwnerUsername("user");
        dto.setDiagramJson("{}");
        assertEquals(1L, dto.getId());
        assertEquals("proj", dto.getName());
        assertEquals("2024-01-01T00:00:00", dto.getCreatedAt());
        assertEquals("user", dto.getOwnerUsername());
        assertEquals("{}", dto.getDiagramJson());
    }

    @Test
    void testProjectCreateDTOGettersSetters() {
        ProjectCreateDTO dto = new ProjectCreateDTO();
        dto.setName("proj");
        dto.setOwnerEmail("a@b.com");
        assertEquals("proj", dto.getName());
        assertEquals("a@b.com", dto.getOwnerEmail());
    }

    @Test
    void testMessageDTOGettersSetters() {
        MessageDTO dto = new MessageDTO();
        dto.setSenderId("a@b.com");
        dto.setProjectId(2L);
        dto.setContent("hi");
        assertEquals("a@b.com", dto.getSenderId());
        assertEquals(2L, dto.getProjectId());
        assertEquals("hi", dto.getContent());
    }

    @Test
    void testGroupMemberRequestGettersSetters() {
        GroupMemberRequest dto = new GroupMemberRequest();
        dto.setEmail("a@b.com");
        dto.setPermission("EDIT");
        assertEquals("a@b.com", dto.getEmail());
        assertEquals("EDIT", dto.getPermission());
    }

    @Test
    void testGroupCreateDTOGettersSetters() {
        GroupCreateDTO dto = new GroupCreateDTO();
        dto.setProjectId(1L);
        dto.setName("g");
        assertEquals(1L, dto.getProjectId());
        assertEquals("g", dto.getName());
    }

    @Test
    void testCreateGroupRequestGettersSetters() {
        CreateGroupRequest dto = new CreateGroupRequest();
        dto.setProjectId(1L);
        dto.setGroupName("group");
        List<GroupMemberRequest> members = new ArrayList<>();
        dto.setMembers(members);
        assertEquals(1L, dto.getProjectId());
        assertEquals("group", dto.getGroupName());
        assertEquals(members, dto.getMembers());
    }

    @Test
    void testAddUserToGroupDTOGettersSetters() {
        AddUserToGroupDTO dto = new AddUserToGroupDTO();
        dto.setGroupId(1L);
        dto.setEmail("user@example.com");
        assertEquals(1L, dto.getGroupId());
        assertEquals("user@example.com", dto.getEmail());
    }

    @Test
    void testUmlActionDTOGettersSetters() {
        UmlActionDTO dto = new UmlActionDTO();
        dto.setType("add");
        dto.setElementType("class");
        dto.setPayload(new Object());
        dto.setProjectId(1L);
        assertEquals("add", dto.getType());
        assertEquals("class", dto.getElementType());
        assertNotNull(dto.getPayload());
        assertEquals(1L, dto.getProjectId());
    }
}
