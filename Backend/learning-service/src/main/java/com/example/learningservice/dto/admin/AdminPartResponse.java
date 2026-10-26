package com.example.learningservice.dto.admin;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPartResponse {
    private Long id;
    private Long topicId;
    private String title;
    private Integer orderIndex;

    private Boolean isPublished;
    private LocalDateTime publishedAt;
    private Long publishedBy;

    private Integer sessionCount;

    /**
     * DRAFT | PUBLISHED
     */
    private String badge;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
