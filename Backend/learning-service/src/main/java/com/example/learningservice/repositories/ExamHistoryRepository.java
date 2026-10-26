package com.example.learningservice.repositories;

import com.example.learningservice.entities.ExamHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamHistoryRepository extends JpaRepository<ExamHistory, Long> {

    /**
     * Lấy tất cả lịch sử làm bài của một user, mới nhất lên đầu.
     */
    List<ExamHistory> findByUserIdOrderByCompletedAtDesc(Long userId);
}
