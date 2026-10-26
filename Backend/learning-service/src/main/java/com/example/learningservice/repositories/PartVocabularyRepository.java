package com.example.learningservice.repositories;

import com.example.learningservice.entities.PartVocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartVocabularyRepository extends JpaRepository<PartVocabulary, Long> {
    List<PartVocabulary> findByPartIdOrderByOrderIndexAsc(Long partId);
    
    @Query("SELECT pv FROM PartVocabulary pv JOIN FETCH pv.part p JOIN FETCH p.topic t WHERE pv.vocabulary.id = :vocabularyId")
    List<PartVocabulary> findByVocabularyIdWithTopic(@Param("vocabularyId") Long vocabularyId);

    @Query("SELECT pv FROM PartVocabulary pv JOIN FETCH pv.part p JOIN FETCH p.topic t WHERE pv.vocabulary.id IN :vocabularyIds")
    List<PartVocabulary> findByVocabularyIdsWithTopic(@Param("vocabularyIds") List<Long> vocabularyIds);
}

