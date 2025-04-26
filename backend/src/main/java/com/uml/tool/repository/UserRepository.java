package com.uml.tool.repository;

import com.uml.tool.model.UserLoginDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserLoginDetails, String> {
    Optional<UserLoginDetails> findByUsername(String username);
    Optional<UserLoginDetails> findByEmail(String email);
    void deleteByEmail(String email);
    java.util.List<UserLoginDetails> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String username, String email);
}
