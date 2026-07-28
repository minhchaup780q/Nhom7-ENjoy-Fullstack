package com.example.learningservice.controllers;

import com.example.learningservice.entities.LessonItem;
import com.example.learningservice.services.LessonItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lesson-items")
@RequiredArgsConstructor
public class LessonItemController {

    private final LessonItemService lessonItemService;

    // API lấy tất cả các item (từ vựng/câu hỏi) thuộc về một lesson cụ thể
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<LessonItem>> getItemsByLesson(@PathVariable Integer lessonId) {
        return ResponseEntity.ok(lessonItemService.getItemsByLesson(lessonId));
    }
}