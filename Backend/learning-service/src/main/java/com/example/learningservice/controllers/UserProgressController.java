package com.example.learningservice.controllers;

import com.example.learningservice.entities.UserProgress;
import com.example.learningservice.services.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService userProgressService;

    @GetMapping("/my-progress")
    public ResponseEntity<List<UserProgress>> getMyProgress(@RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userProgressService.getUserProgress(userId));
    }

    @PostMapping("/complete/{sessionId}")
    public ResponseEntity<UserProgress> completeSession(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long sessionId) {
        
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userProgressService.completeSession(userId, sessionId));
    }
}
