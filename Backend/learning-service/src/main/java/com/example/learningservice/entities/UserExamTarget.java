package com.example.learningservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_exam_targets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserExamTarget extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "listening_shields", nullable = false)
    private Integer listeningShields;

    @Column(name = "reading_shields", nullable = false)
    private Integer readingShields;

    @Column(name = "listening_min_score", nullable = false)
    private Integer listeningMinScore;

    @Column(name = "reading_min_score", nullable = false)
    private Integer readingMinScore;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
