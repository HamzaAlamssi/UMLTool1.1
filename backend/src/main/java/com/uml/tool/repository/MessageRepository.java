package com.uml.tool.repository;

import com.uml.tool.model.Message;
import com.uml.tool.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByProjectOrderByTimestampAsc(Project project);
    void deleteAllByProject(Project project);
}
