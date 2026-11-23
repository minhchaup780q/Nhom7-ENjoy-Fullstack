package edu.vn.iuh.fit.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// Chi tiết đề thi kèm payload đang soạn. Hai payload để kiểu Object để Jackson (bản 3 mà
// Spring Boot 4.1 dùng mặc định) đọc/ghi thẳng cấu trúc JSON bất kỳ (ánh xạ thành Map),
// không phụ thuộc kiểu JsonNode của một phiên bản Jackson cụ thể.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    private Object listeningPayload;
    private Object readingPayload;
}
