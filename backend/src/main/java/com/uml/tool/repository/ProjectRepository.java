package com.uml.tool.repository;

import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(UserLoginDetails owner);

    @Query("SELECT gm.group.project FROM GroupMember gm WHERE gm.user.email = :email AND gm.group.project.owner.email <> :email")
    List<Project> findSharedProjectsByEmail(String email);
}
