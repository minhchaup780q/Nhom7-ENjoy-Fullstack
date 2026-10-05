package com.example.learningservice.repositories;

import com.example.learningservice.entities.PlacementTestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementTestHistoryRepository extends JpaRepository<PlacementTestHistory, Long> {
    List<PlacementTestHistory> findByUserIdOrderByCreateAtDesc(Long userId);
    Optional<PlacementTestHistory> findTopByUserIdOrderByCreateAtDesc(Long userId);
    boolean existsByUserId(Long userId);
}

