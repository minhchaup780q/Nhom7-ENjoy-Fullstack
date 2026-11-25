package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.response.ActiveStatsResponse;
import edu.vn.iuh.fit.authservice.dto.response.CohortRetentionRowResponse;
import edu.vn.iuh.fit.authservice.entities.Account;
import edu.vn.iuh.fit.authservice.entities.DailyActiveStats;
import edu.vn.iuh.fit.authservice.entities.DailyActiveUser;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import edu.vn.iuh.fit.authservice.repositories.AccountRepository;
import edu.vn.iuh.fit.authservice.repositories.DailyActiveStatsRepository;
import edu.vn.iuh.fit.authservice.repositories.DailyActiveUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Active user behavior tests")
class ActiveUserServiceImplTest {

    @Mock
    private StringRedisTemplate stringRedisTemplate;

    @Mock
    private SetOperations<String, String> setOperations;

    @Mock
    private DailyActiveUserRepository dailyActiveUserRepository;

    @Mock
    private DailyActiveStatsRepository dailyActiveStatsRepository;

    @Mock
    private AccountRepository accountRepository;

    private final Map<String, Set<String>> redisSets = new HashMap<>();
    private final Map<String, Duration> redisExpirations = new HashMap<>();
    private final List<DailyActiveUser> storedDailyUsers = new ArrayList<>();
    private final Set<LocalDate> flushedDates = new HashSet<>();
    private ActiveUserServiceImpl activeUserService;

