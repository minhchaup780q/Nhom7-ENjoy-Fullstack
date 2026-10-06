package com.example.learningservice.dto;

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

    private List<VocabAnswer> vocabAnswers;       // Kết quả vòng 1
    private List<GrammarAnswer> grammarAnswers;   // Kết quả vòng 2
    private List<SpeakingAnswer> speakingAnswers; // Kết quả vòng 3

    // -------------------------------------------------------
    // Vòng 1: User nối từ - client gửi về từng cặp đã nối
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VocabAnswer {
        private Long vocabularyId;
        private Long topicId;
        private String word;
        private String selectedTranslation; // Nghĩa user chọn
        private String correctTranslation;  // Nghĩa đúng (để backend verify)
    }

    // -------------------------------------------------------
    // Vòng 2: User sắp xếp câu
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GrammarAnswer {
        private Long topicId;
        private String correctSentence; // Câu đúng gốc
        private String userSentence;    // Câu user sắp xếp
        private String grammarName;     // Tên ngữ pháp liên quan
    }

    // -------------------------------------------------------
    // Vòng 3: User nói câu
    // -------------------------------------------------------
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SpeakingAnswer {
        private Long topicId;
        private String sentence;        // Câu cần nói
        private String recognizedText;  // Văn bản được nhận dạng từ speech service
        private Float score;            // Điểm speech (0-100), null nếu không nhận được
    }
}
