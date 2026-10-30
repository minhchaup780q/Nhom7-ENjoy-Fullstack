package edu.vn.iuh.fit.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// Dùng chung cho cả Feign (deserialize JSON từ learning-service) lẫn response trả cho FE,
// vì admin-service chỉ chuyển tiếp, không biến đổi gì thêm.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private String badge;
    private Long attemptCount;
    private LocalDateTime createdAt;
}
