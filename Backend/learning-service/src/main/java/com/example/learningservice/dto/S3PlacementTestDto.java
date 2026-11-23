package com.example.learningservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO ánh xạ trực tiếp cấu trúc file placement_test.json trên S3.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class S3PlacementTestDto {

    @JsonProperty("test_id")
    private String testId;

    private String title;

    private List<RoundDto> rounds;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoundDto {
        @JsonProperty("round_number")
        private Integer roundNumber;

        @JsonProperty("round_name")
        private String roundName;

        private String type; // LISTEN_AND_CHOOSE_IMAGE, MATCH_PAIR, SENTENCE_BUILDER

        private List<QuestionDto> questions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDto {
        @JsonProperty("question_id")
        private String questionId;

        private String topic;

        // Dành cho Vòng 1
        @JsonProperty("audio_url")
        private String audioUrl;

        private List<OptionDto> options;

        @JsonProperty("correct_answer")
        private String correctAnswer;

        // Dành cho Vòng 2
        private String word;
        private String meaning;

        // Dành cho Vòng 3
        private String sentence;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionDto {
        private String id;
        private String label;

        @JsonProperty("image_url")
        private String imageUrl;
    }
}
