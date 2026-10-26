package com.example.learningservice.repositories;

import com.example.learningservice.entities.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {
    // Dành cho Client học sinh (chỉ lấy nội dung đã phát hành)
    List<Part> findByTopicIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(Long topicId);
    Optional<Part> findByIdAndIsDeleteFalseAndIsPublishedTrue(Long id);

    // Dành cho Quản trị Admin (lấy toàn bộ kể cả bản nháp)
    List<Part> findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(Long topicId);
    Optional<Part> findByIdAndIsDeleteFalse(Long id);
    Integer countByTopicIdAndIsDeleteFalse(Long topicId);
}
