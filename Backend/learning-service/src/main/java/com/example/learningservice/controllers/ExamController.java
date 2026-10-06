package com.example.learningservice.controllers;

import com.example.learningservice.dto.ExamDetailResponse;
import com.example.learningservice.dto.ExamResultResponse;
import com.example.learningservice.dto.ExamSubmitRequest;
import com.example.learningservice.dto.ExamSummaryResponse;
import com.example.learningservice.services.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    /**
     * Lấy danh sách tất cả đề thi (không bao gồm payload câu hỏi).
     * GET /api/exams
     */
    @GetMapping
    public ResponseEntity<List<ExamSummaryResponse>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    /**
     * Lấy chi tiết một đề thi theo ID, bao gồm toàn bộ câu hỏi.
     * GET /api/exams/{examId}
     */
    @GetMapping("/{examId}")
    public ResponseEntity<ExamDetailResponse> getExamById(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getExamById(examId));
    }

    /**
     * Nộp bài thi, tính điểm và lưu lịch sử.
     * POST /api/exams/{examId}/submit?userId={userId}
     */
    @PostMapping("/{examId}/submit")
    public ResponseEntity<ExamResultResponse> submitExam(
            @PathVariable Long examId,
            @RequestParam Long userId,
            @RequestBody ExamSubmitRequest request) {
        return ResponseEntity.ok(examService.submitExam(userId, examId, request));
    }
}
