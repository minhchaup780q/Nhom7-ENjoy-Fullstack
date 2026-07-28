package com.example.learningservice.services;

import com.example.learningservice.entities.Lesson;
import com.example.learningservice.repositories.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;

    public List<Lesson> getLessonsByTopic(Integer topicId) {
        return lessonRepository.findByTopicId(topicId);
    }

    public Lesson getLessonById(Integer id) {
        return lessonRepository.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found"));
    }
}