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
    private String phonemeErrorType;
    private String recognizedAudioTranscript;
    private Integer durationSeconds;
    private String aiExplanationCache;
    private MistakeStatus status;
    private Integer correctStreakDays;
    private Double masteryScore;
    private Long partId;
    private String sessionPayload;
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
                .phonemeErrorType(mistake.getPhonemeErrorType())
                .recognizedAudioTranscript(mistake.getRecognizedAudioTranscript())
                .durationSeconds(mistake.getDurationSeconds())
                .aiExplanationCache(mistake.getAiExplanationCache())
                .status(mistake.getStatus())
                .correctStreakDays(mistake.getCorrectStreakDays() != null ? mistake.getCorrectStreakDays() : 0)
                .masteryScore(mistake.getMasteryScore() != null ? mistake.getMasteryScore() : 0.0)
                .lastPracticedAt(mistake.getLastPracticedAt())
                .nextReviewAt(mistake.getNextReviewAt())
                .createdAt(mistake.getCreatedAt());

        if (mistake.getVocabulary() != null) {
            String text = mistake.getVocabulary().getWord();
            String imgUrl = mistake.getVocabulary().getImageUrl();
            String audUrl = mistake.getVocabulary().getAudioUrl();

            if (mistake.getRoundType() != null && (mistake.getRoundType() >= 7 && mistake.getRoundType() <= 10)
                    && mistake.getPhonemeErrorType() != null && !mistake.getPhonemeErrorType().trim().isEmpty()) {
                String raw = mistake.getPhonemeErrorType().trim();
                if (raw.startsWith("{") && raw.endsWith("}")) {
                    try {
                        com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(raw);
                        if (node.has("sentence") && !node.get("sentence").isNull()) {
                            text = node.get("sentence").asText();
                        } else if (node.has("question") && node.get("question").has("text")) {
                            text = node.get("question").get("text").asText();
                        }
                        if (node.has("imageUrl") && !node.get("imageUrl").isNull() && !node.get("imageUrl").asText().isEmpty()) {
                            imgUrl = node.get("imageUrl").asText();
                        }
                        if (node.has("audioUrl") && !node.get("audioUrl").isNull() && !node.get("audioUrl").asText().isEmpty()) {
                            audUrl = node.get("audioUrl").asText();
                        }
                    } catch (Exception ignored) {
                        text = raw;
                    }
                } else {
                    text = raw;
                }
            }

            builder.questionId(mistake.getVocabulary().getId())
                    .contentText(text)
                    .translation(mistake.getVocabulary().getTranslation())
                    .imageUrl(imgUrl)
                    .audioUrl(audUrl);
        }

        return builder.build();
    }
}
