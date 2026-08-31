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
                .createdAt(mistake.getCreatedAt());

        if (mistake.getQuestion() != null) {
            builder.questionId(mistake.getQuestion().getId())
                    .contentText(mistake.getQuestion().getContentText())
                    .translation(mistake.getQuestion().getTranslation())
                    .imageUrl(mistake.getQuestion().getImageUrl())
                    .audioUrl(mistake.getQuestion().getAudioUrl())
                    .keyword(mistake.getQuestion().getKeyword());
        }

        return builder.build();
    }
}
