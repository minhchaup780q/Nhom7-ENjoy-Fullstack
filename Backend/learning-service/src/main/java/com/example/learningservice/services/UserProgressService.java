package com.example.learningservice.services;

import com.example.learningservice.entities.UserProgress;
import java.util.List;

public interface UserProgressService {
    List<UserProgress> getUserProgress(Long userId);
    UserProgress completeSession(Long userId, Long sessionId);
}
