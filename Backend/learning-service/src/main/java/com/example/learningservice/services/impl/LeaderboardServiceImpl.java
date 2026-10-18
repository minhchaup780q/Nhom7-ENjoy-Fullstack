package com.example.learningservice.services.impl;

import com.example.learningservice.dto.LeaderboardResponseDto;
import com.example.learningservice.entities.LeaderboardEntry;
import com.example.learningservice.entities.Tournament;
import com.example.learningservice.entities.UserRankProfile;
import com.example.learningservice.entities.XpTransaction;
import com.example.learningservice.entities.enums.RankTier;
import com.example.learningservice.entities.enums.TournamentStatus;
import com.example.learningservice.entities.enums.XpSourceType;
import com.example.learningservice.entities.UserProgress;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.repositories.LeaderboardEntryRepository;
import com.example.learningservice.repositories.TournamentRepository;
import com.example.learningservice.repositories.UserProgressRepository;
import com.example.learningservice.repositories.UserRankProfileRepository;
import com.example.learningservice.repositories.XpTransactionRepository;
import com.example.learningservice.services.LeaderboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl implements LeaderboardService {

    private final TournamentRepository tournamentRepository;
    private final UserRankProfileRepository userRankProfileRepository;
    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final XpTransactionRepository xpTransactionRepository;
    private final UserProgressRepository userProgressRepository;

    @Override
    @Transactional
    public LeaderboardResponseDto getCurrentLeaderboard(Long userId, String username, String avatarUrl) {
        Tournament tournament = getOrCreateCurrentTournament();

        // 1. Tìm hoặc tạo hồ sơ Rank của user (Mặc định BRONZE)
        UserRankProfile profile = userRankProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserRankProfile newProfile = UserRankProfile.builder()
                            .userId(userId)
                            .currentRank(RankTier.BRONZE)
                            .highestRank(RankTier.BRONZE)
                            .totalXp(0L)
                            .top1Count(0)
                            .username(username != null && !username.isBlank() ? username : "Người dùng #" + userId)
                            .avatarUrl(avatarUrl)
                            .build();
                    newProfile.setCreateAt(LocalDateTime.now());
                    newProfile.setUpdateAt(LocalDateTime.now());
                    return userRankProfileRepository.save(newProfile);
                });

        // Cập nhật username/avatar nếu có thay đổi
        if (username != null && !username.isBlank() && !username.equals(profile.getUsername())) {
            profile.setUsername(username);
        }
        if (avatarUrl != null && !avatarUrl.isBlank() && !avatarUrl.equals(profile.getAvatarUrl())) {
            profile.setAvatarUrl(avatarUrl);
        }

        // 2. Đảm bảo user có bản ghi trong tuần thi đấu hiện tại (0 XP nếu vừa bắt đầu tuần)
        LeaderboardEntry userEntry = leaderboardEntryRepository.findByTournamentIdAndUserId(tournament.getId(), userId)
                .orElseGet(() -> {
                    LeaderboardEntry newEntry = LeaderboardEntry.builder()
                            .tournament(tournament)
                            .userId(userId)
                            .rankTier(profile.getCurrentRank())
                            .weeklyXp(0)
                            .lastXpUpdatedAt(LocalDateTime.now())
                            .username(profile.getUsername())
                            .avatarUrl(profile.getAvatarUrl())
                            .build();
                    newEntry.setCreateAt(LocalDateTime.now());
                    newEntry.setUpdateAt(LocalDateTime.now());
                    return leaderboardEntryRepository.save(newEntry);
                });

        // 3. Query tối đa 15 user điểm cao nhất trong CÙNG rank tier
        RankTier currentTier = profile.getCurrentRank();
        List<LeaderboardEntry> topEntries = leaderboardEntryRepository
                .findByTournamentIdAndRankTierOrderByWeeklyXpDescLastXpUpdatedAtAsc(
                        tournament.getId(), currentTier, PageRequest.of(0, 15)
                );

        List<LeaderboardResponseDto.LeaderboardUserDto> topUserDtos = new ArrayList<>();
        boolean userInTop15 = false;
        LeaderboardResponseDto.LeaderboardUserDto currentUserDto = null;

        for (int i = 0; i < topEntries.size(); i++) {
            LeaderboardEntry entry = topEntries.get(i);
            int rankNum = i + 1;
            boolean isMe = entry.getUserId().equals(userId);
            if (isMe) {
                userInTop15 = true;
            }

            LeaderboardResponseDto.LeaderboardUserDto dto = LeaderboardResponseDto.LeaderboardUserDto.builder()
                    .rank(rankNum)
                    .userId(entry.getUserId())
                    .username(entry.getUsername() != null ? entry.getUsername() : "Người dùng #" + entry.getUserId())
                    .avatarUrl(entry.getAvatarUrl())
                    .weeklyXp(entry.getWeeklyXp())
                    .isCurrentUser(isMe)
                    .isPromoting(rankNum <= 12)
                    .build();

            topUserDtos.add(dto);

            if (isMe) {
                currentUserDto = dto;
            }
        }

        // 4. Nếu user ngoài top 15, tính vị trí thực tế của user trong giải đấu
        if (!userInTop15) {
            long higherCount = leaderboardEntryRepository.countHigherRankUsers(
                    tournament.getId(), currentTier, userEntry.getWeeklyXp(), userEntry.getLastXpUpdatedAt()
            );
            int actualRank = (int) higherCount + 1;

            currentUserDto = LeaderboardResponseDto.LeaderboardUserDto.builder()
                    .rank(actualRank)
                    .userId(userId)
                    .username(profile.getUsername())
                    .avatarUrl(profile.getAvatarUrl())
                    .weeklyXp(userEntry.getWeeklyXp())
                    .isCurrentUser(true)
                    .isPromoting(actualRank <= 12)
                    .build();
        }

        // 5. Tính thời gian còn lại của giải đấu tuần
        LocalDateTime now = LocalDateTime.now();
        long daysRemaining = 0;
        if (tournament.getEndDate().isAfter(now)) {
            daysRemaining = Duration.between(now, tournament.getEndDate()).toDays();
            if (daysRemaining <= 0) {
                daysRemaining = 1; // Còn trong ngày cuối cùng của tuần
            }
        }

        return LeaderboardResponseDto.builder()
                .tournament(LeaderboardResponseDto.TournamentDto.builder()
                        .id(tournament.getId())
                        .seasonCode(tournament.getSeasonCode())
                        .daysRemaining(daysRemaining)
                        .endDate(tournament.getEndDate().toString())
                        .build())
                .currentRank(LeaderboardResponseDto.RankInfoDto.builder()
                        .tier(currentTier)
                        .nameVi(currentTier.getNameVi())
                        .level(currentTier.getLevel())
                        .color(currentTier.getHexColor())
                        .build())
                .promotionThreshold(12)
                .topUsers(topUserDtos)
                .currentUserEntry(currentUserDto)
                .streak(getUserStreak(userId))
                .build();
    }

    @Override
    @Transactional
    public void addXp(Long userId, int xpAmount, XpSourceType sourceType, Long sourceId, String description, String username, String avatarUrl) {
        if (userId == null || xpAmount <= 0) {
            return;
        }

        Tournament tournament = getOrCreateCurrentTournament();

        // 1. Cập nhật hồ sơ Rank Profile
        UserRankProfile profile = userRankProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserRankProfile newProfile = UserRankProfile.builder()
                            .userId(userId)
                            .currentRank(RankTier.BRONZE)
                            .highestRank(RankTier.BRONZE)
                            .totalXp(0L)
                            .top1Count(0)
                            .currentStreak(0)
                            .longestStreak(0)
                            .username(username != null && !username.isBlank() ? username : "Người dùng #" + userId)
                            .avatarUrl(avatarUrl)
                            .build();
                    newProfile.setCreateAt(LocalDateTime.now());
                    newProfile.setUpdateAt(LocalDateTime.now());
                    return newProfile;
                });

        if (username != null && !username.isBlank()) {
            profile.setUsername(username);
        }
        if (avatarUrl != null && !avatarUrl.isBlank()) {
            profile.setAvatarUrl(avatarUrl);
        }

        profile.setTotalXp((profile.getTotalXp() != null ? profile.getTotalXp() : 0L) + xpAmount);

        // Cập nhật chuỗi Streak liên tục thực tế
        LocalDate today = LocalDate.now();
        LocalDate lastDate = profile.getLastStudyDate();
        int currentStreak = (profile.getCurrentStreak() != null) ? profile.getCurrentStreak() : 0;
        int longestStreak = (profile.getLongestStreak() != null) ? profile.getLongestStreak() : 0;

        if (lastDate == null) {
            currentStreak = 1;
            profile.setLastStudyDate(today);
        } else if (!lastDate.equals(today)) {
            if (lastDate.equals(today.minusDays(1))) {
                currentStreak += 1;
            } else if (lastDate.isBefore(today.minusDays(1))) {
                currentStreak = 1;
            }
            profile.setLastStudyDate(today);
        }

        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }
        profile.setCurrentStreak(currentStreak);
        profile.setLongestStreak(longestStreak);

        profile.setUpdateAt(LocalDateTime.now());
        userRankProfileRepository.save(profile);

        // 2. Ghi nhận nhật ký XpTransaction
        XpTransaction tx = XpTransaction.builder()
                .userId(userId)
                .xpAmount(xpAmount)
                .sourceType(sourceType)
                .sourceId(sourceId)
                .description(description != null ? description : "Hoàn thành bài học +" + xpAmount + " KN")
                .build();
        tx.setCreateAt(LocalDateTime.now());
        tx.setUpdateAt(LocalDateTime.now());
        xpTransactionRepository.save(tx);

        // 3. Cập nhật điểm tuần trong LeaderboardEntry
        LeaderboardEntry entry = leaderboardEntryRepository.findByTournamentIdAndUserId(tournament.getId(), userId)
                .orElseGet(() -> {
                    LeaderboardEntry newEntry = LeaderboardEntry.builder()
                            .tournament(tournament)
                            .userId(userId)
                            .rankTier(profile.getCurrentRank())
                            .weeklyXp(0)
                            .username(profile.getUsername())
                            .avatarUrl(profile.getAvatarUrl())
                            .build();
                    newEntry.setCreateAt(LocalDateTime.now());
                    return newEntry;
                });

        entry.setWeeklyXp((entry.getWeeklyXp() != null ? entry.getWeeklyXp() : 0) + xpAmount);
        entry.setLastXpUpdatedAt(LocalDateTime.now());
        entry.setUpdateAt(LocalDateTime.now());
        if (profile.getUsername() != null) {
            entry.setUsername(profile.getUsername());
        }
        if (profile.getAvatarUrl() != null) {
            entry.setAvatarUrl(profile.getAvatarUrl());
        }

        leaderboardEntryRepository.save(entry);
        log.info("Đã cộng {} KN cho user #{} ({}) - Tổng KN tuần: {} - Streak: {} ngày",
                xpAmount, userId, profile.getUsername(), entry.getWeeklyXp(), currentStreak);
    }

    @Override
    @Transactional
    public LeaderboardResponseDto.StreakDto getUserStreak(Long userId) {
        if (userId == null) {
            userId = 1L;
        }

        final Long targetUserId = userId;
        UserRankProfile profile = userRankProfileRepository.findByUserId(targetUserId)
                .orElseGet(() -> {
                    UserRankProfile newProfile = UserRankProfile.builder()
                            .userId(targetUserId)
                            .currentRank(RankTier.BRONZE)
                            .highestRank(RankTier.BRONZE)
                            .totalXp(0L)
                            .top1Count(0)
                            .currentStreak(0)
                            .longestStreak(0)
                            .username("Người dùng #" + targetUserId)
                            .build();
                    newProfile.setCreateAt(LocalDateTime.now());
                    newProfile.setUpdateAt(LocalDateTime.now());
                    return userRankProfileRepository.save(newProfile);
                });

        LocalDate today = LocalDate.now();
        LocalDate lastDate = profile.getLastStudyDate();
        int currentStreak = (profile.getCurrentStreak() != null) ? profile.getCurrentStreak() : 0;
        int longestStreak = (profile.getLongestStreak() != null) ? profile.getLongestStreak() : 0;

        // Nếu ngày học cuối cùng trước hôm qua (bỏ lỡ >= 1 ngày) thì streak trở về 0
        if (lastDate != null && lastDate.isBefore(today.minusDays(1))) {
            currentStreak = 0;
            profile.setCurrentStreak(0);
            profile.setUpdateAt(LocalDateTime.now());
            userRankProfileRepository.save(profile);
        }

        // Lấy ngày đầu tuần (Thứ Hai 00:00:00) và cuối tuần (Chủ Nhật 23:59:59)
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        LocalDateTime startOfWeek = monday.atStartOfDay();
        LocalDateTime endOfWeek = sunday.atTime(LocalTime.MAX);

        List<UserProgress> progresses = userProgressRepository
                .findByUserIdAndStatusAndCompletedAtBetween(targetUserId, SessionStatus.FINISH, startOfWeek, endOfWeek);

        Set<LocalDate> studiedDates = progresses.stream()
                .filter(p -> p.getCompletedAt() != null)
                .map(p -> p.getCompletedAt().toLocalDate())
                .collect(Collectors.toSet());

        if (lastDate != null && lastDate.equals(today)) {
            studiedDates.add(today);
        }

        // Xây dựng mảng 7 ngày: [T2, T3, T4, T5, T6, T7, CN]
        List<Boolean> weeklyStatus = new ArrayList<>(7);
        for (int i = 0; i < 7; i++) {
            LocalDate checkDate = monday.plusDays(i);
            weeklyStatus.add(studiedDates.contains(checkDate));
        }

        // activeDayIndex: 0 = T2, 1 = T3, ..., 6 = CN
        int activeDayIndex = today.getDayOfWeek().getValue() - 1;

        boolean studiedToday = studiedDates.contains(today);
        String motivationText;
        if (studiedToday) {
            motivationText = "Tuyệt vời! Bạn đã hoàn thành mục tiêu học tập hôm nay và duy trì chuỗi " + currentStreak + " ngày!";
        } else {
            motivationText = "Luyện tập mỗi ngày để xây dựng thói quen! Hãy học 1 bài để duy trì chuỗi " + (currentStreak + 1) + " ngày!";
        }

        return LeaderboardResponseDto.StreakDto.builder()
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .weeklyStatus(weeklyStatus)
                .activeDayIndex(activeDayIndex)
                .motivationText(motivationText)
                .build();
    }

    @Override
    @Transactional
    public Tournament getOrCreateCurrentTournament() {
        LocalDateTime now = LocalDateTime.now();
        Optional<Tournament> activeOpt = tournamentRepository
                .findFirstByStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(now, now, TournamentStatus.ACTIVE);

        if (activeOpt.isPresent()) {
            return activeOpt.get();
        }

        // Tính ngày đầu tuần (Thứ Hai 00:00:00) và cuối tuần (Chủ Nhật 23:59:59.999)
        LocalDateTime monday = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).with(LocalTime.MIN);
        LocalDateTime sunday = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).with(LocalTime.MAX);
        int weekNum = now.get(ChronoField.ALIGNED_WEEK_OF_YEAR);
        String seasonCode = now.getYear() + "_W" + String.format("%02d", weekNum);

        Optional<Tournament> byCode = tournamentRepository.findBySeasonCode(seasonCode);
        if (byCode.isPresent()) {
            Tournament existing = byCode.get();
            if (existing.getStatus() != TournamentStatus.ACTIVE) {
                existing.setStatus(TournamentStatus.ACTIVE);
                tournamentRepository.save(existing);
            }
            return existing;
        }

        Tournament newTournament = Tournament.builder()
                .seasonCode(seasonCode)
                .startDate(monday)
                .endDate(sunday)
                .status(TournamentStatus.ACTIVE)
                .build();
        newTournament.setCreateAt(now);
        newTournament.setUpdateAt(now);

        Tournament saved = tournamentRepository.save(newTournament);
        log.info("Đã tạo mùa giải tuần mới: {} (từ {} đến {})", seasonCode, monday, sunday);
        return saved;
    }

    /**
     * Tác vụ tự động chốt giải đấu tuần vào 00:00 sáng Thứ Hai hàng tuần
     */
    @Override
    @Scheduled(cron = "0 0 0 * * MON")
    @Transactional
    public void processWeeklyTournamentReset() {
        log.info("Bắt đầu xử lý chốt giải đấu tuần và thăng hạng Top 12...");
        Optional<Tournament> currentTournamentOpt = tournamentRepository.findFirstByStatusOrderByStartDateDesc(TournamentStatus.ACTIVE);
        if (currentTournamentOpt.isEmpty()) {
            log.warn("Không tìm thấy giải đấu ACTIVE để chốt.");
            getOrCreateCurrentTournament();
            return;
        }

        Tournament oldTournament = currentTournamentOpt.get();

        // Xét duyệt từng rank tier
        for (RankTier tier : RankTier.values()) {
            List<LeaderboardEntry> entries = leaderboardEntryRepository
                    .findByTournamentIdAndRankTierOrderByWeeklyXpDescLastXpUpdatedAtAsc(oldTournament.getId(), tier);

            int promotionCount = Math.min(12, entries.size());
            for (int i = 0; i < promotionCount; i++) {
                LeaderboardEntry entry = entries.get(i);
                // Người có điểm > 0 mới được xét thăng hạng
                if (entry.getWeeklyXp() > 0) {
                    Optional<UserRankProfile> profileOpt = userRankProfileRepository.findByUserId(entry.getUserId());
                    if (profileOpt.isPresent()) {
                        UserRankProfile profile = profileOpt.get();
                        RankTier nextRank = profile.getCurrentRank().getNextTier();
                        profile.setCurrentRank(nextRank);

                        if (nextRank.getLevel() > profile.getHighestRank().getLevel()) {
                            profile.setHighestRank(nextRank);
                        }

                        if (i == 0) {
                            profile.setTop1Count((profile.getTop1Count() != null ? profile.getTop1Count() : 0) + 1);
                        }

                        profile.setUpdateAt(LocalDateTime.now());
                        userRankProfileRepository.save(profile);
                        log.info("User #{} được thăng hạng từ {} lên {}", entry.getUserId(), tier.getNameVi(), nextRank.getNameVi());
                    }
                }
            }
        }

        // Đóng giải đấu cũ
        oldTournament.setStatus(TournamentStatus.FINISHED);
        oldTournament.setUpdateAt(LocalDateTime.now());
        tournamentRepository.save(oldTournament);

        // Mở giải đấu mới
        Tournament newTournament = getOrCreateCurrentTournament();
        log.info("Đã chốt xong giải đấu tuần cũ {} và mở giải đấu tuần mới {}", oldTournament.getSeasonCode(), newTournament.getSeasonCode());
    }
}
