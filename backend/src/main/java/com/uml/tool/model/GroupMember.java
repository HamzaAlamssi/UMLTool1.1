package com.uml.tool.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "group_members")
@JsonIgnoreProperties({"group"})
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "groups", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
    private UserLoginDetails user;

    @Enumerated(EnumType.STRING)
    private Permission permission;

    public enum Permission {
        EDIT, VIEW, READONLY
    }
}
