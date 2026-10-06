package com.example.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO trả về đề bài kiểm tra đầu vào cho client.
 * Gồm 3 vòng: từ vựng, ngữ pháp (re_order), speaking.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementTestDto {

    private List<VocabRoundQuestion> vocabRound;       // Vòng 1
    private List<GrammarRoundQuestion> grammarRound;   // Vòng 2
    private List<SpeakingRoundQuestion> speakingRound; // Vòng 3

    // -------------------------------------------------------
    // Vòng 1: Nối từ vựng
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VocabRoundQuestion {
        private Long vocabularyId;
        private Long topicId;
        private String topicTitle;
        private String word;        // Tiếng Anh
        private String translation; // Tiếng Việt
    }

    // -------------------------------------------------------
    // Vòng 2: Sắp xếp câu (RE_ORDER_SENTENCE)
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GrammarRoundQuestion {
        private Long topicId;
        private String topicTitle;
        private String sentence;    // Câu đúng (để shuffle ở client)
        private String grammarName; // Tên grammar (title của session order 6)
    }

    // -------------------------------------------------------
    // Vòng 3: Speaking
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpeakingRoundQuestion {
        private Long topicId;
        private String topicTitle;
        private String sentence;    // Câu cần nói
        private Long vocabularyId;  // Null nếu dùng câu, có giá trị nếu dùng từ vựng
    }
}
