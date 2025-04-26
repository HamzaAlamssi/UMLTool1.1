package com.uml.tool.DTO;

import com.uml.tool.constants.UserRoles;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserLoginDTO {
    private String email;
    private String password;
    private UserRoles role;
}
