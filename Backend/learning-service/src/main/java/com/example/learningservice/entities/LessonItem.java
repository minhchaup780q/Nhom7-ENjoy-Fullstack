package com.example.learningservice.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "LESSON_ITEMS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LessonItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "lesson_id")
    private Integer lessonId;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @Column(columnDefinition = "TEXT")
    private String translation;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "item_type")
    private String itemType;

    @Column(name = "createAt")
    private LocalDateTime createAt;

    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    private Integer createBy;
    private Integer updateBy;
    private Boolean isDelete;
}