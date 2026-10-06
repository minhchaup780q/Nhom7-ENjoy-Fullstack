package com.example.learningservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "vocab_practice_ai_challenges",
    indexes = {
        @Index(name = "idx_vocab_ai_user_word", columnList = "user_id, word")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VocabPracticeAiChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "word", nullable = false, length = 100)
    private String word;

    @Column(name = "topic", nullable = false, length = 100)
    private String topic;

    @Column(name = "grammar_name", length = 255)
    private String grammarName;

    @Column(name = "sentence", columnDefinition = "TEXT")
    private String sentence;

    @Column(name = "blanks_json", columnDefinition = "TEXT")
    private String blanksJson;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson;

    @Column(name = "correct_answer", length = 255)
    private String correctAnswer;

    @Column(name = "translation", columnDefinition = "TEXT")
    private String translation;

    @Column(name = "hint", columnDefinition = "TEXT")
    private String hint;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
