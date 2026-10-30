package com.example.learningservice.controllers;

import com.example.learningservice.dto.admin.AdminExamDetailResponse;
import com.example.learningservice.dto.admin.AdminExamRequest;
import com.example.learningservice.dto.admin.AdminExamResponse;
import com.example.learningservice.dto.admin.PublishValidationResult;
import com.example.learningservice.services.AdminExamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Nghiệp vụ soạn thảo đề thi nằm tại learning-service (đúng domain).
 * admin-service gọi sang đây qua OpenFeign, không gọi thẳng từ FE.
 */
@Slf4j
@RestController
@RequestMapping("/api/exams/internal")
@RequiredArgsConstructor
public class ExamInternalController {

    private final AdminExamService adminExamService;

    @GetMapping
    public ResponseEntity<List<AdminExamResponse>> getAllExams() {
        return ResponseEntity.ok(adminExamService.getAllExamsForAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminExamDetailResponse> getExamDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminExamService.getExamDetail(id));
    }

    @PostMapping
    public ResponseEntity<AdminExamResponse> createExam(@RequestBody AdminExamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminExamService.createExam(request));
    }

    @PutMapping("/{id}/metadata")
    public ResponseEntity<AdminExamResponse> updateExamMetadata(
            @PathVariable Long id,
            @RequestBody AdminExamRequest request) {
        return ResponseEntity.ok(adminExamService.updateExamMetadata(id, request));
    }

    @PutMapping("/{id}/listening/{partKey}")
    public ResponseEntity<AdminExamDetailResponse> saveListeningPart(
            @PathVariable Long id,
            @PathVariable String partKey,
            @RequestBody Object partData) {
        return ResponseEntity.ok(adminExamService.saveListeningPart(id, partKey, partData));
    }

    @PutMapping("/{id}/reading/{partKey}")
    public ResponseEntity<AdminExamDetailResponse> saveReadingPart(
            @PathVariable Long id,
            @PathVariable String partKey,
            @RequestBody Object partData) {
        return ResponseEntity.ok(adminExamService.saveReadingPart(id, partKey, partData));
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<PublishValidationResult> publishExam(@PathVariable Long id) {
        return ResponseEntity.ok(adminExamService.publishExam(id));
    }
}
