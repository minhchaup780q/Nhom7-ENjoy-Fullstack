package com.example.learningservice.services;

import com.example.learningservice.dto.SkillComparisonResponse;
import com.example.learningservice.dto.UserStatsResponse;
import com.example.learningservice.entities.UserProgress;
import java.time.LocalDate;
import java.util.List;

public interface UserProgressService {
    List<UserProgress> getUserProgress(Long userId);
    UserProgress completeSession(Long userId, Long sessionId);
    UserProgress completeSession(Long userId, Long sessionId, Integer durationSeconds);
    UserStatsResponse getUserStats(Long userId);
    SkillComparisonResponse getSkillComparisonStats(Long userId, LocalDate currentDate, LocalDate previousDate);
}
