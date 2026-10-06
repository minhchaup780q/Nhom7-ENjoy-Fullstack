package com.example.learningservice.repositories;

import com.example.learningservice.entities.UserVocabularyTracking;
import com.example.learningservice.entities.enums.VocabTrackingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserVocabularyTrackingRepository extends JpaRepository<UserVocabularyTracking, Long> {

    /** Tìm bản ghi tracking của 1 user + 1 từ cụ thể */
    Optional<UserVocabularyTracking> findByUserIdAndWord(Long userId, String word);

    /** Lấy tất cả tracking của 1 user (dùng cho trang thống kê) */
    List<UserVocabularyTracking> findByUserId(Long userId);

    /** Lấy tracking theo userId + status (WEAK hoặc CORRECT) */
    List<UserVocabularyTracking> findByUserIdAndStatus(Long userId, VocabTrackingStatus status);

    /**
     * Lấy thống kê số từ WEAK và CORRECT theo từng topic của 1 user.
     * Trả về: [topic, weakCount, correctCount]
     */
    @Query("""
        SELECT t.topic, 
               SUM(CASE WHEN t.status = 'WEAK' THEN 1 ELSE 0 END),
               SUM(CASE WHEN t.status = 'CORRECT' THEN 1 ELSE 0 END)
        FROM UserVocabularyTracking t
        WHERE t.userId = :userId
        GROUP BY t.topic
        ORDER BY SUM(CASE WHEN t.status = 'WEAK' THEN 1 ELSE 0 END) DESC
    """)
    List<Object[]> findTopicStatsByUserId(@Param("userId") Long userId);

    /** Kiểm tra user đã từng làm bài thi nào chưa (có bản ghi trong bảng tracking không) */
    boolean existsByUserId(Long userId);
}
