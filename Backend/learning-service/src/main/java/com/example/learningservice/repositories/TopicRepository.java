package com.example.learningservice.repositories;

import com.example.learningservice.entities.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    // Dành cho Client học sinh (chỉ lấy nội dung đã phát hành)
    List<Topic> findByLevelIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(Long levelId);
    Optional<Topic> findByIdAndIsDeleteFalseAndIsPublishedTrue(Long id);

    // Dành cho Quản trị Admin (lấy toàn bộ kể cả bản nháp)
    List<Topic> findByLevelIdAndIsDeleteFalseOrderByOrderIndexAsc(Long levelId);
    List<Topic> findByIsDeleteFalseOrderByOrderIndexAsc();
    Optional<Topic> findByIdAndIsDeleteFalse(Long id);
    Integer countByLevelIdAndIsDeleteFalse(Long levelId);
}
