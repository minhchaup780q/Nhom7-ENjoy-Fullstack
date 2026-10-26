package edu.vn.iuh.fit.authservice.services;

import edu.vn.iuh.fit.authservice.dto.response.ActiveStatsResponse;

import java.time.LocalDate;

public interface ActiveUserService {
    // Ghi nhận 1 tài khoản "active" hôm nay (đăng nhập / refresh token thành công). Bỏ qua ROLE_ADMIN.
    void trackActive(Long accountId, String role);

    // DAU hôm nay (Redis) + MAU rolling 30 ngày (DB + Redis) + tỉ lệ DAU/MAU
    ActiveStatsResponse getActiveStats();

    // Ghi dữ liệu active của 1 ngày từ Redis xuống DB và tổng hợp DAU/MAU của ngày đó
    void flushDay(LocalDate date);

    void clearRedisDay(LocalDate date);

    boolean isDayFlushed(LocalDate date);

    LocalDate today();
}
