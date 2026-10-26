package edu.vn.iuh.fit.authservice.services;

import edu.vn.iuh.fit.authservice.dto.response.ActiveStatsResponse;
import edu.vn.iuh.fit.authservice.dto.response.CohortRetentionRowResponse;

import java.time.LocalDate;
import java.util.List;

public interface ActiveUserService {
    // Ghi nhận 1 tài khoản "active" hôm nay (đăng nhập / refresh token thành công). Bỏ qua ROLE_ADMIN.
    void trackActive(Long accountId, String role);

    // DAU hôm nay (Redis) + MAU rolling 30 ngày (DB + Redis) + tỉ lệ DAU/MAU
    ActiveStatsResponse getActiveStats();

    // Bảng cohort giữ chân: nhóm theo ngày đăng ký trong `days` ngày gần nhất,
    // tỉ lệ active tại D+1/D+7/D+14. Sắp xếp ngày đăng ký mới nhất lên đầu.
    List<CohortRetentionRowResponse> getCohortRetention(int days);

    // Ghi dữ liệu active của 1 ngày từ Redis xuống DB và tổng hợp DAU/MAU của ngày đó
    void flushDay(LocalDate date);

    void clearRedisDay(LocalDate date);

    boolean isDayFlushed(LocalDate date);

    LocalDate today();
}
