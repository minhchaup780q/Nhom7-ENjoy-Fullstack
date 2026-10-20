package com.example.learningservice.dto.admin;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminTopicResponse {
    private Long id;
    private Long levelId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private Integer orderIndex;

    private Boolean isPublished;
    private LocalDateTime publishedAt;
    private Long publishedBy;

    private Integer partCount;
    private Integer sessionCount;

    /**
     * DRAFT | PUBLISHED
     */
    private String badge;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
