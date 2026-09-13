package com.example.learningservice.repositories;



import com.example.learningservice.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    // Lấy tất cả session của 1 part cụ thể (chưa xóa)
    List<Session> findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(Long partId);

    Optional<Session> findByIdAndIsDeleteFalse(Long id);
}