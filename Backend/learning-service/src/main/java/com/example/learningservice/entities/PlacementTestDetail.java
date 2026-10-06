package com.example.learningservice.entities;

import jakarta.persistence.*;
import lombok.*;

/**
 * Lưu chi tiết từng câu trả lời trong bài kiểm tra đầu vào.
 * round = 1 (từ vựng), 2 (ngữ pháp/re_order_sentence), 3 (speaking)
 */
@Entity
@Table(name = "placement_test_details")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlacementTestDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "history_id", nullable = false)
    private PlacementTestHistory history;

    /** Vòng thi: 1=Từ vựng, 2=Ngữ pháp (RE_ORDER_SENTENCE), 3=Speaking */
    @Column(name = "round", nullable = false)
    private Integer round;

    /** Topic mà câu hỏi này thuộc về */
    @Column(name = "topic_id")
    private Long topicId;

    /** Tên topic để hiển thị trong kết quả (snapshot, không phụ thuộc join) */
    @Column(name = "topic_title")
    private String topicTitle;

    /**
     * Vòng 1: ID của vocabulary.
     * Vòng 2 & 3: NULL.
     */
    @Column(name = "vocabulary_id")
    private Long vocabularyId;

    /**
     * Vòng 1: Từ tiếng Anh (word).
     * Vòng 2: Câu gốc (đáp án đúng).
     * Vòng 3: Câu speaking.
     */
    @Column(name = "correct_answer", columnDefinition = "TEXT")
    private String correctAnswer;

    /**
     * Vòng 1: Nghĩa tiếng Việt (translation).
     * Vòng 2: Thứ tự user sắp xếp.
     * Vòng 3: Câu user đã nói (recognized text từ speech service).
     */
    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String userAnswer;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    /**
     * Chỉ dùng cho vòng 2: Tên grammar topic (ví dụ: "Grammar: Greetings, Names & Age")
     * Lấy từ title của session có order_index = 6 (GRAMMAR session).
     */
    @Column(name = "grammar_name")
    private String grammarName;

    /** Chỉ dùng cho vòng 3: Điểm số từ speech assessment service (0-100) */
    @Column(name = "speaking_score")
    private Float speakingScore;
}
