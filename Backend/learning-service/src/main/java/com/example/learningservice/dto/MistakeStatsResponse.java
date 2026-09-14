package com.example.learningservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeStatsResponse {
    private long totalMistakes;
    private long needsReviewCount;
    private long reviewedCount;
    private long masteredCount;
    private long dueTodayCount; // Các câu cần ôn hôm nay (streak 0 hoặc đã đủ 24h)
    private long waiting1DayCount; // Đã đúng 1 lần, chờ ngày mai
    private long waiting2DaysCount; // Đã đúng 2 lần, chờ ngày kia
}
