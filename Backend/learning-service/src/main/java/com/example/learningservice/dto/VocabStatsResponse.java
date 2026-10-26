package com.example.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO trả về thống kê từ vựng của user để hiển thị trên trang Statistics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VocabStatsResponse {

    /** true nếu user chưa từng làm bài thi nào */
    private boolean noExamHistory;

    /**
     * Thống kê theo từng Topic.
     * Chỉ có dữ liệu khi noExamHistory = false.
     */
    private List<TopicStat> topics;

    /**
     * Dữ liệu lịch sử bài kiểm tra dùng cho biểu đồ tăng trưởng.
     */
    private List<ExamHistoryStat> examHistories;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicStat {
        private String topicName;
        private int weakCount;    // Số từ đang cần cải thiện (status=WEAK)
        private int correctCount; // Số từ đã cải thiện (status=CORRECT)
        /** "Developing" nếu correct > weak, "Weak" nếu ngược lại */
        private String status;
        /** Danh sách các từ đang WEAK (để hiển thị trên Result Page) */
        private List<String> weakWords;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExamHistoryStat {
        private String date; // "dd/MM"
        private int listeningScore;
        private int readingScore;
    }
}
