package edu.vn.iuh.fit.admin.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO để Feign deserialize JSON trả về từ GET /api/auth/internal/active-stats
 * của auth-service. Chỉ dùng nội bộ để gọi sang service khác (không trả ra ngoài
 * cho FE) — nhập vào {@link edu.vn.iuh.fit.admin.dto.response.OverviewResponse}
 * ở AdminUserServiceImpl.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActiveStatsResponse {
    private long dau;
    private long mau;
    private double stickinessRatio;
}
