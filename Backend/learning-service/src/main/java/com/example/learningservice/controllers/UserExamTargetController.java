package com.example.learningservice.controllers;

import com.example.learningservice.dto.UserExamTargetDto;
import com.example.learningservice.services.UserExamTargetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/exams/target", "/api/user-exam-targets", "/api/placement-test/target"})
@RequiredArgsConstructor
public class UserExamTargetController {

    private final UserExamTargetService userExamTargetService;

    /**
     * Lấy mục tiêu khiên của user.
     * GET /api/exams/target?userId={userId}
     */
    @GetMapping
    public ResponseEntity<UserExamTargetDto> getUserTarget(@RequestParam Long userId) {
        return ResponseEntity.ok(userExamTargetService.getUserTarget(userId));
    }

    /**
     * Lưu mục tiêu khiên của user.
     * POST /api/exams/target?userId={userId}
     */
    @PostMapping
    public ResponseEntity<UserExamTargetDto> saveUserTarget(
            @RequestParam Long userId,
            @RequestBody Map<String, Integer> payload) {
        Integer listeningShields = payload.get("listeningShields");
        Integer readingShields = payload.get("readingShields");
        return ResponseEntity.ok(userExamTargetService.saveUserTarget(userId, listeningShields, readingShields));
    }
}
