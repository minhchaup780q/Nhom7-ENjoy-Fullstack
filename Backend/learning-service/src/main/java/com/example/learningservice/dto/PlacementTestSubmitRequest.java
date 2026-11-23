package com.example.learningservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO nhận bài làm của user khi nộp bài kiểm tra đầu vào.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementTestSubmitRequest {

    private String testId;

    // Cấu trúc mới 3 vòng từ S3
    @JsonProperty("round1Answers")
    private List<Round1Answer> round1Answers;

    @JsonProperty("round2Answers")
    private List<Round2Answer> round2Answers;

    @JsonProperty("round3Answers")
    private List<Round3Answer> round3Answers;

    // Backward-compatibility nếu client cũ gửi
    private List<VocabAnswer> vocabAnswers;
    private List<GrammarAnswer> grammarAnswers;
    private List<SpeakingAnswer> speakingAnswers;

    // -------------------------------------------------------
    // Vòng 1: Nghe chọn ảnh (LISTEN_AND_CHOOSE_IMAGE)
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round1Answer {
        @JsonProperty("question_id")
        private String questionId;
        private String topic;
        @JsonProperty("selected_option_id")
        private String selectedOptionId;
    }

    // -------------------------------------------------------
    // Vòng 2: Nối từ với nghĩa (MATCH_PAIR)
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round2Answer {
        @JsonProperty("question_id")
        private String questionId;
        private String topic;
        private String word;
        @JsonProperty("selected_meaning")
        private String selectedMeaning;
    }

    // -------------------------------------------------------
    // Vòng 3: Sắp xếp câu (SENTENCE_BUILDER)
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round3Answer {
        @JsonProperty("question_id")
        private String questionId;
        private String topic;
        @JsonProperty("user_sentence")
        private String userSentence;
    }

    // -------------------------------------------------------
    // Legacy DTOs
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VocabAnswer {
        private Long vocabularyId;
        private Long topicId;
        private String word;
        private String selectedTranslation;
        private String correctTranslation;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GrammarAnswer {
        private Long topicId;
        private String correctSentence;
        private String userSentence;
        private String grammarName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpeakingAnswer {
        private Long topicId;
        private String sentence;
        private String recognizedText;
        private Float score;
    }
}
