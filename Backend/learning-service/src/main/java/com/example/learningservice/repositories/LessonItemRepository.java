package com.example.learningservice.repositories;

import com.example.learningservice.entities.LessonItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonItemRepository extends JpaRepository<LessonItem, Integer> {
    List<LessonItem> findByLessonId(Integer lessonId);
}