package com.example.learningservice.repositories;

import com.example.learningservice.entities.PersonalizedAiChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalizedAiChallengeRepository extends JpaRepository<PersonalizedAiChallenge, Long> {
    Optional<PersonalizedAiChallenge> findByUserIdAndSkillKeyAndTopicId(Long userId, String skillKey, String topicId);
}
