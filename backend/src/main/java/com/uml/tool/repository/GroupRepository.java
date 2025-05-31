package com.uml.tool.repository;

import com.uml.tool.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Group findByProjectId(Long projectId);
    void deleteByProjectId(Long projectId);
}
