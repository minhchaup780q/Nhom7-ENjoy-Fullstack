package com.example.learningservice.services;

import com.example.learningservice.dto.LeaderboardResponseDto;
import com.example.learningservice.entities.Tournament;
import com.example.learningservice.entities.enums.XpSourceType;

import com.example.learningservice.dto.AddXpEvent;
import com.example.learningservice.dto.AddXpRequestDto;

public interface LeaderboardService {

    LeaderboardResponseDto getCurrentLeaderboard(Long userId, String username, String avatarUrl);

    void addXp(Long userId, int xpAmount, XpSourceType sourceType, Long sourceId, String description, String username, String avatarUrl);

    void enqueueAddXp(AddXpRequestDto request);

    void saveXpToDatabase(AddXpEvent event);

    LeaderboardResponseDto.StreakDto getUserStreak(Long userId);

    Tournament getOrCreateCurrentTournament();

    void processWeeklyTournamentReset();
}
