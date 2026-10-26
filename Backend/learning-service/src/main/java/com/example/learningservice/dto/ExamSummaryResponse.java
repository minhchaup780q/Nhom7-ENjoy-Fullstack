package com.example.learningservice.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về cho màn hình danh sách đề thi.
 * Không bao gồm payload JSON nặng để tối ưu tốc độ tải.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamSummaryResponse {
    private Long id;
    private String examType;
    private String title;
    private String description;
    private String level;
    private Integer listeningDuration;
    private Integer readingDuration;
    private Integer totalListeningQuestions;
    private Integer totalReadingQuestions;
    private Boolean isCompleted;
}
