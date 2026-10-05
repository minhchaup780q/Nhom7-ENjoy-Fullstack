package com.example.learningservice.controllers;

import com.example.learningservice.dto.PlacementTestDto;
import com.example.learningservice.dto.PlacementTestResultResponse;
import com.example.learningservice.dto.PlacementTestSubmitRequest;
import com.example.learningservice.services.PlacementTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/placement-test")
@RequiredArgsConstructor
public class PlacementTestController {

    private final PlacementTestService placementTestService;

    /**
     * Tạo đề bài kiểm tra đầu vào.
     * GET /api/placement-test/generate
     */
    @GetMapping("/generate")
    public ResponseEntity<PlacementTestDto> generateTest() {
        return ResponseEntity.ok(placementTestService.generateTest());
    }

    /**
     * Nộp bài kiểm tra đầu vào.
     * POST /api/placement-test/submit?userId={userId}
     */
    @PostMapping("/submit")
    public ResponseEntity<PlacementTestResultResponse> submitTest(
            @RequestParam Long userId,
            @RequestBody PlacementTestSubmitRequest request) {
        return ResponseEntity.ok(placementTestService.submitTest(userId, request));
    }

    /**
     * Kiểm tra user đã làm bài kiểm tra đầu vào chưa.
     * GET /api/placement-test/status?userId={userId}
     * Response: { "hasCompleted": true/false }
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> checkStatus(@RequestParam Long userId) {
        boolean hasCompleted = placementTestService.hasCompletedPlacementTest(userId);
        return ResponseEntity.ok(Map.of("hasCompleted", hasCompleted));
    }
}
