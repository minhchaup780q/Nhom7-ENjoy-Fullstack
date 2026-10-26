package edu.vn.iuh.fit.admin.client;

import edu.vn.iuh.fit.admin.client.dto.ActiveStatsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

// Gọi sang auth-service để lấy số liệu DAU/MAU/Stickiness (auth-service là nơi
// ghi nhận hoạt động đăng nhập vào Redis). Không liên quan đến xác thực token.
@FeignClient(name = "auth-service")
public interface ActiveStatsClient {

    @GetMapping("/api/auth/internal/active-stats")
    ActiveStatsResponse getActiveStats();
}
