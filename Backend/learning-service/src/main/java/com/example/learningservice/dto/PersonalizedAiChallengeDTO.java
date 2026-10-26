package com.example.learningservice.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalizedAiChallengeDTO {
    private Long id;
    private Long userId;
    private String skillKey;
    private String topicId;
    private String topicName;
    private String title;
    private String story;
    private String storyVi;
    private String question;
    private List<String> options;
    private String correctAnswer;
    private String hint;
}
