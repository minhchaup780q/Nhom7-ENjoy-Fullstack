package com.example.learningservice.repositories;


import com.example.learningservice.entities.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LevelRepository extends JpaRepository<Level, Long> {
    // Chỉ lấy các Level chưa bị xóa, sắp xếp theo orderIndex
    List<Level> findByIsDeleteFalseOrderByOrderIndexAsc();

    // Tìm chi tiết 1 Level chưa bị xóa
    Optional<Level> findByIdAndIsDeleteFalse(Long id);
}