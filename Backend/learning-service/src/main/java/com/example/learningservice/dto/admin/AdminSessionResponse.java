package com.example.learningservice.dto.admin;

import com.example.learningservice.entities.enums.SessionType;
import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSessionResponse {
    private Long id;
    private Long partId;
    private String title;
    private String description;
    private Integer orderIndex;
    private SessionType sessionType;
    private Long badgeId;

    private Boolean isPublished;
    private Boolean hasDraft;
    private Integer version;
    private LocalDateTime publishedAt;
    private Long publishedBy;

    /**
     * DRAFT | PUBLISHED | HAS_DRAFT
     */
    private String badge;

    @JsonRawValue
    private String payload;

    @JsonRawValue
    private String draftPayload;

    private Long studentProgressCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
