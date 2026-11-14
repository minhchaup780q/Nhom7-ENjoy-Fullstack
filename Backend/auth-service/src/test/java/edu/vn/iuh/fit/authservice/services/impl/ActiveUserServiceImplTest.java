package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.response.ActiveStatsResponse;
import edu.vn.iuh.fit.authservice.dto.response.CohortRetentionRowResponse;
import edu.vn.iuh.fit.authservice.entities.DailyActiveUser;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import edu.vn.iuh.fit.authservice.repositories.AccountRepository;
import edu.vn.iuh.fit.authservice.repositories.DailyActiveStatsRepository;
import edu.vn.iuh.fit.authservice.repositories.DailyActiveUserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Active User Statistics Unit Tests")
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

    @InjectMocks
    private ActiveUserServiceImpl activeUserService;

    /**
     * Verifies that a regular user is added to today's Redis set with a three-day TTL.
     */
    @Test
    @DisplayName("trackActive: Thêm người dùng thường vào Redis với TTL 3 ngày")
    void trackActive_regularUser_addsToRedisSetWithTtl() {
        // Arrange
        Long accountId = 42L;
        LocalDate today = activeUserService.today();
        String redisKey = "dau:" + today;
        when(stringRedisTemplate.opsForSet()).thenReturn(setOperations);

        // Act
        activeUserService.trackActive(accountId, UserRole.ROLE_PARENT.name());

        // Assert
        verify(setOperations).add(redisKey, "42");
        verify(stringRedisTemplate).expire(redisKey, Duration.ofDays(3));
    }

    /**
     * Verifies that admin accounts are excluded from active-user tracking.
     */
    @Test
    @DisplayName("trackActive: Bỏ qua tài khoản admin")
    void trackActive_adminRole_doesNothing() {
        // Arrange
        Long accountId = 42L;

        // Act
        activeUserService.trackActive(accountId, UserRole.ROLE_ADMIN.name());

        // Assert
        verifyNoInteractions(stringRedisTemplate, setOperations);
    }

    /**
     * Verifies that Redis failures do not interrupt the caller's flow.
     */
    @Test
    @DisplayName("trackActive: Không ném lỗi khi Redis gặp sự cố")
    void trackActive_redisThrowsException_doesNotPropagateToCalller() {
        // Arrange
        when(stringRedisTemplate.opsForSet()).thenThrow(new RuntimeException("Redis unavailable"));

        // Act & Assert
        assertThatCode(() -> activeUserService.trackActive(42L, UserRole.ROLE_PARENT.name()))
                .doesNotThrowAnyException();
        verify(stringRedisTemplate).opsForSet();
    }

    /**
     * Verifies that DAU equals the number of today's Redis set members.
     */
    @Test
    @DisplayName("getActiveStats: DAU bằng số người dùng trong Redis")
    void getActiveStats_usersInRedis_dauEqualsSetSize() {
        // Arrange
        LocalDate today = activeUserService.today();
        when(stringRedisTemplate.opsForSet()).thenReturn(setOperations);
        when(setOperations.members("dau:" + today)).thenReturn(Set.of("11", "22", "33"));
        when(setOperations.members("dau:" + today.minusDays(1))).thenReturn(Set.of());
        when(setOperations.members("dau:" + today.minusDays(2))).thenReturn(Set.of());
        when(setOperations.members("dau:" + today.minusDays(3))).thenReturn(Set.of());
        when(dailyActiveUserRepository.findDistinctAccountIdsBetween(
                today.minusDays(29), today.minusDays(1))).thenReturn(List.of());

        // Act
        ActiveStatsResponse response = activeUserService.getActiveStats();

        // Assert
        assertThat(response.getDau()).isEqualTo(3);
        assertThat(response.getMau()).isEqualTo(3);
        assertThat(response.getStickinessRatio()).isEqualTo(100.0);
    }

    /**
     * Verifies that flushing persists only account IDs not already stored for the date.
     */
    @Test
    @DisplayName("flushDay: Chỉ lưu người dùng mới chưa có trong dữ liệu ngày")
    void flushDay_newIds_savesOnlyNewRows() {
        // Arrange
        LocalDate date = LocalDate.of(2026, 11, 13);
        when(stringRedisTemplate.opsForSet()).thenReturn(setOperations);
        when(setOperations.members("dau:" + date)).thenReturn(Set.of("1", "2", "3"));
        when(dailyActiveUserRepository.findAccountIdsByStatDate(date)).thenReturn(List.of(2L));
        when(dailyActiveUserRepository.countDistinctAccountIdsBetween(date.minusDays(29), date))
                .thenReturn(5L);

        ArgumentCaptor<Iterable<DailyActiveUser>> rowsCaptor = ArgumentCaptor.captor();

        // Act
        activeUserService.flushDay(date);

        // Assert
        verify(dailyActiveUserRepository).saveAll(rowsCaptor.capture());
        List<DailyActiveUser> savedRows = new ArrayList<>();
        rowsCaptor.getValue().forEach(savedRows::add);
        assertThat(savedRows)
                .extracting(DailyActiveUser::getAccountId)
                .containsExactlyInAnyOrder(1L, 3L);
        assertThat(savedRows)
                .extracting(DailyActiveUser::getStatDate)
                .containsOnly(date);
    }

    /**
     * Verifies that clearing a date removes its DAU key from Redis.
     */
    @Test
    @DisplayName("clearRedisDay: Xóa key DAU của ngày khỏi Redis")
    void clearRedisDay_always_deletesKeyFromRedis() {
        // Arrange
        LocalDate date = LocalDate.of(2026, 11, 13);

        // Act
        activeUserService.clearRedisDay(date);

        // Assert
        verify(stringRedisTemplate).delete("dau:" + date);
    }

    /**
     * Verifies that an existing daily statistics record marks a date as flushed.
     */
    @Test
    @DisplayName("isDayFlushed: Trả về true khi ngày đã được ghi nhận")
    void isDayFlushed_dateExists_returnsTrue() {
        // Arrange
        LocalDate date = LocalDate.of(2026, 11, 13);
        when(dailyActiveStatsRepository.existsById(date)).thenReturn(true);

        // Act
        boolean flushed = activeUserService.isDayFlushed(date);

        // Assert
        assertThat(flushed).isTrue();
        verify(dailyActiveStatsRepository).existsById(date);
    }

    /**
     * Verifies that no cohort rows are returned when no accounts registered in the requested period.
     */
    @Test
    @DisplayName("getCohortRetention: Trả danh sách rỗng khi không có cohort")
    void getCohortRetention_emptyCohort_returnsEmptyList() {
        // Arrange
        int days = 7;
        LocalDate today = activeUserService.today();
        LocalDateTime from = today.minusDays(days - 1L).atStartOfDay();
        LocalDateTime to = today.plusDays(1).atStartOfDay();
        when(accountRepository.findRegisteredBetween(UserRole.ROLE_ADMIN, from, to))
                .thenReturn(List.of());

        // Act
        List<CohortRetentionRowResponse> rows = activeUserService.getCohortRetention(days);

        // Assert
        assertThat(rows).isEmpty();
        verify(accountRepository).findRegisteredBetween(UserRole.ROLE_ADMIN, from, to);
    }
}
