package com.example.learningservice.repositories;

import com.example.learningservice.entities.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {
    List<Part> findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(Long topicId);
    Optional<Part> findByIdAndIsDeleteFalse(Long id);
}
