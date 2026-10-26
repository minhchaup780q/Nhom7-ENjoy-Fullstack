package com.example.learningservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicWeakWordDetailDto {
    private Long id;
    private String word;
    private String translation;
    private String imageUrl;
    private String audioUrl;
    private String topic;
}
