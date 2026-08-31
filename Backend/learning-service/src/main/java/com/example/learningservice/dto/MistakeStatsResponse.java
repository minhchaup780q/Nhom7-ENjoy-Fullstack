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
}
