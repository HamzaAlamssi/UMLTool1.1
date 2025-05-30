package com.uml.tool.model;

import com.uml.tool.constants.UserRoles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {

    @Column(name = "name")
    String name;

    @Column(name = "password")
    String password;

    @Column(name = "username")
    private UserRoles role = UserRoles.ADMIN;

    public Admin() {
        this.role = UserRoles.ADMIN;
    }

}
