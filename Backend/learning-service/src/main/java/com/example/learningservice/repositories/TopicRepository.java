package com.example.learningservice.repositories;

import com.example.learningservice.entities.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByLevelIdAndIsDeleteFalseOrderByOrderIndexAsc(Long levelId);
    List<Topic> findByIsDeleteFalseOrderByOrderIndexAsc();
    Optional<Topic> findByIdAndIsDeleteFalse(Long id);
}
