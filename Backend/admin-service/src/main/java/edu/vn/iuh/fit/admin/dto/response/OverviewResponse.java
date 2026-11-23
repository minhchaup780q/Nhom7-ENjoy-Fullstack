package edu.vn.iuh.fit.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverviewResponse {
    private long totalUsers;
    // Tổng user tại thời điểm cuối tháng trước
    private long previousMonthTotalUsers;
    // % tăng so với cuối tháng trước; null nếu tháng trước chưa có user
    private Double userGrowthPercent;

    private long dau;
    private long mau;
    private double stickinessRatio;
}
