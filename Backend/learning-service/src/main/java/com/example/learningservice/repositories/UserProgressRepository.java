package com.example.learningservice.repositories;

import com.example.learningservice.entities.UserProgress;
import com.example.learningservice.entities.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByUserId(Long userId);
    Optional<UserProgress> findByUserIdAndSessionId(Long userId, Long sessionId);
    List<UserProgress> findByUserIdAndStatus(Long userId, SessionStatus status);
    List<UserProgress> findByUserIdAndStatusAndCompletedAtBetween(Long userId, SessionStatus status, LocalDateTime start, LocalDateTime end);
    List<UserProgress> findByUserIdAndStatusOrderByCompletedAtDesc(Long userId, SessionStatus status);
}
