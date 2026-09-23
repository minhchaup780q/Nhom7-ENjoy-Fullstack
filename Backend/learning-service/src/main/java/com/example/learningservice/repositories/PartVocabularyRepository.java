package com.example.learningservice.repositories;

import com.example.learningservice.entities.PartVocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartVocabularyRepository extends JpaRepository<PartVocabulary, Long> {
    List<PartVocabulary> findByPartIdOrderByOrderIndexAsc(Long partId);
}
