package com.example.learningservice.repositories;

import com.example.learningservice.entities.ExamHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamHistoryRepository extends JpaRepository<ExamHistory, Long> {

    /**
     * Lấy tất cả lịch sử làm bài của một user, mới nhất lên đầu.
     */
    List<ExamHistory> findByUserIdOrderByCompletedAtDesc(Long userId);

    /**
     * Đếm tổng số lượt làm bài theo từng đề thi (gộp 1 query tránh N+1).
     * Trả về [examId, count].
     */
    @Query("SELECT eh.exam.id, COUNT(eh) FROM ExamHistory eh GROUP BY eh.exam.id")
    List<Object[]> countAttemptsGroupedByExam();
}
