package com.uml.tool.repository;

import com.uml.tool.model.UserLoginDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserLoginDetails, String> {
    Optional<UserLoginDetails> findByUsername(String username);
    List<UserLoginDetails> findByUsernameContainingIgnoreCase(String username);
}
