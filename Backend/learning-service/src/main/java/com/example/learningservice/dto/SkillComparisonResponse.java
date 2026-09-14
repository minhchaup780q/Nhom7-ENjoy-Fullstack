package com.example.learningservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillComparisonResponse {
    private String currentDate;
    private String previousDate;
    private SkillScoresDto currentSkills;
    private SkillScoresDto previousSkills;
    private Long totalCompletedLessons;
    private Long totalMistakes;
    private Long masteredMistakes;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillScoresDto {
        private int listening;
        private int speaking;
        private int reading;
        private int writing;
        private int vocabGrammar;
    }
}
