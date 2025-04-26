package com.uml.tool.model;

import com.uml.tool.constants.UserRoles;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Getter
@Setter
@Table(name = "UserLoginDetails", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class UserLoginDetails {
    @Id
    String email;

    @Column(name = "username")
    String username;

    @Column(name = "password")
    String password;

    @Column(name = "role")
    UserRoles role;

    @Column(name = "first_name")
    String firstName;

    @Column(name = "last_name")
    String lastName;

    @Column(name = "occupation")
    String occupation;

    @Column(name = "profile_image", columnDefinition = "TEXT")
    String profileImage; // Can store Base64 or image URL
}
