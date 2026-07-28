package com.example.learningservice.controllers;

import com.example.learningservice.entities.Lesson;
import com.example.learningservice.services.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    // API lấy danh sách bài học theo Topic (hoặc có thể đưa qua TopicController tùy thiết kế RESTful)
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<Lesson>> getLessonsByTopic(@PathVariable Integer topicId) {
        return ResponseEntity.ok(lessonService.getLessonsByTopic(topicId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Integer id) {
        return ResponseEntity.ok(lessonService.getLessonById(id));
    }
}