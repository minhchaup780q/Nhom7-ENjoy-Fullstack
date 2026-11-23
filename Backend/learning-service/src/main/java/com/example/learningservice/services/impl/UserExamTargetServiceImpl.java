package com.example.learningservice.services.impl;

import com.example.learningservice.dto.UserExamTargetDto;
import com.example.learningservice.entities.UserExamTarget;
import com.example.learningservice.repositories.UserExamTargetRepository;
import com.example.learningservice.services.UserExamTargetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserExamTargetServiceImpl implements UserExamTargetService {

    private final UserExamTargetRepository userExamTargetRepository;

    public static int getMinListeningScore(int shields) {
        switch (shields) {
            case 5: return 18;
            case 4: return 16;
            case 3: return 13;
            case 2: return 11;
            default: return 1;
        }
    }

    public static int getMinReadingScore(int shields) {
        switch (shields) {
            case 5: return 21;
            case 4: return 19;
            case 3: return 16;
            case 2: return 13;
            default: return 1;
        }
    }

    @Override
    @Transactional
    public UserExamTargetDto saveUserTarget(Long userId, Integer listeningShields, Integer readingShields) {
        int lShields = (listeningShields != null && listeningShields >= 1 && listeningShields <= 5) ? listeningShields : 4;
        int rShields = (readingShields != null && readingShields >= 1 && readingShields <= 5) ? readingShields : 4;

        int lMinScore = getMinListeningScore(lShields);
        int rMinScore = getMinReadingScore(rShields);

        UserExamTarget target = userExamTargetRepository.findByUserId(userId)
                .orElse(UserExamTarget.builder().userId(userId).build());

        target.setListeningShields(lShields);
        target.setReadingShields(rShields);
        target.setListeningMinScore(lMinScore);
        target.setReadingMinScore(rMinScore);
        target.setUpdatedAt(LocalDateTime.now());

        target = userExamTargetRepository.save(target);

        log.info("Saved user target for userId={}: listening={} ({} min), reading={} ({} min)",
                userId, lShields, lMinScore, rShields, rMinScore);

        return UserExamTargetDto.builder()
                .id(target.getId())
                .userId(target.getUserId())
                .listeningShields(target.getListeningShields())
                .readingShields(target.getReadingShields())
                .listeningMinScore(target.getListeningMinScore())
                .readingMinScore(target.getReadingMinScore())
                .updatedAt(target.getUpdatedAt())
                .build();
    }

    @Override
    public UserExamTargetDto getUserTarget(Long userId) {
        return userExamTargetRepository.findByUserId(userId)
                .map(t -> UserExamTargetDto.builder()
                        .id(t.getId())
                        .userId(t.getUserId())
                        .listeningShields(t.getListeningShields())
                        .readingShields(t.getReadingShields())
                        .listeningMinScore(t.getListeningMinScore())
                        .readingMinScore(t.getReadingMinScore())
                        .updatedAt(t.getUpdatedAt())
                        .build())
                .orElseGet(() -> UserExamTargetDto.builder()
                        .userId(userId)
                        .listeningShields(0)
                        .readingShields(0)
                        .listeningMinScore(0)
                        .readingMinScore(0)
                        .updatedAt(LocalDateTime.now())
                        .build());
    }
}
