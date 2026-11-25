package com.example.learningservice.services.impl;

import com.example.learningservice.config.RabbitMQConfig;
import com.example.learningservice.dto.AddXpEvent;
import com.example.learningservice.entities.LeaderboardEntry;
import com.example.learningservice.entities.Tournament;
import com.example.learningservice.entities.UserRankProfile;
import com.example.learningservice.entities.enums.RankTier;
import com.example.learningservice.entities.enums.TournamentStatus;
import com.example.learningservice.entities.enums.XpSourceType;
import com.example.learningservice.repositories.LeaderboardEntryRepository;
import com.example.learningservice.repositories.TournamentRepository;
import com.example.learningservice.repositories.UserProgressRepository;
import com.example.learningservice.repositories.UserRankProfileRepository;
import com.example.learningservice.repositories.XpTransactionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Leaderboard Service Unit Tests")
class LeaderboardServiceImplTest {

    @Mock
    private TournamentRepository tournamentRepository;

    @Mock
    private UserRankProfileRepository userRankProfileRepository;

    @Mock
    private LeaderboardEntryRepository leaderboardEntryRepository;

    @Mock
    private XpTransactionRepository xpTransactionRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private LeaderboardServiceImpl leaderboardService;

    /**
     * Verifies that requesting a leaderboard for a new user creates a Bronze rank profile.
     */
    @Test
    @DisplayName("getCurrentLeaderboard: Tạo hồ sơ hạng Bronze cho người dùng mới")
    void getCurrentLeaderboard_newUser_createsRankProfileWithBronze() {
        // Arrange
        Long userId = 42L;
        Tournament tournament = activeTournament();
        UserRankProfile profile = UserRankProfile.builder()
                .userId(userId)
                .currentRank(RankTier.BRONZE)
                .highestRank(RankTier.BRONZE)
                .totalXp(0L)
                .top1Count(0)
                .currentStreak(0)
                .longestStreak(0)
                .username("New User")
                .avatarUrl("avatar.png")
                .build();
        when(tournamentRepository.findFirstByStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(
                any(LocalDateTime.class), any(LocalDateTime.class), eq(TournamentStatus.ACTIVE)))
                .thenReturn(Optional.of(tournament));
        when(userRankProfileRepository.findByUserId(userId))
                .thenReturn(Optional.empty(), Optional.of(profile));
        when(userRankProfileRepository.save(any(UserRankProfile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(userRankProfileRepository.findAll()).thenReturn(List.of());
        when(leaderboardEntryRepository.findByTournamentIdAndUserId(tournament.getId(), userId))
                .thenReturn(Optional.empty());
        when(leaderboardEntryRepository.save(any(LeaderboardEntry.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(leaderboardEntryRepository.findByTournamentIdAndRankTierOrderByWeeklyXpDescLastXpUpdatedAtAsc(
                eq(tournament.getId()), eq(RankTier.BRONZE), any()))
                .thenAnswer(invocation -> List.of(leaderboardEntry(userId, tournament)));
        when(userProgressRepository.findByUserIdAndStatusAndCompletedAtBetween(
                eq(userId), eq(com.example.learningservice.entities.enums.SessionStatus.FINISH),
                any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of());

        ArgumentCaptor<UserRankProfile> profileCaptor = ArgumentCaptor.forClass(UserRankProfile.class);

        // Act
        var response = leaderboardService.getCurrentLeaderboard(userId, "New User", "avatar.png");

        // Assert
        assertThat(response.getCurrentRank().getTier()).isEqualTo(RankTier.BRONZE);
        assertThat(response.getCurrentUserEntry().getUserId()).isEqualTo(userId);
        verify(userRankProfileRepository).save(profileCaptor.capture());
        assertThat(profileCaptor.getValue().getCurrentRank()).isEqualTo(RankTier.BRONZE);
        assertThat(profileCaptor.getValue().getHighestRank()).isEqualTo(RankTier.BRONZE);
        assertThat(profileCaptor.getValue().getTotalXp()).isZero();
    }

    /**
     * Verifies that a new active weekly tournament is created when none exists.
     */
    @Test
    @DisplayName("getOrCreateCurrentTournament: Tạo giải đấu mới khi chưa có giải hiện hành")
    void getCurrentLeaderboard_noTournament_createsNewTournament() {
        // Arrange
        when(tournamentRepository.findFirstByStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(
                any(LocalDateTime.class), any(LocalDateTime.class), eq(TournamentStatus.ACTIVE)))
                .thenReturn(Optional.empty());
        when(tournamentRepository.findAll()).thenReturn(List.of());
        when(tournamentRepository.findBySeasonCode(any())).thenReturn(Optional.empty());
        when(tournamentRepository.save(any(Tournament.class)))
                .thenAnswer(invocation -> {
                    Tournament tournament = invocation.getArgument(0);
                    tournament.setId(9L);
                    return tournament;
                });
        ArgumentCaptor<Tournament> tournamentCaptor = ArgumentCaptor.forClass(Tournament.class);

        // Act
        Tournament result = leaderboardService.getOrCreateCurrentTournament();

        // Assert
        assertThat(result.getId()).isEqualTo(9L);
        assertThat(result.getStatus()).isEqualTo(TournamentStatus.ACTIVE);
        assertThat(result.getSeasonCode()).matches("\\d{4}_W\\d{2}");
        assertThat(result.getStartDate()).isBefore(result.getEndDate());
        verify(tournamentRepository).save(tournamentCaptor.capture());
        assertThat(tournamentCaptor.getValue().getStatus()).isEqualTo(TournamentStatus.ACTIVE);
        assertThat(tournamentCaptor.getValue().getCreateAt()).isNotNull();
    }

    /**
     * Verifies that adding XP publishes an event to the configured RabbitMQ exchange and routing key.
     */
    @Test
    @DisplayName("addXp: Gửi sự kiện cộng XP lên RabbitMQ")
    void addXp_always_publishesEventToRabbitMQ() {
        // Arrange
        Long userId = 42L;
        int xpAmount = 20;
        XpSourceType sourceType = XpSourceType.LESSON_FIRST_COMPLETE;
        Long sourceId = 7L;
        String description = "Complete lesson";
        String username = "Learner";
        String avatarUrl = "learner.png";
        ArgumentCaptor<AddXpEvent> eventCaptor = ArgumentCaptor.forClass(AddXpEvent.class);

        // Act
        leaderboardService.addXp(
                userId, xpAmount, sourceType, sourceId, description, username, avatarUrl);

        // Assert
        verify(rabbitTemplate).convertAndSend(
                eq(RabbitMQConfig.XP_EXCHANGE),
                eq(RabbitMQConfig.XP_ROUTING_KEY),
                eventCaptor.capture());
        AddXpEvent event = eventCaptor.getValue();
        assertThat(event.getUserId()).isEqualTo(userId);
        assertThat(event.getXpAmount()).isEqualTo(xpAmount);
        assertThat(event.getSourceType()).isEqualTo(sourceType);
        assertThat(event.getSourceId()).isEqualTo(sourceId);
        assertThat(event.getDescription()).isEqualTo(description);
        assertThat(event.getUsername()).isEqualTo(username);
        assertThat(event.getAvatarUrl()).isEqualTo(avatarUrl);
        assertThat(event.getTimestamp()).isNotNull();
    }

    private Tournament activeTournament() {
        LocalDateTime now = LocalDateTime.now(LeaderboardServiceImpl.ZONE_VN);
        return Tournament.builder()
                .id(1L)
                .seasonCode("2026_W46")
                .startDate(now.minusDays(1))
                .endDate(now.plusDays(5))
                .status(TournamentStatus.ACTIVE)
                .build();
    }

    private LeaderboardEntry leaderboardEntry(Long userId, Tournament tournament) {
        return LeaderboardEntry.builder()
                .id(1L)
                .tournament(tournament)
                .userId(userId)
                .rankTier(RankTier.BRONZE)
                .weeklyXp(0)
                .lastXpUpdatedAt(LocalDateTime.now(LeaderboardServiceImpl.ZONE_VN))
                .username("New User")
                .avatarUrl("avatar.png")
                .build();
    }
}
