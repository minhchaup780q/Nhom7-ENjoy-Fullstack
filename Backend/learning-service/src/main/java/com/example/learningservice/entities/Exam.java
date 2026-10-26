package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.ExamType;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exams")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Exam extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false)
    private ExamType examType;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String level;

    @Column(name = "listening_duration")
    private Integer listeningDuration;

    @Column(name = "reading_duration")
    private Integer readingDuration;

    @Column(name = "total_listening_questions")
    private Integer totalListeningQuestions;

    @Column(name = "total_reading_questions")
    private Integer totalReadingQuestions;

    @JsonRawValue
    @Column(name = "listening_payload", columnDefinition = "json")
    private String listeningPayload;

    @JsonRawValue
    @Column(name = "reading_payload", columnDefinition = "json")
    private String readingPayload;

    @JsonDeserialize(using = RawJsonDeserializer.class)
    public void setListeningPayload(String listeningPayload) {
        this.listeningPayload = listeningPayload;
    }

    @JsonDeserialize(using = RawJsonDeserializer.class)
    public void setReadingPayload(String readingPayload) {
        this.readingPayload = readingPayload;
    }
}
