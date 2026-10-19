package com.example.learningservice.dto;

import com.example.learningservice.entities.enums.RankTier;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardResponseDto {
    private TournamentDto tournament;
    private RankInfoDto currentRank;
    @Builder.Default
    private int promotionThreshold = 12;
    private List<LeaderboardUserDto> topUsers;
    private LeaderboardUserDto currentUserEntry;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TournamentDto {
        private Long id;
        private String seasonCode;
        private long daysRemaining;
        private String endDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankInfoDto {
        private RankTier tier;
        private String nameVi;
        private int level;
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaderboardUserDto {
        private int rank;
        private Long userId;
        private String username;
        private String avatarUrl;
        private int weeklyXp;
        private boolean isCurrentUser;
        private boolean isPromoting;
    }
}
