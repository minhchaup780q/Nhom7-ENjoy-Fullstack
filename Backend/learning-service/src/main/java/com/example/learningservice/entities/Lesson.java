package com.example.learningservice.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "LESSONS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "topic_id")
    private Integer topicId;

    @Column(name = "badge_id")
    private Integer badgeId;

    @Column(nullable = false)
    private String title;

    private String description;
    private String status;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "createAt")
    private LocalDateTime createAt;

    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    private Integer createBy;
    private Integer updateBy;
    private Boolean isDelete;
}