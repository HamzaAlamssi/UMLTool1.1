package com.uml.tool;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ToolApplicationIntegrationTests {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    private String testUserEmail = "integration1@example.com";
    private String testUserPassword = "TestPassword123!";
    private String testUsername = "integrationuser1";

    private MockHttpSession session;

    private void loginAndStoreSession() throws Exception {
        Map<String, String> req = new HashMap<>();
        req.put("email", testUserEmail);
        req.put("password", testUserPassword);
        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        session = (MockHttpSession) loginResult.getRequest().getSession(false);
    }

    @BeforeEach
    void ensureSession() throws Exception {
        // Register user if not exists (ignore error if already exists)
        Map<String, String> req = new HashMap<>();
        req.put("email", testUserEmail);
        req.put("password", testUserPassword);
        req.put("username", testUsername);
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)));
        loginAndStoreSession();
    }

    @BeforeAll
    void setup() throws Exception {
        // Clean up if user exists
        mockMvc.perform(delete("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(List.of(testUserEmail))));
    }

    @Test
    void testRegisterUser_DuplicateEmail() throws Exception {
        Map<String, String> req = new HashMap<>();
        req.put("email", testUserEmail);
        req.put("password", testUserPassword);
        req.put("username", testUsername);
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Email already exists")));
    }

    @Test
    void testLoginUser_Success() throws Exception {
        Map<String, String> req = new HashMap<>();
        req.put("email", testUserEmail);
        req.put("password", testUserPassword);
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Login successful")));
    }

    @Test
    void testLoginUser_InvalidPassword() throws Exception {
        Map<String, String> req = new HashMap<>();
        req.put("email", testUserEmail);
        req.put("password", "WrongPassword");
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Invalid email or password")));
    }

    @Test
    void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users").session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testGetUserByEmail_Success() throws Exception {
        mockMvc.perform(get("/api/users/" + testUserEmail).session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(testUserEmail));
    }

    @Test
    void testGetUserByEmail_NotFound() throws Exception {
        mockMvc.perform(get("/api/users/nonexistent@example.com").session(session))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void testUpdateUser_Success() throws Exception {
        Map<String, Object> update = new HashMap<>();
        update.put("email", testUserEmail);
        update.put("username", "updateduser");
        update.put("firstName", "Updated");
        update.put("lastName", "User");
        update.put("occupation", "Tester");
        update.put("profileImage", null);
        mockMvc.perform(put("/api/users/" + testUserEmail)
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("updateduser"));
    }

    @Test
    void testSearchUsers() throws Exception {
        mockMvc.perform(get("/api/users/search").param("q", "integration").session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // === Project Management Integration Tests ===
    private Long createdProjectId;
    private String projectOwnerEmail = testUserEmail;
    private String diagramType = "class";
    private String projectName = "Integration Project";

    @Test
    void testCreateProject_Success() throws Exception {
        Map<String, Object> req = new HashMap<>();
        req.put("name", projectName);
        req.put("diagramType", diagramType);
        req.put("ownerEmail", projectOwnerEmail);
        MvcResult result = mockMvc.perform(post("/api/projects/create")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        Map<?, ?> project = objectMapper.readValue(response, Map.class);
        createdProjectId = ((Number) project.get("id")).longValue();
        Assertions.assertEquals(projectName, project.get("name"));
    }

    @Test
    void testGetOwnProjects_Success() throws Exception {
        mockMvc.perform(get("/api/projects/own").param("email", projectOwnerEmail).session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testGetProjectById_Success() throws Exception {
        if (createdProjectId == null)
            testCreateProject_Success();
        mockMvc.perform(get("/api/projects/" + createdProjectId).session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(createdProjectId));
    }

    @Test
    void testUpdateDiagram_Success() throws Exception {
        if (createdProjectId == null)
            testCreateProject_Success();
        String diagramJson = "{\"elements\":[],\"relationships\":[]}";
        mockMvc.perform(put("/api/projects/updateDiagram")
                .session(session)
                .param("projectId", String.valueOf(createdProjectId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(diagramJson))
                .andExpect(status().isOk());
    }

    // === Messaging Integration Tests ===
    @Test
    void testSendMessageAndGetMessages_Success() throws Exception {
        // Send message
        Map<String, Object> req = new HashMap<>();
        req.put("senderId", testUserEmail);
        req.put("projectId", createdProjectId);
        req.put("content", "Hello from integration test!");
        mockMvc.perform(post("/api/messages/send")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
        // Get messages
        mockMvc.perform(get("/api/messages/project/" + createdProjectId).session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // === Authorization & Access Control ===
    @Test
    void testRoleBasedAccessControl() throws Exception {
        // Register an admin user (assuming role can be set via DB or special endpoint)
        String adminEmail = "admin@example.com";
        String adminPassword = "AdminPassword123!";
        Map<String, String> admin = Map.of("email", adminEmail, "password", adminPassword, "username", "adminuser");
        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(admin))).andExpect(status().isOk());
        // (You may need to manually set the role to ADMIN in the DB or via a special
        // endpoint here)
        // Try to delete a user as USER (should fail if restricted)
        Map<String, String> req = new HashMap<>();
        req.put("email", testUserEmail);
        req.put("password", testUserPassword);
        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        String session = loginResult.getResponse().getHeader("Set-Cookie");
        mockMvc.perform(delete("/api/users").header("Cookie", session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(List.of("integration2@example.com"))))
                .andExpect(status().isForbidden()); // Should be 403 if only ADMIN can delete
        // Try as ADMIN (if possible)
        // (You may need to login as admin and set session, then try the same delete)
    }

    // === Concurrent Requests Test ===
    @Test
    void testConcurrentProjectCreation() throws Exception {
        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        List<Future<MvcResult>> futures = new ArrayList<>();
        for (int i = 0; i < threadCount; i++) {
            final int idx = i;
            futures.add(executor.submit(() -> {
                Map<String, Object> req = new HashMap<>();
                req.put("name", "Concurrent Project " + idx);
                req.put("diagramType", "class");
                req.put("ownerEmail", testUserEmail);
                return mockMvc.perform(post("/api/projects/create")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                        .andExpect(status().isOk())
                        .andReturn();
            }));
        }
        for (Future<MvcResult> f : futures) {
            f.get();
        }
        executor.shutdown();
        Assertions.assertTrue(executor.awaitTermination(10, TimeUnit.SECONDS));
    }

    @Test
    void testPerformanceLoadProjectsEndpoint() throws Exception {
        int requestCount = 50;
        ExecutorService executor = Executors.newFixedThreadPool(10);
        List<Future<MvcResult>> futures = new ArrayList<>();
        long start = System.currentTimeMillis();
        for (int i = 0; i < requestCount; i++) {
            futures.add(executor.submit(
                    () -> mockMvc.perform(get("/api/projects/own").param("email", testUserEmail).session(session))
                            .andExpect(status().isOk())
                            .andReturn()));
        }
        for (Future<MvcResult> f : futures) {
            f.get();
        }
        executor.shutdown();
        Assertions.assertTrue(executor.awaitTermination(10, TimeUnit.SECONDS));
        long duration = System.currentTimeMillis() - start;
        System.out.println("Handled " + requestCount + " requests in " + duration + " ms");
    }
}
