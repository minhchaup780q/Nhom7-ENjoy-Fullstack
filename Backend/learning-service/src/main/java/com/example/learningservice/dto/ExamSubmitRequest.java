package com.example.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO nhận bài làm của user khi nộp bài thi.
 *
 * Cấu trúc answers:
 * {
 *   "listening": {
 *     "part1": [{"index": 0, "answer": "Alice"}, ...],
 *     "part2": [{"index": 0, "answer": "18"}, ...],
 *     "part3": [{"index": 0, "answer": "B"}, ...],
 *     "part4": [{"index": 0, "answer": "red"}, ...]
 *   },
 *   "reading": {
 *     "part1": [{"index": 0, "answer": "right"}, ...],
 *     "part2": [{"index": 0, "answer": "yes"}, ...],
 *     "part3": [{"index": 0, "answer": "kite"}, ...],
 *     "part4": [{"position": 1, "answer": "tail"}, ...],
 *     "part5": [{"groupIndex": 0, "questionIndex": 0, "answer": "red and blue"}, ...]
 *   }
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamSubmitRequest {

    /** Đáp án phần Listening (key: "part1"..."part4") */
    private Map<String, List<PartAnswer>> listening;

    /** Đáp án phần Reading + Writing (key: "part1"..."part5") */
    private Map<String, List<PartAnswer>> reading;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PartAnswer {
        private Integer index;        // Dùng cho Part1, 2, 3, 4 của Listening và Part1, 2, 3 của Reading
        private Integer position;     // Dùng cho Reading Part4 (vị trí lỗ hổng)
        private Integer groupIndex;   // Dùng cho Reading Part5 (chỉ số nhóm ảnh)
        private Integer questionIndex;// Dùng cho Reading Part5 (chỉ số câu hỏi trong nhóm)
        private String answer;        // Đáp án user chọn / gõ
    }
}
