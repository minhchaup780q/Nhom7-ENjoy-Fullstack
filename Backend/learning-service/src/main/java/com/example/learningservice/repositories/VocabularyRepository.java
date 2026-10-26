package com.example.learningservice.repositories;

import com.example.learningservice.entities.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {

    Optional<Vocabulary> findByWordIgnoreCase(String word);

    List<Vocabulary> findByWordInIgnoreCase(Collection<String> words);
}
