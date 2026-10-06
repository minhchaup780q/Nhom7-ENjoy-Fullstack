package com.example.learningservice.dto;

import com.example.learningservice.entities.VocabPracticeAiChallenge;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VocabAiChallengeDto {

    private Long id;
    private Long userId;
    private String word;
    private String topic;
    private String grammarName;
    private String sentence;
    private List<String> options;
    private String correctAnswer;
    private String translation;
    private String hint;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static VocabAiChallengeDto fromEntity(VocabPracticeAiChallenge entity) {
        if (entity == null) return null;
        List<String> optionsList = new ArrayList<>();
        if (entity.getOptionsJson() != null && !entity.getOptionsJson().isBlank()) {
            try {
                optionsList = MAPPER.readValue(entity.getOptionsJson(), new TypeReference<List<String>>() {});
            } catch (Exception ignored) {
            }
        }

        return VocabAiChallengeDto.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .word(entity.getWord())
                .topic(entity.getTopic())
                .grammarName(entity.getGrammarName())
                .sentence(entity.getSentence())
                .options(optionsList)
                .correctAnswer(entity.getCorrectAnswer())
                .translation(entity.getTranslation())
                .hint(entity.getHint())
                .build();
    }
}
