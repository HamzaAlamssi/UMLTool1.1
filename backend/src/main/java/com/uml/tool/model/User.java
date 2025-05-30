package com.uml.tool.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@SuperBuilder
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class User {
    public User() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)

    private Long id;

    @Column(name = "email", unique = true)
    String email;

    @Column(name = "name")
    String name;

    @Column(name = "dateOfBirth")
    String dateOfBirth;

    @Column(name = "nationality")
    String nationality;

    @Column(name = "phoneNumber")
    String phoneNumber;

    @Column(name = "address")
    String address;

    @Column(name = "gender")
    String gender;

    @Column(name = "age")
    int age;

    @Column(name = "country")
    String country;

    @Column(name = "city")
    String city;

}
