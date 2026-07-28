package com.example.learningservice.services;

import com.example.learningservice.entities.LessonItem;
import com.example.learningservice.repositories.LessonItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonItemService {

    private final LessonItemRepository lessonItemRepository;

    public List<LessonItem> getItemsByLesson(Integer lessonId) {
        return lessonItemRepository.findByLessonId(lessonId);
    }
}