    @BeforeEach
    void setUp() {
        redisSets.clear();
        redisExpirations.clear();
        storedDailyUsers.clear();
        flushedDates.clear();

        activeUserService = new ActiveUserServiceImpl(
                stringRedisTemplate, dailyActiveUserRepository, dailyActiveStatsRepository, accountRepository);
        lenient().when(stringRedisTemplate.opsForSet()).thenReturn(setOperations);
        lenient().when(setOperations.add(anyString(), anyString())).thenAnswer(invocation -> {
            String key = invocation.getArgument(0);
            String id = invocation.getArgument(1);
            return redisSets.computeIfAbsent(key, ignored -> new HashSet<>()).add(id) ? 1L : 0L;
        });
        lenient().when(setOperations.members(anyString())).thenAnswer(invocation ->
                new HashSet<>(redisSets.getOrDefault(invocation.getArgument(0), Set.of())));
        lenient().when(stringRedisTemplate.expire(anyString(), any(Duration.class))).thenAnswer(invocation -> {
            redisExpirations.put(invocation.getArgument(0), invocation.getArgument(1));
            return true;
        });
        lenient().when(stringRedisTemplate.delete(anyString())).thenAnswer(invocation ->
                redisSets.remove(invocation.getArgument(0)) != null);

        lenient().when(dailyActiveUserRepository.findDistinctAccountIdsBetween(
                any(LocalDate.class), any(LocalDate.class))).thenReturn(List.of());
        lenient().when(dailyActiveUserRepository.findAccountIdsByStatDate(any(LocalDate.class)))
                .thenAnswer(invocation -> storedDailyUsers.stream()
                        .filter(row -> row.getStatDate().equals(invocation.getArgument(0)))
                        .map(DailyActiveUser::getAccountId)
                        .toList());
        lenient().when(dailyActiveUserRepository.saveAll(any())).thenAnswer(invocation -> {
            Iterable<DailyActiveUser> rows = invocation.getArgument(0);
            rows.forEach(storedDailyUsers::add);
            return storedDailyUsers;
        });
        lenient().when(dailyActiveUserRepository.countDistinctAccountIdsBetween(
                any(LocalDate.class), any(LocalDate.class))).thenAnswer(invocation ->
                storedDailyUsers.stream()
                        .map(DailyActiveUser::getAccountId)
                        .distinct()
                        .count());
        lenient().when(dailyActiveStatsRepository.save(any(DailyActiveStats.class)))
                .thenAnswer(invocation -> {
                    DailyActiveStats stats = invocation.getArgument(0);
                    flushedDates.add(stats.getStatDate());
                    return stats;
                });
        lenient().when(dailyActiveStatsRepository.existsById(any(LocalDate.class)))
                .thenAnswer(invocation -> flushedDates.contains(invocation.getArgument(0)));
        lenient().when(accountRepository.findRegisteredBetween(
                any(UserRole.class), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of());
    }

    @Test
    @DisplayName("TC36: Người dùng thường được tính vào hoạt động trong ngày")
    void trackActive_regularUser_addsToRedisSetWithTtl() {
        Long accountId = 42L;
        LocalDate today = activeUserService.today();
        String redisKey = "dau:" + today;

        activeUserService.trackActive(accountId, UserRole.ROLE_PARENT.name());

        assertThat(redisSets.get(redisKey)).contains("42");
        assertThat(redisExpirations.get(redisKey)).isEqualTo(Duration.ofDays(3));
    }

    @Test
    @DisplayName("TC37: Tài khoản Admin không được tính vào hoạt động")
    void trackActive_adminRole_doesNothing() {
        activeUserService.trackActive(42L, UserRole.ROLE_ADMIN.name());

        assertThat(redisSets).isEmpty();
    }

    @Test
    @DisplayName("TC38: Lỗi Redis không làm gián đoạn ghi nhận hoạt động")
    void trackActive_redisThrowsException_doesNotPropagateToCalller() {
        when(stringRedisTemplate.opsForSet()).thenThrow(new RuntimeException("Redis unavailable"));

        assertThatCode(() -> activeUserService.trackActive(42L, UserRole.ROLE_PARENT.name()))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("TC39: DAU và MAU được tính từ các tài khoản hoạt động")
    void getActiveStats_usersInRedis_dauEqualsSetSize() {
        LocalDate today = activeUserService.today();
        redisSets.put("dau:" + today, Set.of("11", "22", "33"));

        ActiveStatsResponse response = activeUserService.getActiveStats();

        assertThat(response.getDau()).isEqualTo(3);
        assertThat(response.getMau()).isEqualTo(3);
        assertThat(response.getStickinessRatio()).isEqualTo(100.0);
    }

    @Test
    @DisplayName("TC40: Tổng hợp trong ngày chỉ ghi các tài khoản chưa lưu")
    void flushDay_newIds_savesOnlyNewRows() {
        LocalDate date = LocalDate.of(2026, 11, 13);
        redisSets.put("dau:" + date, Set.of("1", "2", "3"));
        storedDailyUsers.add(DailyActiveUser.builder().statDate(date).accountId(2L).build());

        activeUserService.flushDay(date);

        assertThat(storedDailyUsers)
                .filteredOn(row -> row.getStatDate().equals(date))
                .extracting(DailyActiveUser::getAccountId)
                .containsExactlyInAnyOrder(2L, 1L, 3L);
        assertThat(flushedDates).contains(date);
    }

    @Test
    @DisplayName("TC41: Xóa dữ liệu hoạt động của ngày khỏi Redis")
    void clearRedisDay_always_deletesKeyFromRedis() {
        LocalDate date = LocalDate.of(2026, 11, 13);
        redisSets.put("dau:" + date, Set.of("1", "2", "3"));

        activeUserService.clearRedisDay(date);

        assertThat(redisSets).doesNotContainKey("dau:" + date);
    }

    @Test
    @DisplayName("TC42: Ngày đã tổng hợp được báo trạng thái hoàn tất")
    void isDayFlushed_dateExists_returnsTrue() {
        LocalDate date = LocalDate.of(2026, 11, 13);
        flushedDates.add(date);

        assertThat(activeUserService.isDayFlushed(date)).isTrue();
    }

    @Test
    @DisplayName("TC43: Không có người đăng ký thì danh sách retention rỗng")
    void getCohortRetention_emptyCohort_returnsEmptyList() {
        List<CohortRetentionRowResponse> rows = activeUserService.getCohortRetention(7);

        assertThat(rows).isEmpty();
    }
}
