package edu.vn.iuh.fit.authservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

// 1 dòng = 1 cohort (nhóm tài khoản đăng ký cùng 1 ngày) + tỉ lệ giữ chân tại các mốc.
// Các tỉ lệ dùng Double để có thể là null khi mốc ngày đó chưa tới (chưa đủ dữ liệu),
// phân biệt với 0.0 (có dữ liệu nhưng không ai quay lại).
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CohortRetentionRowResponse {
    private LocalDate cohortDate;
    private long newUsers;
    private Double day1Rate;
    private Double day7Rate;
    private Double day14Rate;
    private Double churn14Rate;
}
