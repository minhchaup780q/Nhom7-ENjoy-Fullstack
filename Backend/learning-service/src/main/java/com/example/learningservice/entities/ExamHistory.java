package com.example.learningservice.entities;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam_histories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExamHistory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(name = "total_correct")
    private Integer totalCorrect;

    @Column(name = "total_questions")
    private Integer totalQuestions;

    @Column(name = "listening_shields")
    private Integer listeningShields;

    @Column(name = "reading_shields")
    private Integer readingShields;

    @JsonRawValue
    @Column(name = "part_scores_payload", columnDefinition = "json")
    private String partScoresPayload;

    @JsonRawValue
    @Column(name = "answers_payload", columnDefinition = "json")
    private String answersPayload;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @JsonDeserialize(using = RawJsonDeserializer.class)
    public void setPartScoresPayload(String partScoresPayload) {
        this.partScoresPayload = partScoresPayload;
    }

    @JsonDeserialize(using = RawJsonDeserializer.class)
    public void setAnswersPayload(String answersPayload) {
        this.answersPayload = answersPayload;
    }
}
