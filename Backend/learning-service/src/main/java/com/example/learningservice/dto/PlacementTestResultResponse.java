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

    // -------------------------------------------------------
    // Kết quả tổng quan 3 vòng
    // -------------------------------------------------------
    private VocabResult vocabResult;
    private GrammarResult grammarResult;
    private SpeakingResult speakingResult;

    // -------------------------------------------------------
    // Vòng 1: Từ vựng
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VocabResult {
        private int correct;
        private int total;
        /** Danh sách topic => danh sách từ sai */
        private List<TopicVocabMistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TopicVocabMistake {
        private Long topicId;
        private String topicTitle;
        private List<String> wrongWords; // Danh sách từ tiếng Anh bị sai
    }

    // -------------------------------------------------------
    // Vòng 2: Ngữ pháp
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GrammarResult {
        private int correct;
        private int total;
        /** Danh sách grammar chưa vững */
        private List<GrammarMistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GrammarMistake {
        private Long topicId;
        private String wrongSentence;   // Câu user sắp xếp sai
        private String correctSentence; // Câu đúng
        private String grammarName;     // Tên ngữ pháp chưa vững (ví dụ: "Greetings, Names & Age")
    }

    // -------------------------------------------------------
    // Vòng 3: Speaking
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpeakingResult {
        private int correct;
        private int total;
        /** Tỉ lệ sai (0.0 -> 1.0) */
        private double wrongRate;
        /** Nhận xét tổng quan: "Tốt" / "Khá" / "Yếu" */
        private String overallComment;
        private List<SpeakingMistake> mistakes;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpeakingMistake {
        private Long topicId;
        private String sentence;       // Câu cần nói
        private String recognizedText; // Câu user đã nói
        private Float score;           // Điểm speech
    }
}
