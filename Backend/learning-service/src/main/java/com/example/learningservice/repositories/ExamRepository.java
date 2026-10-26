package com.example.learningservice.repositories;

import com.example.learningservice.entities.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    /**
     * Lấy danh sách đề thi chưa bị xóa, sắp xếp mới nhất lên đầu.
     */
    @Query("SELECT e FROM Exam e WHERE e.isDelete = false ORDER BY e.createAt DESC")
    List<Exam> findAllActive();
}
