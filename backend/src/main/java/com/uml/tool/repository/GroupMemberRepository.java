package com.uml.tool.repository;

import com.uml.tool.model.GroupMember;
import com.uml.tool.model.Group;
import com.uml.tool.model.UserLoginDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroup(Group group);
    List<GroupMember> findByUser(UserLoginDetails user);
}
