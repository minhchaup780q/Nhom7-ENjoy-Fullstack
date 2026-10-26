package com.example.learningservice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserExamTargetDto {
    private Long id;
    private Long userId;
    private Integer listeningShields;
    private Integer readingShields;
    private Integer listeningMinScore;
    private Integer readingMinScore;
    private LocalDateTime updatedAt;
}
