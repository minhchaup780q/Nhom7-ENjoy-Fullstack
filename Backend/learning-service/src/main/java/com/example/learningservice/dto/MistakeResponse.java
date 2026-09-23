package com.example.learningservice.dto;

import com.example.learningservice.entities.Mistake;
import com.example.learningservice.entities.enums.MistakeStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeResponse {
    private Long id;
    private Long userId;
    private Long questionId;
    private String contentText;
    private String translation;
    private String imageUrl;
    private String audioUrl;
    private String keyword;
    private Integer roundType;
    private String wrongAnswerSubmitted;
    private Integer durationSeconds;
    private String aiExplanationCache;
    private MistakeStatus status;
    private Integer correctStreakDays;
    private Double masteryScore;
    private LocalDateTime lastPracticedAt;
    private LocalDateTime nextReviewAt;
    private LocalDateTime createdAt;

    public static MistakeResponse fromEntity(Mistake mistake) {
        if (mistake == null) return null;
        MistakeResponseBuilder builder = MistakeResponse.builder()
                .id(mistake.getId())
                .userId(mistake.getUserId())
                .roundType(mistake.getRoundType())
                .wrongAnswerSubmitted(mistake.getWrongAnswerSubmitted())
                .durationSeconds(mistake.getDurationSeconds())
                .aiExplanationCache(mistake.getAiExplanationCache())
                .status(mistake.getStatus())
                .correctStreakDays(mistake.getCorrectStreakDays() != null ? mistake.getCorrectStreakDays() : 0)
                .masteryScore(mistake.getMasteryScore() != null ? mistake.getMasteryScore() : 0.0)
                .lastPracticedAt(mistake.getLastPracticedAt())
                .nextReviewAt(mistake.getNextReviewAt())
                .createdAt(mistake.getCreatedAt());

        if (mistake.getVocabulary() != null) {
            builder.questionId(mistake.getVocabulary().getId())
                    .contentText(mistake.getVocabulary().getWord())
                    .translation(mistake.getVocabulary().getTranslation())
                    .imageUrl(mistake.getVocabulary().getImageUrl())
                    .audioUrl(mistake.getVocabulary().getAudioUrl());
        }

        return builder.build();
    }
}
