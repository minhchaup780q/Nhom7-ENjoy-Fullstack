package com.example.learningservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Lưu thông tin tổng quan của một lần làm bài kiểm tra đầu vào.
 * Dùng để truy vấn lịch sử sau này và so sánh tiến độ theo thời gian.
 */
@Entity
@Table(name = "placement_test_histories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlacementTestHistory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Tổng số câu trong bài test */
    @Column(name = "total_questions")
    private Integer totalQuestions;

    /** Số câu trả lời đúng vòng từ vựng */
    @Column(name = "vocab_correct")
    private Integer vocabCorrect;

    /** Tổng số câu vòng từ vựng */
    @Column(name = "vocab_total")
    private Integer vocabTotal;

    /** Số câu trả lời đúng vòng ngữ pháp (re_order sentence) */
    @Column(name = "grammar_correct")
    private Integer grammarCorrect;

    /** Tổng số câu vòng ngữ pháp */
    @Column(name = "grammar_total")
    private Integer grammarTotal;

    /** Số câu speaking đúng (score >= ngưỡng) */
    @Column(name = "speaking_correct")
    private Integer speakingCorrect;

    /** Tổng số câu vòng speaking */
    @Column(name = "speaking_total")
    private Integer speakingTotal;

    /** Thời điểm hoàn thành bài test */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
