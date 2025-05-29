package com.uml.tool.repository;

import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(UserLoginDetails owner);

    @Query("SELECT p FROM Project p JOIN p.group g JOIN g.members m WHERE m.user.email = :email")
    List<Project> findSharedProjectsByEmail(@Param("email") String email);
}
