package com.example.learningservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeCreateRequest {
    private Long userId;
    private Long questionId;
    private Integer roundType;
    private String wrongAnswerSubmitted;
    private Integer durationSeconds;
}
