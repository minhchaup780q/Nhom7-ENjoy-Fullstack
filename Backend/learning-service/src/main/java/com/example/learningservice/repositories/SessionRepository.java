package com.example.learningservice.repositories;

import com.example.learningservice.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    // Dành cho Client học sinh (chỉ lấy bài học đã phát hành)
    List<Session> findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(Long partId);
    List<Session> findByPartIdInAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(List<Long> partIds);
    Optional<Session> findByIdAndIsDeleteFalseAndIsPublishedTrue(Long id);

    // Dành cho Quản trị Admin (lấy toàn bộ kể cả bản nháp)
    List<Session> findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(Long partId);
    List<Session> findByPartIdInAndIsDeleteFalse(List<Long> partIds);
    Optional<Session> findByIdAndIsDeleteFalse(Long id);
    Integer countByPartIdAndIsDeleteFalse(Long partId);
}