package com.example.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO trả về kết quả sau khi user nộp bài thi.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultResponse {

    /** Tổng số câu đúng (Listening + Reading) */
    private Integer totalCorrect;

    /** Tổng số câu của toàn bài thi */
    private Integer totalQuestions;

    // --- Listening ---
    /** Số câu đúng phần Listening */
    private Integer listeningCorrect;
    /** Tổng câu phần Listening */
    private Integer listeningTotal;
    /** Số khiên đạt được phần Listening (0-5) */
    private Integer listeningShields;
    /** Chi tiết đúng/sai từng part của Listening (JSON string) */
    private PartScoreDetail listeningPartScores;

    // --- Reading & Writing ---
    /** Số câu đúng phần Reading & Writing */
    private Integer readingCorrect;
    /** Tổng câu phần Reading */
    private Integer readingTotal;
    /** Số khiên đạt được phần Reading (0-5) */
    private Integer readingShields;
    /** Chi tiết đúng/sai từng part của Reading (JSON string) */
    private PartScoreDetail readingPartScores;

    /** ID của bản ghi lịch sử vừa được lưu */
    private Long historyId;

    /**
     * Thống kê từ vựng sai theo topic (hiển thị ngay trên trang kết quả).
     * Key = tên topic, Value = danh sách các từ làm sai trong topic đó.
     * Chỉ bao gồm các từ thuộc topic trong MockVocabularyRepository.
     */
    private Map<String, List<String>> wrongVocabByTopic;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PartScoreDetail {
        private Integer part1Correct;
        private Integer part1Total;
        private Integer part2Correct;
        private Integer part2Total;
        private Integer part3Correct;
        private Integer part3Total;
        private Integer part4Correct;
        private Integer part4Total;
        private Integer part5Correct; // chỉ dùng cho Reading
        private Integer part5Total;   // chỉ dùng cho Reading
    }
}

