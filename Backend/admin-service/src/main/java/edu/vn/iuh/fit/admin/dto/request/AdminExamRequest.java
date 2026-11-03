package edu.vn.iuh.fit.admin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Thông tin cơ bản của đề thi, dùng cho cả tạo mới lẫn cập nhật.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminExamRequest {
    private String examType;
    private String title;
    private String description;
    private String level;
    private Integer listeningDuration;
    private Integer readingDuration;
}
