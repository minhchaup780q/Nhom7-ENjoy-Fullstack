package com.example.learningservice.repositories;

import com.example.learningservice.entities.VocabPracticeAiChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VocabPracticeAiChallengeRepository extends JpaRepository<VocabPracticeAiChallenge, Long> {

    Optional<VocabPracticeAiChallenge> findFirstByUserIdAndWordOrderByUpdatedAtDesc(Long userId, String word);

    Optional<VocabPracticeAiChallenge> findByUserIdAndWord(Long userId, String word);
}
