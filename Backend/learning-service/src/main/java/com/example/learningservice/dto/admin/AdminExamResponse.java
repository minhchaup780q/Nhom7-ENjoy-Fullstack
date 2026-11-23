package com.example.learningservice.dto.admin;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminExamResponse {
    private Long id;
    private String examType;
    private String title;
    private String description;
    private String level;

    private Integer listeningDuration;
    private Integer readingDuration;
    private Integer totalListeningQuestions;
    private Integer totalReadingQuestions;

    private Boolean isPublished;

    /**
     * DRAFT | PUBLISHED
     */
    private String badge;

    /**
     * Tổng số lượt user đã làm bài thi này (chỉ có ý nghĩa khi đã phát hành).
     */
    private Long attemptCount;

    private LocalDateTime createdAt;
}
