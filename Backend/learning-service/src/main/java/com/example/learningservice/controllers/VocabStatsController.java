package com.example.learningservice.controllers;

import com.example.learningservice.dto.VocabStatsResponse;
import com.example.learningservice.services.VocabularyTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller thống kê từ vựng của user.
 */
@RestController
@RequestMapping("/api/vocab-stats")
@RequiredArgsConstructor
public class VocabStatsController {

    private final VocabularyTrackingService vocabularyTrackingService;

    /**
     * Lấy thống kê từ vựng của user theo từng topic.
     * GET /api/vocab-stats?userId={userId}
     */
    @GetMapping
    public ResponseEntity<VocabStatsResponse> getVocabStats(@RequestParam Long userId) {
        return ResponseEntity.ok(vocabularyTrackingService.getVocabStats(userId));
    }
}
