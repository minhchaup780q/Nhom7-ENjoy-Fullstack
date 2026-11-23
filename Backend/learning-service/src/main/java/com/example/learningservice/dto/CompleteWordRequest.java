package com.example.learningservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompleteWordRequest {
    private Long userId;
    private String word;
    private String topic;
}
