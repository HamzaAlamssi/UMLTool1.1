package com.uml.tool.repository;

import com.uml.tool.model.Group;
import com.uml.tool.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByProject(Project project);
}
