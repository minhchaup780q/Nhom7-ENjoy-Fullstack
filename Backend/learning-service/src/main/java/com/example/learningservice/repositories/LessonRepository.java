package com.example.learningservice.repositories;

import com.example.learningservice.entities.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    List<Lesson> findByTopicId(Integer topicId);
}