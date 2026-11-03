package com.example.learningservice.dto.admin;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Chi tiết đề thi cho màn hình soạn thảo của Admin: giống AdminExamResponse
 * nhưng kèm cả 2 payload thô để prefill từng phần đang soạn.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminExamDetailResponse {
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
    private String badge;
    private Long attemptCount;
    private LocalDateTime createdAt;

    @JsonRawValue
    private String listeningPayload;

    @JsonRawValue
    private String readingPayload;
}
