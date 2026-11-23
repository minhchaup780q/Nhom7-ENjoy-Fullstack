package com.example.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO trả về kết quả và nhận xét sau khi chấm bài kiểm tra đầu vào.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementTestResultResponse {

    private Long historyId;
    private int totalQuestions;
    private int totalCorrect;

    /** Danh sách các Topic được bỏ qua (miễn học) */
    private List<String> skippedTopics;

    // -------------------------------------------------------
    // Kết quả chi tiết 3 vòng mới
    // -------------------------------------------------------
    private Round1Result round1Result;
    private Round2Result round2Result;
    private Round3Result round3Result;

    // Giữ tương thích ngược cho giao diện cũ nếu cần
    private VocabResult vocabResult;
    private GrammarResult grammarResult;
    private SpeakingResult speakingResult;

    // -------------------------------------------------------
    // Vòng 1: Nghe chọn ảnh (LISTEN_AND_CHOOSE_IMAGE)
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round1Result {
        private int correct;
        private int total;
        private List<Round1Mistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round1Mistake {
        private String questionId;
        private String topic;
        private String selectedOptionId;
        private String correctOptionId;
    }

    // -------------------------------------------------------
    // Vòng 2: Nối từ với nghĩa (MATCH_PAIR)
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round2Result {
        private int correct;
        private int total;
        private List<Round2Mistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round2Mistake {
        private String questionId;
        private String topic;
        private String word;
        private String selectedMeaning;
        private String correctMeaning;
    }

    // -------------------------------------------------------
    // Vòng 3: Ghép câu (SENTENCE_BUILDER)
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round3Result {
        private int correct;
        private int total;
        private List<Round3Mistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Round3Mistake {
        private String questionId;
        private String topic;
        private String userSentence;
        private String correctSentence;
    }

    // -------------------------------------------------------
    // Legacy DTOs
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VocabResult {
        private int correct;
        private int total;
        private List<TopicVocabMistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TopicVocabMistake {
        private Long topicId;
        private String topicTitle;
        private List<String> wrongWords;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GrammarResult {
        private int correct;
        private int total;
        private List<GrammarMistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GrammarMistake {
        private Long topicId;
        private String wrongSentence;
        private String correctSentence;
        private String grammarName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpeakingResult {
        private int correct;
        private int total;
        private double wrongRate;
        private String overallComment;
        private List<SpeakingMistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpeakingMistake {
        private Long topicId;
        private String sentence;
        private String recognizedText;
        private Float score;
    }
}
