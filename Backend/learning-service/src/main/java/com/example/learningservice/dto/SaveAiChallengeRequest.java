package com.example.learningservice.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaveAiChallengeRequest {
    private Long userId;
    private String word;
    private String topic;
    private String grammarName;
    private String sentence;
    private List<String> options;
    private String correctAnswer;
    private String translation;
    private String hint;
}
