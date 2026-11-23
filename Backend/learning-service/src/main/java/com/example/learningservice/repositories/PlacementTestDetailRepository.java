package com.example.learningservice.repositories;

import com.example.learningservice.entities.PlacementTestDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementTestDetailRepository extends JpaRepository<PlacementTestDetail, Long> {
    List<PlacementTestDetail> findByHistoryId(Long historyId);
    List<PlacementTestDetail> findByHistoryIdAndRound(Long historyId, Integer round);
}
