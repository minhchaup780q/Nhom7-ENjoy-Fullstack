package com.example.learningservice.controllers;

import com.example.learningservice.dto.admin.*;
import com.example.learningservice.services.AdminCourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminCourseController {

    private final AdminCourseService adminCourseService;

    private Long resolveAdminId(Long headerAdminId, Long paramAdminId) {
        if (headerAdminId != null) return headerAdminId;
        if (paramAdminId != null) return paramAdminId;
        return 1L; // Fallback mac dinh
    }

    // ==========================================
    // TOPIC ENDPOINTS
    // ==========================================

    @GetMapping("/topics")
    public ResponseEntity<List<AdminTopicResponse>> getAdminTopicsByLevel(@RequestParam Long levelId) {
        return ResponseEntity.ok(adminCourseService.getAdminTopicsByLevel(levelId));
    }

    @GetMapping("/topics/{id}")
    public ResponseEntity<AdminTopicResponse> getAdminTopicById(@PathVariable Long id) {
        return ResponseEntity.ok(adminCourseService.getAdminTopicById(id));
    }

    @PostMapping("/topics")
    public ResponseEntity<AdminTopicResponse> createTopic(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @Valid @RequestBody AdminTopicRequest request) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminCourseService.createTopic(adminId, request));
    }

    @PutMapping("/topics/{id}/metadata")
    public ResponseEntity<AdminTopicResponse> updateTopicMetadata(
            @PathVariable Long id,
            @Valid @RequestBody AdminTopicRequest request) {
        return ResponseEntity.ok(adminCourseService.updateTopicMetadata(id, request));
    }

    @PostMapping("/topics/{id}/publish")
    public ResponseEntity<PublishValidationResult> publishTopic(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @PathVariable Long id) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        PublishValidationResult result = adminCourseService.publishTopic(adminId, id);
        if (!result.isValid()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(result);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/topics/{id}")
    public ResponseEntity<DeleteResult> deleteTopic(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestHeader(value = "X-Confirmation-Token", required = false) String headerToken,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @RequestParam(value = "confirmationToken", required = false) String paramToken,
            @PathVariable Long id) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        String token = paramToken != null ? paramToken : headerToken;
        DeleteResult result = adminCourseService.deleteTopic(adminId, id, token);
        if (result.isRequiresConfirmation()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
        }
        return ResponseEntity.ok(result);
    }

    // ==========================================
    // PART ENDPOINTS
    // ==========================================

    @GetMapping("/parts")
    public ResponseEntity<List<AdminPartResponse>> getAdminPartsByTopic(@RequestParam Long topicId) {
        return ResponseEntity.ok(adminCourseService.getAdminPartsByTopic(topicId));
    }

    @GetMapping("/parts/{id}")
    public ResponseEntity<AdminPartResponse> getAdminPartById(@PathVariable Long id) {
        return ResponseEntity.ok(adminCourseService.getAdminPartById(id));
    }

    @PostMapping("/parts")
    public ResponseEntity<AdminPartResponse> createPart(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @RequestParam Long topicId,
            @Valid @RequestBody AdminPartRequest request) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminCourseService.createPart(adminId, topicId, request));
    }

    @PutMapping("/parts/{id}/metadata")
    public ResponseEntity<AdminPartResponse> updatePartMetadata(
            @PathVariable Long id,
            @Valid @RequestBody AdminPartRequest request) {
        return ResponseEntity.ok(adminCourseService.updatePartMetadata(id, request));
    }

    @PostMapping("/parts/{id}/publish")
    public ResponseEntity<PublishValidationResult> publishPart(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @PathVariable Long id) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        PublishValidationResult result = adminCourseService.publishPart(adminId, id);
        if (!result.isValid()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(result);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/parts/{id}")
    public ResponseEntity<DeleteResult> deletePart(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestHeader(value = "X-Confirmation-Token", required = false) String headerToken,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @RequestParam(value = "confirmationToken", required = false) String paramToken,
            @PathVariable Long id) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        String token = paramToken != null ? paramToken : headerToken;
        DeleteResult result = adminCourseService.deletePart(adminId, id, token);
        if (result.isRequiresConfirmation()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
        }
        return ResponseEntity.ok(result);
    }

    // ==========================================
    // SESSION ENDPOINTS
    // ==========================================

    @GetMapping("/sessions")
    public ResponseEntity<List<AdminSessionResponse>> getAdminSessionsByPart(@RequestParam Long partId) {
        return ResponseEntity.ok(adminCourseService.getAdminSessionsByPart(partId));
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<AdminSessionResponse> getAdminSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(adminCourseService.getAdminSessionById(id));
    }

    @PostMapping("/sessions")
    public ResponseEntity<AdminSessionResponse> createSession(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @RequestParam Long partId,
            @Valid @RequestBody AdminSessionRequest request) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminCourseService.createSession(adminId, partId, request));
    }

    @PutMapping("/sessions/{id}/metadata")
    public ResponseEntity<AdminSessionResponse> updateSessionMetadata(
            @PathVariable Long id,
            @Valid @RequestBody AdminSessionRequest request) {
        return ResponseEntity.ok(adminCourseService.updateSessionMetadata(id, request));
    }

    @PutMapping("/sessions/{id}/draft")
    public ResponseEntity<AdminSessionResponse> saveSessionDraft(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @PathVariable Long id,
            @RequestBody AdminSessionRequest request) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        return ResponseEntity.ok(adminCourseService.saveSessionDraft(adminId, id, request));
    }

    @PostMapping("/sessions/{id}/publish")
    public ResponseEntity<PublishValidationResult> publishSession(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @PathVariable Long id) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        PublishValidationResult result = adminCourseService.publishSession(adminId, id);
        if (!result.isValid()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/sessions/{id}/discard-draft")
    public ResponseEntity<AdminSessionResponse> discardSessionDraft(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @PathVariable Long id) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        return ResponseEntity.ok(adminCourseService.discardSessionDraft(adminId, id));
    }

    @GetMapping(value = "/sessions/{id}/preview", produces = "application/json")
    public ResponseEntity<String> getSessionPreview(@PathVariable Long id) {
        String payload = adminCourseService.getSessionPreview(id);
        return ResponseEntity.ok(payload != null ? payload : "{}");
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<DeleteResult> deleteSession(
            @RequestHeader(value = "X-User-Id", required = false) Long headerAdminId,
            @RequestHeader(value = "X-Confirmation-Token", required = false) String headerToken,
            @RequestParam(value = "adminId", required = false) Long paramAdminId,
            @RequestParam(value = "confirmationToken", required = false) String paramToken,
            @PathVariable Long id) {
        Long adminId = resolveAdminId(headerAdminId, paramAdminId);
        String token = paramToken != null ? paramToken : headerToken;
        DeleteResult result = adminCourseService.deleteSession(adminId, id, token);
        if (result.isRequiresConfirmation()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
        }
        return ResponseEntity.ok(result);
    }
}