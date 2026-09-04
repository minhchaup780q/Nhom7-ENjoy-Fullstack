package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.MistakeStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mistakes", indexes = {
    @Index(name = "idx_mistake_user", columnList = "user_id"),
    @Index(name = "idx_mistake_user_status", columnList = "user_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mistake extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnoreProperties({"sessionMappings", "hibernateLazyInitializer", "handler"})
    private SessionItem question;

    @Column(name = "round_type", nullable = false)
    private Integer roundType; // Vòng 1 đến 5 (Nhận diện, Nghe, Đọc, Phát âm, Viết)

    @Column(name = "wrong_answer_submitted", columnDefinition = "TEXT", nullable = false)
    private String wrongAnswerSubmitted; // Đáp án user đã chọn sai

    @Column(name = "duration_seconds")
    private Integer durationSeconds; // Số giây user mất để đưa ra câu trả lời sai

    @Column(name = "ai_explanation_cache", columnDefinition = "LONGTEXT")
    private String aiExplanationCache; // Cache giải thích từ AI (Ollama), ban đầu null

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private MistakeStatus status = MistakeStatus.NEEDS_REVIEW;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = MistakeStatus.NEEDS_REVIEW;
        }
        if (getCreateAt() == null) {
            setCreateAt(LocalDateTime.now());
        }
        if (getIsDelete() == null) {
            setIsDelete(false);
        }
    }
}
