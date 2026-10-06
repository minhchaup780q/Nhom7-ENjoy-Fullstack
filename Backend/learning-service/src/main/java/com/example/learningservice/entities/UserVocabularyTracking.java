package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.VocabTrackingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Bảng lưu vết các từ vựng user đã làm sai, theo dõi tiến trình cải thiện.
 * Quy tắc:
 *  - Chỉ lưu khi từ đó THUỘC 1 topic trong MockVocabularyRepository.
 *  - Làm sai lần đầu: INSERT với status=WEAK.
 *  - Làm sai lại: UPDATE update_at, giữ nguyên WEAK.
 *  - Làm đúng 1 từ đã có trong bảng: UPDATE status=CORRECT.
 *  - Làm sai lại sau khi đã CORRECT: UPDATE status=WEAK.
 *  - Từ làm đúng ngay từ đầu: KHÔNG lưu.
 */
@Entity
@Table(
    name = "user_vocabulary_tracking",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "word"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserVocabularyTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Từ vựng (lowercase, trimmed) */
    @Column(name = "word", nullable = false, length = 100)
    private String word;

    /** Topic của từ vựng (lấy từ MockVocabularyRepository) */
    @Column(name = "topic", nullable = false, length = 100)
    private String topic;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private VocabTrackingStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
