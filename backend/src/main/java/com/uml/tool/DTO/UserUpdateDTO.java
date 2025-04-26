package com.uml.tool.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateDTO {
    @NotBlank
    @Email
    private String email;

    private String username;
    private String firstName;
    private String lastName;
    private String occupation;
    private String profileImage;
}
