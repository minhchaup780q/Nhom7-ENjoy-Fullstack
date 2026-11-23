package com.example.learningservice.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về chi tiết đề thi, bao gồm toàn bộ payload câu hỏi.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamDetailResponse {
    private Long id;
    private String examType;
    private String title;
    private String description;
    private String level;
    private Integer listeningDuration;
    private Integer readingDuration;
    private Integer totalListeningQuestions;
    private Integer totalReadingQuestions;

    /**
     * @JsonRawValue: Jackson sẽ nhúng trực tiếp chuỗi JSON này vào response
     *               thay vì bọc thêm dấu nháy kép.
     */
    @JsonRawValue
    private String listeningPayload;

    @JsonRawValue
    private String readingPayload;
}
