package com.example.learningservice.repositories;

import com.example.learningservice.entities.Mistake;
import com.example.learningservice.entities.enums.MistakeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MistakeRepository extends JpaRepository<Mistake, Long> {

    List<Mistake> findByUserId(Long userId);

    List<Mistake> findByUserIdAndStatus(Long userId, MistakeStatus status);

    Page<Mistake> findByUserId(Long userId, Pageable pageable);

    Page<Mistake> findByUserIdAndStatus(Long userId, MistakeStatus status, Pageable pageable);

    Page<Mistake> findByUserIdAndStatusAndRoundType(Long userId, MistakeStatus status, Integer roundType, Pageable pageable);

    Page<Mistake> findByUserIdAndRoundType(Long userId, Integer roundType, Pageable pageable);

    Optional<Mistake> findByUserIdAndQuestionIdAndRoundType(Long userId, Long questionId, Integer roundType);

    long countByUserIdAndStatus(Long userId, MistakeStatus status);
}

