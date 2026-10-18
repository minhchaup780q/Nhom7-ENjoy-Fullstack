package com.example.learningservice.services;

import com.example.learningservice.dto.LeaderboardResponseDto;
import com.example.learningservice.entities.Tournament;
import com.example.learningservice.entities.enums.XpSourceType;

public interface LeaderboardService {

    LeaderboardResponseDto getCurrentLeaderboard(Long userId, String username, String avatarUrl);

    void addXp(Long userId, int xpAmount, XpSourceType sourceType, Long sourceId, String description, String username, String avatarUrl);

    LeaderboardResponseDto.StreakDto getUserStreak(Long userId);

    Tournament getOrCreateCurrentTournament();

    void processWeeklyTournamentReset();
}
