package com.example.learningservice.services.impl;

import com.example.learningservice.dto.admin.*;
import com.example.learningservice.entities.*;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.repositories.*;
import com.example.learningservice.services.AdminCourseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminCourseServiceImpl implements AdminCourseService {

    private final TopicRepository topicRepository;
    private final LevelRepository levelRepository;
    private final PartRepository partRepository;
    private final SessionRepository sessionRepository;
    private final UserProgressRepository userProgressRepository;
    private final ObjectMapper objectMapper;

    // Luu tru token xac nhan xoa tam thoi trong bo nho (het han sau 10 phut)
    private final Map<String, TokenInfo> confirmationTokens = new ConcurrentHashMap<>();

    private record TokenInfo(String type, Long targetId, LocalDateTime expiresAt) {}

    // ==========================================
    // TOPIC OPERATIONS
    // ==========================================

    @Override
    public List<AdminTopicResponse> getAdminTopicsByLevel(Long levelId) {
        List<Topic> topics = topicRepository.findByLevelIdAndIsDeleteFalseOrderByOrderIndexAsc(levelId);
        return topics.stream()
                .map(this::mapToTopicResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminTopicResponse getAdminTopicById(Long id) {
        Topic topic = topicRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Topic với ID: " + id + " hoặc đã bị xóa!"));
        return mapToTopicResponse(topic);
    }

    @Override
    @Transactional
    public AdminTopicResponse createTopic(Long adminId, AdminTopicRequest request) {
        Level level = levelRepository.findByIdAndIsDeleteFalse(request.getLevelId())
                .orElseThrow(() -> new RuntimeException("Level với ID " + request.getLevelId() + " không tồn tại hoặc đã bị xóa!"));

        // Tinh orderIndex: luon them vao vi tri sau cung cua Level
        List<Topic> existingTopics = topicRepository.findByLevelIdAndIsDeleteFalseOrderByOrderIndexAsc(request.getLevelId());
        int maxOrder = existingTopics.stream()
                .map(Topic::getOrderIndex)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(0);
        int nextOrder = maxOrder + 1;

        LocalDateTime now = LocalDateTime.now();
        Topic topic = Topic.builder()
                .level(level)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : nextOrder)
                .isPublished(false) // Mac dinh luon la DRAFT
                .build();
        topic.setCreateAt(now);
        topic.setUpdateAt(now);
        topic.setCreateBy(adminId);
        topic.setIsDelete(false);

        Topic saved = topicRepository.save(topic);
        log.info("Admin [{}] created new Topic [{}] in Level [{}] with orderIndex [{}]", adminId, saved.getId(), level.getId(), saved.getOrderIndex());

        return mapToTopicResponse(saved);
    }

    @Override
    @Transactional
    public AdminTopicResponse updateTopicMetadata(Long id, AdminTopicRequest request) {
        Topic topic = topicRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Topic với ID: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            topic.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            topic.setDescription(request.getDescription());
        }
        if (request.getThumbnailUrl() != null) {
            topic.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getOrderIndex() != null) {
            topic.setOrderIndex(request.getOrderIndex());
        }
        topic.setUpdateAt(LocalDateTime.now());

        Topic updated = topicRepository.save(topic);
        log.info("Updated metadata for Topic [{}]", updated.getId());
        return mapToTopicResponse(updated);
    }

    @Override
    @Transactional
    public PublishValidationResult publishTopic(Long adminId, Long topicId) {
        Topic topic = topicRepository.findByIdAndIsDeleteFalse(topicId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Topic với ID: " + topicId));

        List<Part> parts = partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topicId);
        List<String> errors = new ArrayList<>();

        if (parts.isEmpty()) {
            errors.add("Topic chưa có Phần học (Part) nào. Vui lòng tạo ít nhất 1 Phần học.");
            return PublishValidationResult.failed("Không thể phát hành Topic chưa có nội dung:", errors);
        }

        // Validate toan bo Session thuoc cac Part cua Topic
        List<Session> allSessions = new ArrayList<>();
        for (Part part : parts) {
            List<Session> partSessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
            if (partSessions.isEmpty()) {
                errors.add("Phần học '" + part.getTitle() + "' chưa có bài học nào.");
            } else {
                for (Session s : partSessions) {
                    validateSessionPayload(s, errors);
                }
                allSessions.addAll(partSessions);
            }
        }

        if (!errors.isEmpty()) {
            return PublishValidationResult.failed("Phát hành Topic thất bại do một số bài học chưa hoàn thiện nội dung:", errors);
        }

        LocalDateTime now = LocalDateTime.now();

        // 1. Publish Topic
        topic.setIsPublished(true);
        topic.setPublishedAt(now);
        topic.setPublishedBy(adminId);
        topic.setUpdateAt(now);
        topicRepository.save(topic);

        // 2. Bulk Publish cac Part con (chi nhung part chua published)
        for (Part part : parts) {
            if (!Boolean.TRUE.equals(part.getIsPublished())) {
                part.setIsPublished(true);
                part.setPublishedAt(now);
                part.setPublishedBy(adminId);
                part.setUpdateAt(now);
                partRepository.save(part);
            }
        }

        // 3. Bulk Publish cac Session con (chi nhung session chua published)
        for (Session session : allSessions) {
            if (!Boolean.TRUE.equals(session.getIsPublished())) {
                session.setIsPublished(true);
                session.setPublishedAt(now);
                session.setPublishedBy(adminId);
                session.setUpdateAt(now);
                sessionRepository.save(session);
            }
        }

        log.info("Admin [{}] published Topic [{}] with [{}] parts and [{}] sessions", adminId, topicId, parts.size(), allSessions.size());
        return PublishValidationResult.success("Phát hành Topic '" + topic.getTitle() + "' cùng các phần học và bài học con thành công!");
    }

    @Override
    @Transactional
    public DeleteResult deleteTopic(Long adminId, Long topicId, String confirmationToken) {
        Topic topic = topicRepository.findByIdAndIsDeleteFalse(topicId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Topic với ID: " + topicId));

        List<Part> parts = partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topicId);
        List<Long> partIds = parts.stream().map(Part::getId).collect(Collectors.toList());

        List<Session> sessions = partIds.isEmpty() ? Collections.emptyList() : sessionRepository.findByPartIdInAndIsDeleteFalse(partIds);

        // Dem tong so luot hoc cua hoc sinh trong topic nay
        long affectedStudentCount = 0;
        for (Session s : sessions) {
            affectedStudentCount += userProgressRepository.countBySessionId(s.getId());
        }

        // Neu da co hoc sinh hoc va chua co confirmationToken hop le -> Yeu cau xac nhan
        if (affectedStudentCount > 0) {
            if (confirmationToken == null || !isValidConfirmationToken(confirmationToken, "TOPIC", topicId)) {
                String token = "del_topic_" + topicId + "_" + UUID.randomUUID().toString().substring(0, 8);
                confirmationTokens.put(token, new TokenInfo("TOPIC", topicId, LocalDateTime.now().plusMinutes(10)));
                return DeleteResult.needConfirmation(
                        "Topic '" + topic.getTitle() + "' đã có " + affectedStudentCount + " lượt học của học sinh. Xóa Topic sẽ ẩn toàn bộ các bài học bên trong. Bạn có chắc chắn muốn xóa không?",
                        token,
                        affectedStudentCount
                );
            }
            // Huy token sau khi da dung
            confirmationTokens.remove(confirmationToken);
        }

        LocalDateTime now = LocalDateTime.now();

        // Cascade Soft Delete: Topic -> Parts -> Sessions
        topic.setIsDelete(true);
        topic.setUpdateAt(now);
        topic.setUpdateBy(adminId);
        topicRepository.save(topic);

        for (Part part : parts) {
            part.setIsDelete(true);
            part.setUpdateAt(now);
            part.setUpdateBy(adminId);
            partRepository.save(part);
        }

        for (Session session : sessions) {
            session.setIsDelete(true);
            session.setUpdateAt(now);
            session.setUpdateBy(adminId);
            sessionRepository.save(session);
        }

        log.info("Admin [{}] soft-deleted Topic [{}] cascade [{}] parts and [{}] sessions", adminId, topicId, parts.size(), sessions.size());
        return DeleteResult.success(
                "Đã xóa mềm Topic '" + topic.getTitle() + "' cùng toàn bộ các phần học và bài học con thành công.",
                affectedStudentCount,
                0
        );
    }

    // ==========================================
    // 2. PART OPERATIONS (TASK-07)
    // ==========================================

    @Override
    public List<AdminPartResponse> getAdminPartsByTopic(Long topicId) {
        List<Part> parts = partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topicId);
        return parts.stream()
                .map(this::mapToPartResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminPartResponse getAdminPartById(Long id) {
        Part part = partRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Phần học (Part) với ID: " + id));
        return mapToPartResponse(part);
    }

    @Override
    @Transactional
    public AdminPartResponse createPart(Long adminId, Long topicId, AdminPartRequest request) {
        Topic topic = topicRepository.findByIdAndIsDeleteFalse(topicId)
                .orElseThrow(() -> new RuntimeException("Topic với ID: " + topicId + " không tồn tại hoặc đã bị xóa!"));

        // Tự động tính orderIndex ở cuối danh sách Part trong Topic
        List<Part> existingParts = partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topicId);
        int maxOrder = existingParts.stream()
                .map(Part::getOrderIndex)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(0);
        int nextOrder = maxOrder + 1;

        LocalDateTime now = LocalDateTime.now();
        Part part = Part.builder()
                .topic(topic)
                .title(request.getTitle().trim())
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : nextOrder)
                .isPublished(false) // Part mới tạo mặc định DRAFT
                .build();
        part.setCreateAt(now);
        part.setUpdateAt(now);
        part.setCreateBy(adminId);
        part.setIsDelete(false);

        Part saved = partRepository.save(part);
        log.info("Admin [{}] created new Part [{}] in Topic [{}] with orderIndex [{}]", adminId, saved.getId(), topicId, saved.getOrderIndex());

        return mapToPartResponse(saved);
    }

    @Override
    @Transactional
    public AdminPartResponse updatePartMetadata(Long id, AdminPartRequest request) {
        Part part = partRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Phần học (Part) với ID: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            part.setTitle(request.getTitle().trim());
        }
        if (request.getOrderIndex() != null) {
            part.setOrderIndex(request.getOrderIndex());
        }
        part.setUpdateAt(LocalDateTime.now());

        Part updated = partRepository.save(part);
        log.info("Updated metadata for Part [{}]", updated.getId());
        return mapToPartResponse(updated);
    }

    @Override
    @Transactional
    public PublishValidationResult publishPart(Long adminId, Long partId) {
        Part part = partRepository.findByIdAndIsDeleteFalse(partId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Phần học (Part) với ID: " + partId));

        List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(partId);
        List<String> errors = new ArrayList<>();

        if (sessions.isEmpty()) {
            errors.add("Phần học chưa có bài học nào. Hãy tạo bài học trước khi phát hành.");
            return PublishValidationResult.failed("Không thể phát hành Phần học:", errors);
        }

        // Validate nội dung từng bài học con
        for (Session s : sessions) {
            validateSessionPayload(s, errors);
        }

        if (!errors.isEmpty()) {
            return PublishValidationResult.failed("Phát hành Phần học thất bại do một số bài học chưa hoàn thiện nội dung:", errors);
        }

        LocalDateTime now = LocalDateTime.now();

        // 1. Publish Part
        part.setIsPublished(true);
        part.setPublishedAt(now);
        part.setPublishedBy(adminId);
        part.setUpdateAt(now);
        partRepository.save(part);

        // 2. Bulk Publish các session con chưa published
        for (Session session : sessions) {
            if (!Boolean.TRUE.equals(session.getIsPublished())) {
                session.setIsPublished(true);
                session.setPublishedAt(now);
                session.setPublishedBy(adminId);
                session.setUpdateAt(now);
                sessionRepository.save(session);
            }
        }

        // 3. Tự động mở khóa bài đầu tiên của Part này cho học sinh đã hoàn thành Part trước đó
        autoUnlockFirstSessionForQualifyingStudents(part, sessions);

        log.info("Admin [{}] published Part [{}] with [{}] sessions", adminId, partId, sessions.size());
        return PublishValidationResult.success("Phát hành Phần học '" + part.getTitle() + "' cùng toàn bộ bài học con thành công!");
    }

    @Override
    @Transactional
    public DeleteResult deletePart(Long adminId, Long partId, String confirmationToken) {
        Part part = partRepository.findByIdAndIsDeleteFalse(partId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Phần học (Part) với ID: " + partId));

        List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(partId);

        // Đếm tổng số lượt học của học sinh trong Part
        long affectedStudentCount = 0;
        for (Session s : sessions) {
            affectedStudentCount += userProgressRepository.countBySessionId(s.getId());
        }

        if (affectedStudentCount > 0) {
            if (confirmationToken == null || !isValidConfirmationToken(confirmationToken, "PART", partId)) {
                String token = "del_part_" + partId + "_" + UUID.randomUUID().toString().substring(0, 8);
                confirmationTokens.put(token, new TokenInfo("PART", partId, LocalDateTime.now().plusMinutes(10)));
                return DeleteResult.needConfirmation(
                        "Phần học '" + part.getTitle() + "' đã có " + affectedStudentCount + " lượt học của học sinh. Xóa Phần học sẽ ẩn toàn bộ các bài học bên trong. Bạn có chắc chắn muốn xóa không?",
                        token,
                        affectedStudentCount
                );
            }
            confirmationTokens.remove(confirmationToken);
        }

        LocalDateTime now = LocalDateTime.now();

        // Soft Delete Part
        part.setIsDelete(true);
        part.setUpdateAt(now);
        part.setUpdateBy(adminId);
        partRepository.save(part);

        // Cascade Soft Delete các Session con
        for (Session s : sessions) {
            s.setIsDelete(true);
            s.setUpdateAt(now);
            s.setUpdateBy(adminId);
            sessionRepository.save(s);
        }

        log.info("Admin [{}] soft-deleted Part [{}] cascade [{}] sessions", adminId, partId, sessions.size());
        return DeleteResult.success(
                "Đã xóa mềm Phần học '" + part.getTitle() + "' cùng các bài học con thành công.",
                affectedStudentCount,
                0
        );
    }

    // ==========================================
    // 3. SESSION OPERATIONS & DRAFT PAYLOAD (TASK-08)
    // ==========================================

    @Override
    public List<AdminSessionResponse> getAdminSessionsByPart(Long partId) {
        List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(partId);
        return sessions.stream()
                .map(this::mapToSessionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminSessionResponse getAdminSessionById(Long id) {
        Session session = sessionRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + id));
        return mapToSessionResponse(session);
    }

    @Override
    @Transactional
    public AdminSessionResponse createSession(Long adminId, Long partId, AdminSessionRequest request) {
        Part part = partRepository.findByIdAndIsDeleteFalse(partId)
                .orElseThrow(() -> new RuntimeException("Phần học với ID: " + partId + " không tồn tại hoặc đã bị xóa!"));

        // Tính orderIndex sau cùng trong Part
        List<Session> existingSessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(partId);
        int maxOrder = existingSessions.stream()
                .map(Session::getOrderIndex)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(0);
        int nextOrder = maxOrder + 1;

        LocalDateTime now = LocalDateTime.now();
        Session session = Session.builder()
                .part(part)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .sessionType(request.getSessionType())
                .badgeId(request.getBadgeId())
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : nextOrder)
                .isPublished(false) // Bài mới luôn là DRAFT
                .hasDraft(false)
                .version(1)
                .build();

        // Nếu có truyền payload ban đầu, lưu trực tiếp vào payload
        if (request.getPayload() != null && !request.getPayload().isBlank()) {
            session.setPayload(request.getPayload());
        }

        session.setCreateAt(now);
        session.setUpdateAt(now);
        session.setCreateBy(adminId);
        session.setIsDelete(false);

        Session saved = sessionRepository.save(session);
        log.info("Admin [{}] created new Session [{}] in Part [{}] type [{}]", adminId, saved.getId(), partId, saved.getSessionType());

        return mapToSessionResponse(saved);
    }

    @Override
    @Transactional
    public AdminSessionResponse updateSessionMetadata(Long id, AdminSessionRequest request) {
        Session session = sessionRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            session.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            session.setDescription(request.getDescription());
        }
        if (request.getBadgeId() != null) {
            session.setBadgeId(request.getBadgeId());
        }
        if (request.getOrderIndex() != null) {
            session.setOrderIndex(request.getOrderIndex());
        }
        // sessionType duoc co dinh vinh vien sau khi tao de dam bao tinh toan ven payload
        // Tuyet doi khong cho phep doi loai bai tap cua session da tao

        session.setUpdateAt(LocalDateTime.now());
        Session updated = sessionRepository.save(session);

        log.info("Updated metadata for Session [{}]", updated.getId());
        return mapToSessionResponse(updated);
    }

    @Override
    @Transactional
    public AdminSessionResponse saveSessionDraft(Long adminId, Long id, AdminSessionRequest request) {
        Session session = sessionRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + id));

        String newPayload = request.getPayload();

        // Kiểm tra tính hợp lệ của định dạng JSON nếu có gửi payload
        if (newPayload != null && !newPayload.trim().isEmpty()) {
            try {
                objectMapper.readTree(newPayload);
            } catch (Exception ex) {
                throw new RuntimeException("Cấu trúc nội dung JSON của bài học không hợp lệ: " + ex.getMessage());
            }
        }

        LocalDateTime now = LocalDateTime.now();

        // CORE LOGIC DRAFT / LIVE:
        if (!Boolean.TRUE.equals(session.getIsPublished())) {
            // Kịch bản A: Bài chưa từng xuất bản -> Lưu thẳng vào payload, không cần draft
            session.setPayload(newPayload);
            session.setDraftPayload(null);
            session.setHasDraft(false);
            log.info("Admin [{}] updated payload directly for un-published Session [{}]", adminId, id);
        } else {
            // Kịch bản B: Bài đang Live -> Lưu vào draft_payload, giữ nguyên payload cũ
            session.setDraftPayload(newPayload);
            session.setHasDraft(true);
            log.info("Admin [{}] saved DRAFT payload for Live Session [{}], Live version [{}] preserved", adminId, id, session.getVersion());
        }

        session.setUpdateAt(now);
        session.setUpdateBy(adminId);
        Session saved = sessionRepository.save(session);

        return mapToSessionResponse(saved);
    }

    @Override
    @Transactional
    public PublishValidationResult publishSession(Long adminId, Long id) {
        Session session = sessionRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + id));

        LocalDateTime now = LocalDateTime.now();
        List<String> errors = new ArrayList<>();

        if (!Boolean.TRUE.equals(session.getIsPublished())) {
            // Trường hợp 1: Xuất bản lần đầu
            String payloadToValidate = session.getPayload();
            if (payloadToValidate == null || payloadToValidate.trim().isEmpty()) {
                return PublishValidationResult.failed("Không thể phát hành bài học:", List.of("Nội dung bài học (payload) đang rỗng. Vui lòng soạn nội dung trước."));
            }
            validateJsonString(payloadToValidate, errors);
            if (!errors.isEmpty()) {
                return PublishValidationResult.failed("Không thể phát hành bài học:", errors);
            }

            session.setIsPublished(true);
            session.setPublishedAt(now);
            session.setPublishedBy(adminId);
            session.setUpdateAt(now);
            session.setUpdateBy(adminId);
            sessionRepository.save(session);

            log.info("Admin [{}] published Session [{}] for the first time", adminId, id);
            return PublishValidationResult.success("Phát hành bài học '" + session.getTitle() + "' thành công!");

        } else if (Boolean.TRUE.equals(session.getHasDraft())) {
            // Trường hợp 2: Áp dụng bản sửa đổi (Publish Changes)
            String draftToValidate = session.getDraftPayload();
            if (draftToValidate == null || draftToValidate.trim().isEmpty()) {
                return PublishValidationResult.failed("Không thể áp dụng bản sửa:", List.of("Bản nháp đang rỗng."));
            }
            validateJsonString(draftToValidate, errors);
            if (!errors.isEmpty()) {
                return PublishValidationResult.failed("Không thể áp dụng bản sửa:", errors);
            }

            // Hoán đổi nguyên tử: payload = draft_payload, dọn sạch draft, tăng version
            session.setPayload(session.getDraftPayload());
            session.setDraftPayload(null);
            session.setHasDraft(false);
            session.setVersion(session.getVersion() != null ? session.getVersion() + 1 : 2);
            session.setPublishedAt(now);
            session.setPublishedBy(adminId);
            session.setUpdateAt(now);
            session.setUpdateBy(adminId);
            sessionRepository.save(session);

            log.info("Admin [{}] published CHANGES for Session [{}], new version [{}]", adminId, id, session.getVersion());
            return PublishValidationResult.success("Đã áp dụng bản sửa đổi cho bài học '" + session.getTitle() + "' (Phiên bản v" + session.getVersion() + ") thành công!");

        } else {
            return PublishValidationResult.success("Bài học đang ở phiên bản phát hành mới nhất, không có bản nháp nào đang chờ.");
        }
    }

    @Override
    @Transactional
    public AdminSessionResponse discardSessionDraft(Long adminId, Long id) {
        Session session = sessionRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + id));

        if (Boolean.TRUE.equals(session.getHasDraft())) {
            session.setDraftPayload(null);
            session.setHasDraft(false);
            session.setUpdateAt(LocalDateTime.now());
            session.setUpdateBy(adminId);
            Session saved = sessionRepository.save(session);
            log.info("Admin [{}] discarded draft for Session [{}], restored live version", adminId, id);
            return mapToSessionResponse(saved);
        }

        return mapToSessionResponse(session);
    }

    @Override
    public String getSessionPreview(Long id) {
        Session session = sessionRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + id));

        // Ưu tiên xem trước bản nháp nếu đang có nháp sửa dở
        if (Boolean.TRUE.equals(session.getHasDraft()) && session.getDraftPayload() != null) {
            return session.getDraftPayload();
        }
        return session.getPayload();
    }

    @Override
    @Transactional
    public DeleteResult deleteSession(Long adminId, Long id, String confirmationToken) {
        Session session = sessionRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + id));

        long progressCount = userProgressRepository.countBySessionId(id);

        if (progressCount > 0) {
            if (confirmationToken == null || !isValidConfirmationToken(confirmationToken, "SESSION", id)) {
                String token = "del_sess_" + id + "_" + UUID.randomUUID().toString().substring(0, 8);
                confirmationTokens.put(token, new TokenInfo("SESSION", id, LocalDateTime.now().plusMinutes(10)));
                return DeleteResult.needConfirmation(
                        "Bài học '" + session.getTitle() + "' đã có " + progressCount + " học sinh hoàn thành. Xóa bài học sẽ ẩn bài này khỏi lộ trình học. Bạn có chắc chắn muốn xóa không?",
                        token,
                        progressCount
                );
            }
            confirmationTokens.remove(confirmationToken);
        }

        int bridgedUnlockCount = 0;

        // Auto-Bridge Unlock: Nếu bài học đang published bị xóa, học sinh đang ở bài này sẽ được mở khóa bài kế tiếp
        if (Boolean.TRUE.equals(session.getIsPublished())) {
            bridgedUnlockCount = performAutoBridgeUnlock(session);
        }

        LocalDateTime now = LocalDateTime.now();
        session.setIsDelete(true);
        session.setUpdateAt(now);
        session.setUpdateBy(adminId);
        sessionRepository.save(session);

        log.info("Admin [{}] soft-deleted Session [{}], bridged unlock for [{}] students", adminId, id, bridgedUnlockCount);
        return DeleteResult.success(
                "Đã xóa bài học '" + session.getTitle() + "' thành công." + (bridgedUnlockCount > 0 ? " (" + bridgedUnlockCount + " học sinh đã được bắc cầu mở khóa sang bài kế tiếp)" : ""),
                progressCount,
                bridgedUnlockCount
        );
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private AdminTopicResponse mapToTopicResponse(Topic topic) {
        List<Part> parts = partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topic.getId());
        int partCount = parts.size();

        int sessionCount = 0;
        if (!parts.isEmpty()) {
            List<Long> partIds = parts.stream().map(Part::getId).collect(Collectors.toList());
            sessionCount = sessionRepository.findByPartIdInAndIsDeleteFalse(partIds).size();
        }

        String badge = Boolean.TRUE.equals(topic.getIsPublished()) ? "PUBLISHED" : "DRAFT";

        return AdminTopicResponse.builder()
                .id(topic.getId())
                .levelId(topic.getLevel() != null ? topic.getLevel().getId() : null)
                .title(topic.getTitle())
                .description(topic.getDescription())
                .thumbnailUrl(topic.getThumbnailUrl())
                .orderIndex(topic.getOrderIndex())
                .isPublished(topic.getIsPublished())
                .publishedAt(topic.getPublishedAt())
                .publishedBy(topic.getPublishedBy())
                .partCount(partCount)
                .sessionCount(sessionCount)
                .badge(badge)
                .createdAt(topic.getCreateAt())
                .updatedAt(topic.getUpdateAt())
                .build();
    }

    private AdminPartResponse mapToPartResponse(Part part) {
        int sessionCount = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId()).size();
        String badge = Boolean.TRUE.equals(part.getIsPublished()) ? "PUBLISHED" : "DRAFT";

        return AdminPartResponse.builder()
                .id(part.getId())
                .topicId(part.getTopic() != null ? part.getTopic().getId() : null)
                .title(part.getTitle())
                .orderIndex(part.getOrderIndex())
                .isPublished(part.getIsPublished())
                .publishedAt(part.getPublishedAt())
                .publishedBy(part.getPublishedBy())
                .sessionCount(sessionCount)
                .badge(badge)
                .createdAt(part.getCreateAt())
                .updatedAt(part.getUpdateAt())
                .build();
    }

    private AdminSessionResponse mapToSessionResponse(Session session) {
        long progressCount = userProgressRepository.countBySessionId(session.getId());

        String badge;
        if (!Boolean.TRUE.equals(session.getIsPublished())) {
            badge = "DRAFT";
        } else if (Boolean.TRUE.equals(session.getHasDraft())) {
            badge = "HAS_DRAFT";
        } else {
            badge = "PUBLISHED";
        }

        return AdminSessionResponse.builder()
                .id(session.getId())
                .partId(session.getPart() != null ? session.getPart().getId() : null)
                .title(session.getTitle())
                .description(session.getDescription())
                .orderIndex(session.getOrderIndex())
                .sessionType(session.getSessionType())
                .badgeId(session.getBadgeId())
                .isPublished(session.getIsPublished())
                .hasDraft(session.getHasDraft())
                .version(session.getVersion())
                .publishedAt(session.getPublishedAt())
                .publishedBy(session.getPublishedBy())
                .badge(badge)
                .payload(session.getPayload())
                .draftPayload(session.getDraftPayload())
                .studentProgressCount(progressCount)
                .createdAt(session.getCreateAt())
                .updatedAt(session.getUpdateAt())
                .build();
    }

    private void validateSessionPayload(Session s, List<String> errors) {
        String payloadToValidate = Boolean.TRUE.equals(s.getHasDraft()) && s.getDraftPayload() != null
                ? s.getDraftPayload()
                : s.getPayload();

        if (payloadToValidate == null || payloadToValidate.trim().isEmpty()) {
            errors.add("Bài học '" + s.getTitle() + "' (ID: " + s.getId() + ") chưa có dữ liệu nội dung (payload rỗng).");
            return;
        }

        validateJsonString(payloadToValidate, errors);
    }

    private void validateJsonString(String json, List<String> errors) {
        try {
            objectMapper.readTree(json);
        } catch (Exception ex) {
            errors.add("Cấu trúc JSON bài học không hợp lệ: " + ex.getMessage());
        }
    }

    private boolean isValidConfirmationToken(String token, String expectedType, Long expectedTargetId) {
        TokenInfo info = confirmationTokens.get(token);
        if (info == null) return false;
        if (LocalDateTime.now().isAfter(info.expiresAt())) {
            confirmationTokens.remove(token);
            return false;
        }
        return expectedType.equals(info.type()) && Objects.equals(expectedTargetId, info.targetId());
    }

    private int performAutoBridgeUnlock(Session currentSession) {
        List<UserProgress> unlockingProgresses = userProgressRepository.findBySessionIdAndStatus(currentSession.getId(), SessionStatus.UNLOCK);
        if (unlockingProgresses.isEmpty()) {
            return 0;
        }

        // Tìm bài kế tiếp còn active trong cùng Part
        List<Session> partSessions = sessionRepository.findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(currentSession.getPart().getId());
        Session nextSession = null;
        for (Session s : partSessions) {
            if (s.getOrderIndex() != null && currentSession.getOrderIndex() != null
                    && s.getOrderIndex() > currentSession.getOrderIndex()
                    && !s.getId().equals(currentSession.getId())) {
                nextSession = s;
                break;
            }
        }

        if (nextSession == null) {
            return 0;
        }

        int count = 0;
        LocalDateTime now = LocalDateTime.now();
        for (UserProgress up : unlockingProgresses) {
            Optional<UserProgress> existingNext = userProgressRepository.findByUserIdAndSessionId(up.getUserId(), nextSession.getId());
            if (existingNext.isEmpty()) {
                UserProgress newProg = UserProgress.builder()
                        .userId(up.getUserId())
                        .session(nextSession)
                        .status(SessionStatus.UNLOCK)
                        .durationSeconds(0)
                        .build();
                newProg.setCreateAt(now);
                newProg.setUpdateAt(now);
                userProgressRepository.save(newProg);
                count++;
            }
        }
        return count;
    }

    private void autoUnlockFirstSessionForQualifyingStudents(Part newPart, List<Session> newSessions) {
        if (newSessions.isEmpty() || newPart.getTopic() == null) return;
        Session firstSession = newSessions.get(0);

        // Tìm part liền trước trong cùng topic
        List<Part> topicParts = partRepository.findByTopicIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(newPart.getTopic().getId());
        Part prevPart = null;
        for (int i = 0; i < topicParts.size(); i++) {
            if (topicParts.get(i).getId().equals(newPart.getId()) && i > 0) {
                prevPart = topicParts.get(i - 1);
                break;
            }
        }

        if (prevPart == null) return;

        List<Session> prevSessions = sessionRepository.findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(prevPart.getId());
        if (prevSessions.isEmpty()) return;
        Session lastSessionOfPrevPart = prevSessions.get(prevSessions.size() - 1);

        // Học sinh đã FINISH bài cuối của part trước
        List<UserProgress> finishedUsers = userProgressRepository.findAll().stream()
                .filter(up -> up.getSession() != null && up.getSession().getId().equals(lastSessionOfPrevPart.getId()) && up.getStatus() == SessionStatus.FINISH)
                .collect(Collectors.toList());

        LocalDateTime now = LocalDateTime.now();
        for (UserProgress up : finishedUsers) {
            Optional<UserProgress> existing = userProgressRepository.findByUserIdAndSessionId(up.getUserId(), firstSession.getId());
            if (existing.isEmpty()) {
                UserProgress unlockProg = UserProgress.builder()
                        .userId(up.getUserId())
                        .session(firstSession)
                        .status(SessionStatus.UNLOCK)
                        .durationSeconds(0)
                        .build();
                unlockProg.setCreateAt(now);
                unlockProg.setUpdateAt(now);
                userProgressRepository.save(unlockProg);
            }
        }
    }
}