package com.uml.tool.repository;

import com.uml.tool.model.UserLoginDetails;
import com.uml.tool.constants.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<UserLoginDetails, String> {
    @Query("SELECT u FROM UserLoginDetails u WHERE u.role = :role")
    List<UserLoginDetails> findAllByRole(UserRoles role);

    Optional<UserLoginDetails> findByEmail(String email);
}
