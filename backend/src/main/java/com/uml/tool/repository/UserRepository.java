package com.uml.tool.repository;

import com.uml.tool.model.UserLoginDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// NOTE: The primary key (ID) for UserLoginDetails is now email, not username.
public interface UserRepository extends JpaRepository<UserLoginDetails, String> {
    Optional<UserLoginDetails> findByEmail(String email);

    void deleteByEmail(String email);

    boolean existsByEmail(String email);

    List<UserLoginDetails> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String query, String query2);

    Optional<UserLoginDetails> findByUsername(String username);
}
