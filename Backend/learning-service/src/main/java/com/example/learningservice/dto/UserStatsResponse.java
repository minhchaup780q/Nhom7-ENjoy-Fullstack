package com.example.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private Long totalCompletedLessons;
    private Integer weeklyStudyMinutes;
    private List<DailyStudyTimeDto> dailyStudyTime;
    private List<RecentSessionDto> recentSessions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyStudyTimeDto {
        private String day; // "Thứ 2", "Thứ 3", ... "CN"
        private String date; // "2026-08-31"
        private Integer minutes;
        private Integer targetMinutes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentSessionDto {
        private Long id;
        private String title;
        private String topic;
        private String completedAt;
        private Integer durationMinutes;
        private Integer score;
    }
}
