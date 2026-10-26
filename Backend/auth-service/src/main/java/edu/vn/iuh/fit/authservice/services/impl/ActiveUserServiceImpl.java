package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.response.ActiveStatsResponse;
import edu.vn.iuh.fit.authservice.entities.DailyActiveStats;
import edu.vn.iuh.fit.authservice.entities.DailyActiveUser;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import edu.vn.iuh.fit.authservice.repositories.DailyActiveStatsRepository;
import edu.vn.iuh.fit.authservice.repositories.DailyActiveUserRepository;
import edu.vn.iuh.fit.authservice.services.ActiveUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActiveUserServiceImpl implements ActiveUserService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private static final String DAU_KEY_PREFIX = "dau:";
    // Giữ key lâu hơn 1 ngày để job cuối ngày (hoặc job chạy bù khi khởi động) còn đọc được
    private static final Duration DAU_KEY_TTL = Duration.ofDays(3);
    private static final int MAU_WINDOW_DAYS = 30;

    private final StringRedisTemplate stringRedisTemplate;
    private final DailyActiveUserRepository dailyActiveUserRepository;
    private final DailyActiveStatsRepository dailyActiveStatsRepository;

    @Override
    public void trackActive(Long accountId, String role) {
        if (accountId == null || UserRole.ROLE_ADMIN.name().equals(role)) {
            return;
        }
        // Lỗi Redis không được làm hỏng luồng đăng nhập
        try {
            String key = dauKey(today());
            stringRedisTemplate.opsForSet().add(key, String.valueOf(accountId));
            stringRedisTemplate.expire(key, DAU_KEY_TTL);
        } catch (Exception e) {
            System.err.println("⚠️ Could not track active user in Redis: " + e.getMessage());
        }
    }

    @Override
    public ActiveStatsResponse getActiveStats() {
        LocalDate today = today();
        LocalDate windowStart = today.minusDays(MAU_WINDOW_DAYS - 1);

        Set<String> todayMembers = redisMembers(today);
        long dau = todayMembers.size();

        // MAU = các ngày đã ghi xuống DB + các ngày còn nằm trong Redis (hôm nay và những ngày chưa kịp flush)
        Set<Long> monthlyAccounts = new HashSet<>(
                dailyActiveUserRepository.findDistinctAccountIdsBetween(windowStart, today.minusDays(1)));
        addAll(monthlyAccounts, todayMembers);
        for (int i = 1; i <= DAU_KEY_TTL.toDays(); i++) {
            addAll(monthlyAccounts, redisMembers(today.minusDays(i)));
        }
        long mau = monthlyAccounts.size();

        return ActiveStatsResponse.builder()
                .dau(dau)
                .mau(mau)
                .stickinessRatio(stickiness(dau, mau))
                .build();
    }

    @Override
    @Transactional
    public void flushDay(LocalDate date) {
        Set<Long> redisIds = new HashSet<>();
        addAll(redisIds, redisMembers(date));

        // Idempotent: chỉ chèn những account chưa có trong DB của ngày đó
        Set<Long> existingIds = new HashSet<>(dailyActiveUserRepository.findAccountIdsByStatDate(date));
        List<DailyActiveUser> newRows = redisIds.stream()
                .filter(id -> !existingIds.contains(id))
                .map(id -> DailyActiveUser.builder().statDate(date).accountId(id).build())
                .collect(Collectors.toList());
        dailyActiveUserRepository.saveAll(newRows);

        long dau = existingIds.size() + newRows.size();
        long mau = dailyActiveUserRepository.countDistinctAccountIdsBetween(date.minusDays(MAU_WINDOW_DAYS - 1), date);

        dailyActiveStatsRepository.save(DailyActiveStats.builder()
                .statDate(date)
                .dau(dau)
                .mau(mau)
                .createdAt(LocalDateTime.now(ZONE))
                .build());
    }

    @Override
    public void clearRedisDay(LocalDate date) {
        try {
            stringRedisTemplate.delete(dauKey(date));
        } catch (Exception e) {
            System.err.println("⚠️ Could not delete DAU key in Redis: " + e.getMessage());
        }
    }

    @Override
    public boolean isDayFlushed(LocalDate date) {
        return dailyActiveStatsRepository.existsById(date);
    }

    @Override
    public LocalDate today() {
        return LocalDate.now(ZONE);
    }

    private Set<String> redisMembers(LocalDate date) {
        try {
            Set<String> members = stringRedisTemplate.opsForSet().members(dauKey(date));
            return members != null ? members : Set.of();
        } catch (Exception e) {
            System.err.println("⚠️ Could not read DAU key in Redis: " + e.getMessage());
            return Set.of();
        }
    }

    private static void addAll(Set<Long> target, Set<String> ids) {
        for (String id : ids) {
            try {
                target.add(Long.parseLong(id));
            } catch (NumberFormatException ignored) {
            }
        }
    }

    private static double stickiness(long dau, long mau) {
        if (mau == 0) {
            return 0;
        }
        return Math.round(dau * 1000.0 / mau) / 10.0;
    }

    private static String dauKey(LocalDate date) {
        return DAU_KEY_PREFIX + date;
    }
}
