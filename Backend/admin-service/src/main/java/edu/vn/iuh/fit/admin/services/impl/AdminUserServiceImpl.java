package edu.vn.iuh.fit.admin.services.impl;

import edu.vn.iuh.fit.admin.client.ActiveStatsClient;
import edu.vn.iuh.fit.admin.client.UserClient;
import edu.vn.iuh.fit.admin.client.dto.ActiveStatsResponse;
import edu.vn.iuh.fit.admin.dto.response.OverviewResponse;
import edu.vn.iuh.fit.admin.dto.response.UserCountResponse;
import edu.vn.iuh.fit.admin.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final UserClient userClient;
    private final ActiveStatsClient activeStatsClient;

    @Override
    public UserCountResponse getUserCount() {
        long count = 0L;
        try {
            Long fetchedCount = userClient.getTotalUserCount();
            if (fetchedCount != null) {
                count = fetchedCount;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error calling user-service via OpenFeign in AdminUserServiceImpl: " + e.getMessage());
        }

        return UserCountResponse.builder()
                .totalUsers(count)
                .build();
    }

    @Override
    public Map<String, Long> getRolesCount() {
        try {
            return userClient.countUsersByRole();
        } catch (Exception e) {
            System.err.println("⚠️ Error calling user-service via OpenFeign for roles count: " + e.getMessage());
            return new HashMap<>();
        }
    }

    @Override
    public Map<String, Long> getActivityStats() {
        try {
            return userClient.getParentActivityStats();
        } catch (Exception e) {
            System.err.println("⚠️ Error calling user-service via OpenFeign for activity stats: " + e.getMessage());
            return new HashMap<>();
        }
    }

    @Override
    public OverviewResponse getOverview() {
        long totalUsers = 0L;
        long previousMonthTotal = 0L;
        try {
            Long fetchedTotal = userClient.getTotalUserCount();
            if (fetchedTotal != null) {
                totalUsers = fetchedTotal;
            }
            // Cuối tháng trước = trước 00:00 ngày 1 của tháng hiện tại
            LocalDateTime startOfMonth = LocalDate.now(ZONE).withDayOfMonth(1).atStartOfDay();
            Long fetchedPrevious = userClient.countUsersCreatedBefore(startOfMonth.toString());
            if (fetchedPrevious != null) {
                previousMonthTotal = fetchedPrevious;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error calling user-service via OpenFeign for overview: " + e.getMessage());
        }

        ActiveStatsResponse activeStats = new ActiveStatsResponse();
        try {
            ActiveStatsResponse fetched = activeStatsClient.getActiveStats();
            if (fetched != null) {
                activeStats = fetched;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error calling auth-service via OpenFeign for active stats: " + e.getMessage());
        }

        return OverviewResponse.builder()
                .totalUsers(totalUsers)
                .previousMonthTotalUsers(previousMonthTotal)
                .userGrowthPercent(growthPercent(totalUsers, previousMonthTotal))
                .dau(activeStats.getDau())
                .mau(activeStats.getMau())
                .stickinessRatio(activeStats.getStickinessRatio())
                .build();
    }

    private static Double growthPercent(long current, long previous) {
        if (previous == 0) {
            return null;
        }
        return Math.round((current - previous) * 1000.0 / previous) / 10.0;
    }
}
