package com.uml.tool.DTO;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String email; // Optional, only for password reset/notification

    private String username;
    private String firstName;
    private String lastName;
    private String occupation;
    private String profileImage;
}
