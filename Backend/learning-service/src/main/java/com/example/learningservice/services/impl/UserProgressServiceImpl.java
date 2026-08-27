package com.example.learningservice.services.impl;

import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.UserProgress;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.repositories.SessionRepository;
import com.example.learningservice.repositories.UserProgressRepository;
import com.example.learningservice.services.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProgressServiceImpl implements UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final SessionRepository sessionRepository;

    @Override
    public List<UserProgress> getUserProgress(Long userId) {
        return userProgressRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public UserProgress completeSession(Long userId, Long sessionId) {
        Session currentSession = sessionRepository.findByIdAndIsDeleteFalse(sessionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + sessionId));

        // 1. Cập nhật tiến độ của session hiện tại thành FINISH
        UserProgress currentProgress = userProgressRepository
                .findByUserIdAndSessionId(userId, sessionId)
                .orElse(UserProgress.builder()
                        .userId(userId)
                        .session(currentSession)
                        .build());  

        currentProgress.setStatus(SessionStatus.FINISH);
        currentProgress.setCompletedAt(LocalDateTime.now());
        currentProgress.setUpdateAt(LocalDateTime.now());
        if (currentProgress.getCreateAt() == null) {
            currentProgress.setCreateAt(LocalDateTime.now());
        }

        UserProgress savedProgress = userProgressRepository.save(currentProgress);

        // 2. Tìm bài học tiếp theo trong cùng Part để UNLOCK
        List<Session> partSessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(currentSession.getPart().getId());
        int currentIndex = -1;
        for (int i = 0; i < partSessions.size(); i++) {
            if (partSessions.get(i).getId().equals(sessionId)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex != -1 && currentIndex < partSessions.size() - 1) {
            Session nextSession = partSessions.get(currentIndex + 1);
            Optional<UserProgress> nextProgressOpt = userProgressRepository.findByUserIdAndSessionId(userId, nextSession.getId());

            if (nextProgressOpt.isEmpty()) {
                UserProgress nextProgress = UserProgress.builder()
                        .userId(userId)
                        .session(nextSession)
                        .status(SessionStatus.UNLOCK)
                        .build();
                nextProgress.setCreateAt(LocalDateTime.now());
                nextProgress.setUpdateAt(LocalDateTime.now());
                userProgressRepository.save(nextProgress);
            }
        }

        return savedProgress;
    }
}
