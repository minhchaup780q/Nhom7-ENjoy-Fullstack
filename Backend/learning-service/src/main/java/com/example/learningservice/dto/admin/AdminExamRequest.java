package com.example.learningservice.dto.admin;

import lombok.*;

/**
 * Dùng cho cả tạo mới lẫn cập nhật thông tin cơ bản của đề thi.
 * Không nhận totalListeningQuestions/totalReadingQuestions: 2 số này được
 * tính lại tự động mỗi khi lưu một phần (đếm câu không phải ví dụ).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminExamRequest {
    private String examType;
    private String title;
    private String description;
    private String level;
    private Integer listeningDuration;
    private Integer readingDuration;
}
