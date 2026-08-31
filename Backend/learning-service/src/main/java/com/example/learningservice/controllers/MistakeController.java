package com.example.learningservice.controllers;

import com.example.learningservice.dto.*;
import com.example.learningservice.entities.enums.MistakeStatus;
import com.example.learningservice.services.MistakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mistakes")
@RequiredArgsConstructor
public class MistakeController {

    private final MistakeService mistakeService;

    @PostMapping
    public ResponseEntity<MistakeResponse> logMistake(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody MistakeCreateRequest request) {
        return ResponseEntity.ok(mistakeService.recordMistake(userId, request));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<MistakeResponse>> logBatchMistakes(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody List<MistakeCreateRequest> requests) {
        return ResponseEntity.ok(mistakeService.recordBatchMistakes(userId, requests));
    }

    @GetMapping
    public ResponseEntity<PageResponse<MistakeResponse>> getUserMistakes(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "status", required = false, defaultValue = "NEEDS_REVIEW") MistakeStatus status,
            @RequestParam(value = "roundType", required = false) Integer roundType,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "6") int size) {
        Long userId = (headerUserId != null) ? headerUserId : queryUserId;
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(mistakeService.getUserMistakesPaged(userId, status, roundType, page, size));
    }

    @GetMapping("/practice-queue")
    public ResponseEntity<List<MistakeResponse>> getPracticeQueue(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "roundType", required = false) Integer roundType,
            @RequestParam(value = "limit", required = false, defaultValue = "20") int limit) {
        Long userId = (headerUserId != null) ? headerUserId : queryUserId;
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(mistakeService.getPracticeQueue(userId, roundType, limit));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MistakeResponse> updateStatus(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id,
            @RequestBody MistakeStatusUpdateRequest request) {
        return ResponseEntity.ok(mistakeService.updateMistakeStatus(userId, id, request.getStatus()));
    }

    @PutMapping("/{id}/ai-explanation")
    public ResponseEntity<MistakeResponse> updateAiExplanation(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String explanation = body.get("explanation");
        return ResponseEntity.ok(mistakeService.updateAiExplanation(id, explanation));
    }

    @GetMapping("/stats")
    public ResponseEntity<MistakeStatsResponse> getStats(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long queryUserId) {
        Long userId = (headerUserId != null) ? headerUserId : queryUserId;
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(mistakeService.getUserMistakeStats(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMistake(@PathVariable Long id) {
        mistakeService.deleteMistake(id);
        return ResponseEntity.noContent().build();
    }
}
