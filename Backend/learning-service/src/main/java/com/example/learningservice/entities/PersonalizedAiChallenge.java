package com.example.learningservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "personalized_ai_challenges", indexes = {
    @Index(name = "idx_ai_challenge_user_skill_topic", columnList = "user_id, skill_key, topic_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalizedAiChallenge extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "skill_key", nullable = false, length = 64)
    private String skillKey;

    @Column(name = "topic_id", nullable = false, length = 64)
    private String topicId;

    @Column(name = "topic_name", length = 255)
    private String topicName;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "story", columnDefinition = "TEXT")
    private String story;

    @Column(name = "story_vi", columnDefinition = "TEXT")
    private String storyVi;

    @Column(name = "question", columnDefinition = "TEXT")
    private String question;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson;

    @Column(name = "correct_answer", length = 255)
    private String correctAnswer;

    @Column(name = "hint", columnDefinition = "TEXT")
    private String hint;

    @PrePersist
    public void prePersist() {
        if (getCreateAt() == null) {
            setCreateAt(LocalDateTime.now());
        }
        if (getUpdateAt() == null) {
            setUpdateAt(LocalDateTime.now());
        }
        if (getIsDelete() == null) {
            setIsDelete(false);
        }
    }

    @PreUpdate
    public void preUpdate() {
        setUpdateAt(LocalDateTime.now());
    }
}
