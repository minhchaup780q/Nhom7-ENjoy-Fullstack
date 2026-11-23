package edu.vn.iuh.fit.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

// Kết quả kiểm tra điều kiện xuất bản, chuyển tiếp nguyên vẹn từ learning-service.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublishValidationResult {
    private boolean valid;
    private String message;

    @Builder.Default
    private List<String> errors = new ArrayList<>();
}
