package edu.vn.iuh.fit.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

// Dùng chung cho cả Feign (deserialize JSON từ auth-service) lẫn response trả cho FE,
// vì admin-service chỉ chuyển tiếp danh sách, không biến đổi gì thêm.
// Các tỉ lệ là Double (nullable) để phân biệt "chưa tới mốc" (null) với "0% quay lại".
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CohortRetentionRowResponse {
    private LocalDate cohortDate;
    private long newUsers;
    private Double day1Rate;
    private Double day7Rate;
    private Double day14Rate;
    private Double churn14Rate;
}
