package com.uml.tool.repository;

import com.uml.tool.model.Project;
import com.uml.tool.model.UserLoginDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(UserLoginDetails owner);
}
