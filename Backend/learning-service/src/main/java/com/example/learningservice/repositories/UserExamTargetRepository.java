package com.example.learningservice.repositories;

import com.example.learningservice.entities.UserExamTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserExamTargetRepository extends JpaRepository<UserExamTarget, Long> {
    Optional<UserExamTarget> findByUserId(Long userId);
}
