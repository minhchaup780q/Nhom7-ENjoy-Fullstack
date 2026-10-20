package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.SessionType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class Session extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    @JsonIgnoreProperties({"sessions", "hibernateLazyInitializer", "handler"})
    private Part part;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_type")
    private SessionType sessionType;

    @Column(name = "badge_id")
    private Long badgeId; // Service Gamification quản lý

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Setter
    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;

    @Setter
    @Column(name = "has_draft")
    @Builder.Default
    private Boolean hasDraft = false;

    @Setter
    @Column(name = "version")
    @Builder.Default
    private Integer version = 1;

    @Setter
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Setter
    @Column(name = "published_by")
    private Long publishedBy;

    // Manual setters for non-payload fields (since @Setter removed at class level)
    public void setId(Long id) { this.id = id; }
    public void setPart(Part part) { this.part = part; }
    public void setSessionType(SessionType sessionType) { this.sessionType = sessionType; }
    public void setBadgeId(Long badgeId) { this.badgeId = badgeId; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    /**
     * class này để parse object từ FE gửi xuống thành một string để lưu vào payload của session
     * payload lưu dưới dạng String (JSON column).
     * @JsonRawValue: Jackson sẽ output nội dung String này trực tiếp vào JSON response
     *               mà không wrap thêm dấu nháy - tức là trả về object JSON thay vì string.
     */
    @JsonRawValue
    @Column(columnDefinition = "json", name = "payload")
    private String payload;

    /**
     * Deserializer: khi nhận payload từ request body (dạng JSON object),
     * convert về String để lưu vào DB.
     */
    @JsonDeserialize(using = RawJsonDeserializer.class)
    public void setPayload(String payload) {
        this.payload = payload;
    }

    /**
     * draftPayload: Lưu trữ bản nháp nội dung khi admin sửa đổi bài học đang live
     */
    @JsonRawValue
    @Column(columnDefinition = "json", name = "draft_payload")
    private String draftPayload;

    @JsonDeserialize(using = RawJsonDeserializer.class)
    public void setDraftPayload(String draftPayload) {
        this.draftPayload = draftPayload;
    }
}
