package com.uml.tool.controller;

import com.uml.tool.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserControllerTest {
        @Mock
        private UserService userService;
        @InjectMocks
        private UserController userController;
        private MockMvc mockMvc;

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);
                mockMvc = MockMvcBuilders.standaloneSetup(userController)
                                .setControllerAdvice(new com.uml.tool.exception.GlobalExceptionHandler())
                                .build();
        }

        @Test
        void testGetAllUsers() throws Exception {
                when(userService.getAllUsers()).thenReturn(Collections.emptyList());
                mockMvc.perform(get("/api/users"))
                                .andExpect(status().isOk());
        }

        @Test
        void testGetUser() throws Exception {
                when(userService.getUserByEmail(any())).thenReturn(java.util.Optional.empty());
                mockMvc.perform(get("/api/users/test@example.com"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void testAddUser() throws Exception {
                when(userService.addUser(any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{" +
                                                "\"email\":\"test@example.com\"," +
                                                "\"username\":\"testuser\"," +
                                                "\"password\":\"password123\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser() throws Exception {
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{" +
                                                "\"email\":\"newtest@example.com\"," +
                                                "\"username\":\"newuser\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testDeleteUsers() throws Exception {
                mockMvc.perform(delete("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("[\"test@example.com\"]"))
                                .andExpect(status().isOk());
        }

        @Test
        void testChangePassword() throws Exception {
                mockMvc.perform(put("/api/users/test@example.com/password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{" +
                                                "\"email\":\"test@example.com\"," +
                                                "\"newPassword\":\"password123\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_DuplicateUsername() throws Exception {
                com.uml.tool.model.UserLoginDetails existing = new com.uml.tool.model.UserLoginDetails();
                existing.setEmail("other@example.com");
                when(userService.findByUsername(any())).thenReturn(java.util.Optional.of(existing));
                when(userService.getUserByEmail(any()))
                                .thenReturn(java.util.Optional.of(new com.uml.tool.model.UserLoginDetails()));
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{" +
                                                "\"email\":\"test@example.com\"," +
                                                "\"username\":\"duplicate\"}"))
                                .andExpect(status().isConflict());
        }

        @Test
        void testUpdateUser_DuplicateEmail() throws Exception {
                com.uml.tool.model.UserLoginDetails existing = new com.uml.tool.model.UserLoginDetails();
                existing.setEmail("other@example.com");
                when(userService.getUserByEmail(any())).thenReturn(java.util.Optional.of(existing));
                when(userService.findByUsername(any())).thenReturn(java.util.Optional.empty());
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{" +
                                                "\"email\":\"duplicate@example.com\"," +
                                                "\"username\":\"testuser\"}"))
                                .andExpect(status().isConflict());
        }

        @Test
        void testUpdateUser_RuntimeException() throws Exception {
                when(userService.getByEmail(any())).thenReturn(java.util.Optional.empty());
                doThrow(new RuntimeException("Some error")).when(userService).updateUserProfile(any(), any());
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{" +
                                                "\"email\":\"test@example.com\"," +
                                                "\"username\":\"user\"}"))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void testDeleteUsers_Multiple() throws Exception {
                mockMvc.perform(delete("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("[\"test1@example.com\",\"test2@example.com\"]"))
                                .andExpect(status().isOk());
        }

        @Test
        void testSearchUsers() throws Exception {
                when(userService.searchUsers(any())).thenReturn(Collections.emptyList());
                mockMvc.perform(get("/api/users/search?q=test"))
                                .andExpect(status().isOk());
        }

        @Test
        void testDeleteUser_NotFound() throws Exception {
                when(userService.deleteUserByEmailWithResult(any())).thenReturn(false);
                mockMvc.perform(delete("/api/users/test@example.com"))
                                .andExpect(status().isNotFound())
                                .andExpect(content().string("{\"error\":\"User not found\"}"));
        }

        @Test
        void testDeleteUser_Exception() throws Exception {
                when(userService.deleteUserByEmailWithResult(any())).thenThrow(new RuntimeException("fail"));
                mockMvc.perform(delete("/api/users/test@example.com"))
                                .andExpect(status().isInternalServerError())
                                .andExpect(content()
                                                .string(org.hamcrest.Matchers.containsString("Failed to delete user")));
        }

        @Test
        void testDeleteUsers_Exception() throws Exception {
                doThrow(new RuntimeException("fail")).when(userService).deleteUserByEmail(any());
                mockMvc.perform(delete("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("[\"test@example.com\"]"))
                                .andExpect(status().isInternalServerError())
                                .andExpect(content().string(
                                                org.hamcrest.Matchers.containsString("Failed to delete users")));
        }

        @Test
        void testUpdateUser_NotFound() throws Exception {
                when(userService.updateUserProfile(any(), any()))
                                .thenThrow(new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.NOT_FOUND, "User not found"));
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"notfound@example.com\",\"username\":\"user\"}"))
                                .andExpect(status().isNotFound())
                                .andExpect(content().string(org.hamcrest.Matchers.containsString("User not found")));
        }

        @Test
        void testUpdateUser_Conflict() throws Exception {
                when(userService.updateUserProfile(any(), any()))
                                .thenThrow(new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.CONFLICT,
                                                "Username already exists"));
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"test@example.com\",\"username\":\"conflict\"}"))
                                .andExpect(status().isConflict())
                                .andExpect(content().string(
                                                org.hamcrest.Matchers.containsString("Username already exists")));
        }

        @Test
        void testUpdateUser_GenericResponseStatusException() throws Exception {
                when(userService.updateUserProfile(any(), any()))
                                .thenThrow(new org.springframework.web.server.ResponseStatusException(
                                                org.springframework.http.HttpStatus.FORBIDDEN, "Forbidden"));
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"test@example.com\",\"username\":\"forbidden\"}"))
                                .andExpect(status().isForbidden())
                                .andExpect(content().string(org.hamcrest.Matchers.containsString("Forbidden")));
        }

        @Test
        void testUpdateUser_ChangingUsernameAndOnlyPassword() throws Exception {
                com.uml.tool.DTO.UserUpdateDTO dto = new com.uml.tool.DTO.UserUpdateDTO();
                dto.setEmail("test@example.com");
                dto.setUsername("newuser");
                dto.setFirstName("First");
                dto.setLastName("Last");
                dto.setOccupation("Dev");
                dto.setProfileImage("img");
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"test@example.com\",\"username\":\"newuser\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_ChangingOnlyPassword() throws Exception {
                com.uml.tool.DTO.UserUpdateDTO dto = new com.uml.tool.DTO.UserUpdateDTO();
                dto.setEmail("test@example.com");
                dto.setUsername("");
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"test@example.com\",\"username\":\"\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_DuplicateUsernameBranch() throws Exception {
                com.uml.tool.model.UserLoginDetails existing = new com.uml.tool.model.UserLoginDetails();
                existing.setEmail("test@example.com");
                when(userService.findByUsername(any())).thenReturn(java.util.Optional.of(existing));
                when(userService.getUserByEmail(any())).thenReturn(java.util.Optional.of(existing));
                when(userService.updateUserProfile(any(), any())).thenReturn(existing);
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"test@example.com\",\"username\":\"testuser\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_DuplicateUsernameConflictBranch() throws Exception {
                com.uml.tool.model.UserLoginDetails existing = new com.uml.tool.model.UserLoginDetails();
                existing.setEmail("other@example.com");
                when(userService.findByUsername(any())).thenReturn(java.util.Optional.of(existing));
                when(userService.getUserByEmail(any())).thenReturn(java.util.Optional.of(existing));
                when(userService.updateUserProfile(any(), any())).thenReturn(existing);
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"test@example.com\",\"username\":\"testuser\"}"))
                                .andExpect(status().isConflict());
        }

        @Test
        void testUpdateUser_EmailNullBranch() throws Exception {
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"username\":\"userwithnullmail\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_UsernameNullBranch() throws Exception {
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"test@example.com\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_ChangingUsernameAndEmailBranch() throws Exception {
                when(userService.getUserByEmail(any())).thenReturn(java.util.Optional.empty());
                when(userService.findByUsername(any())).thenReturn(java.util.Optional.empty());
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/old@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"new@example.com\",\"username\":\"newuser\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testDeleteUser_Success() throws Exception {
                when(userService.deleteUserByEmailWithResult(any())).thenReturn(true);
                mockMvc.perform(delete("/api/users/test@example.com"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_ChangingOnlyPasswordBranch() throws Exception {
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/test@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"test@example.com\",\"username\":\"\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_UsernameBlankEmailChangedBranch() throws Exception {
                when(userService.getUserByEmail(any())).thenReturn(java.util.Optional.empty());
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/old@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"new@example.com\",\"username\":\"\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testUpdateUser_UsernameOmittedEmailChangedBranch() throws Exception {
                when(userService.getUserByEmail(any())).thenReturn(java.util.Optional.empty());
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/old@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"new@example.com\"}"))
                                .andExpect(status().isOk());
        }

        @Test
        void testGetUser_Exception() throws Exception {
                when(userService.getUserByEmail(any())).thenThrow(new RuntimeException("fail"));
                mockMvc.perform(get("/api/users/test@example.com"))
                                .andExpect(status().isInternalServerError())
                                .andExpect(content()
                                                .string(org.hamcrest.Matchers.containsString("Failed to get user")));
        }

        @Test
        void testUpdateUser_UsernameExplicitNullEmailChangedBranch() throws Exception {
                when(userService.getUserByEmail(any())).thenReturn(java.util.Optional.empty());
                when(userService.updateUserProfile(any(), any())).thenReturn(new com.uml.tool.model.UserLoginDetails());
                mockMvc.perform(put("/api/users/old@example.com")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\":\"new@example.com\",\"username\":null}"))
                                .andExpect(status().isOk());
        }
}
