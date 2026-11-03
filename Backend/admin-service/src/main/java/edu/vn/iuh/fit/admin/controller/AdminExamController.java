package edu.vn.iuh.fit.admin.controller;

import edu.vn.iuh.fit.admin.dto.request.AdminExamRequest;
import edu.vn.iuh.fit.admin.dto.response.AdminExamDetailResponse;
import edu.vn.iuh.fit.admin.dto.response.AdminExamResponse;
import edu.vn.iuh.fit.admin.dto.response.PublishValidationResult;
import edu.vn.iuh.fit.admin.services.AdminExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/exams")
@RequiredArgsConstructor
public class AdminExamController {

    private final AdminExamService adminExamService;

    @GetMapping
    public ResponseEntity<List<AdminExamResponse>> getAllExams() {
        return ResponseEntity.ok(adminExamService.getAllExams());
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
