package com.example.learningservice.services;

import com.example.learningservice.dto.admin.*;

import java.util.List;

public interface AdminCourseService {

    // === TOPIC OPERATIONS ===
    List<AdminTopicResponse> getAdminTopicsByLevel(Long levelId);
    AdminTopicResponse getAdminTopicById(Long id);
    AdminTopicResponse createTopic(Long adminId, AdminTopicRequest request);
    AdminTopicResponse updateTopicMetadata(Long id, AdminTopicRequest request);
    PublishValidationResult publishTopic(Long adminId, Long topicId);
    DeleteResult deleteTopic(Long adminId, Long topicId, String confirmationToken);

    // === PART OPERATIONS ===
    List<AdminPartResponse> getAdminPartsByTopic(Long topicId);
    AdminPartResponse getAdminPartById(Long id);
    AdminPartResponse createPart(Long adminId, Long topicId, AdminPartRequest request);
    AdminPartResponse updatePartMetadata(Long id, AdminPartRequest request);
    PublishValidationResult publishPart(Long adminId, Long partId);
    DeleteResult deletePart(Long adminId, Long partId, String confirmationToken);

    // === SESSION OPERATIONS ===
    List<AdminSessionResponse> getAdminSessionsByPart(Long partId);
    AdminSessionResponse getAdminSessionById(Long id);
    AdminSessionResponse createSession(Long adminId, Long partId, AdminSessionRequest request);
    AdminSessionResponse updateSessionMetadata(Long id, AdminSessionRequest request);
    AdminSessionResponse saveSessionDraft(Long adminId, Long id, AdminSessionRequest request);
    PublishValidationResult publishSession(Long adminId, Long id);
    AdminSessionResponse discardSessionDraft(Long adminId, Long id);
    String getSessionPreview(Long id);
    DeleteResult deleteSession(Long adminId, Long id, String confirmationToken);
}
