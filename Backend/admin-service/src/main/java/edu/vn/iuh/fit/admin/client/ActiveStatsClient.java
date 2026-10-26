package edu.vn.iuh.fit.admin.client;

import edu.vn.iuh.fit.admin.client.dto.ActiveStatsResponse;
import edu.vn.iuh.fit.admin.dto.response.CohortRetentionRowResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

// Gọi sang auth-service để lấy số liệu DAU/MAU/Stickiness và bảng cohort giữ chân
// (auth-service là nơi ghi nhận hoạt động đăng nhập vào Redis). Không liên quan đến xác thực token.
@FeignClient(name = "auth-service")
public interface ActiveStatsClient {

    @GetMapping("/api/auth/internal/active-stats")
    ActiveStatsResponse getActiveStats();

    @GetMapping("/api/auth/internal/cohort-retention")
    List<CohortRetentionRowResponse> getCohortRetention(@RequestParam("days") int days);
}
