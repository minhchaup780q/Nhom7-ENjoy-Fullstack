package com.example.learningservice.services.impl;

import com.example.learningservice.dto.admin.AdminExamDetailResponse;
import com.example.learningservice.dto.admin.AdminExamRequest;
import com.example.learningservice.dto.admin.AdminExamResponse;
import com.example.learningservice.dto.admin.PublishValidationResult;
import com.example.learningservice.entities.Exam;
import com.example.learningservice.entities.enums.ExamType;
import com.example.learningservice.repositories.ExamHistoryRepository;
import com.example.learningservice.repositories.ExamRepository;
import com.example.learningservice.services.AdminExamService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminExamServiceImpl implements AdminExamService {

    private final ExamRepository examRepository;
    private final ExamHistoryRepository examHistoryRepository;
    private final ObjectMapper objectMapper;

    private static final List<String> LISTENING_PARTS = List.of("part1", "part2", "part3", "part4");
    private static final List<String> READING_PARTS = List.of("part1", "part2", "part3", "part4", "part5");

    // ==========================================
    // ĐỌC
    // ==========================================

    @Override
    public List<AdminExamResponse> getAllExamsForAdmin() {
        // Gộp số lượt làm bài theo từng exam (1 query, tránh N+1)
        Map<Long, Long> attemptsByExam = new HashMap<>();
        for (Object[] row : examHistoryRepository.countAttemptsGroupedByExam()) {
            attemptsByExam.put((Long) row[0], (Long) row[1]);
        }

        return examRepository.findAllActive().stream()
                .map(e -> toAdminResponse(e, attemptsByExam.getOrDefault(e.getId(), 0L)))
                .toList();
    }

    @Override
    public AdminExamDetailResponse getExamDetail(Long id) {
        return toDetailResponse(findExam(id));
    }

    // ==========================================
    // GHI
    // ==========================================

    @Override
    public AdminExamResponse createExam(AdminExamRequest request) {
        Exam exam = new Exam();
        applyMetadata(exam, request);
        exam.setIsPublished(false);
        exam.setListeningPayload("{}");
        exam.setReadingPayload("{}");
        exam.setTotalListeningQuestions(0);
        exam.setTotalReadingQuestions(0);
        exam.setIsDelete(false);
        exam.setCreateAt(LocalDateTime.now());

        return toAdminResponse(examRepository.save(exam), 0L);
    }

    @Override
    public AdminExamResponse updateExamMetadata(Long id, AdminExamRequest request) {
        Exam exam = findExam(id);
        applyMetadata(exam, request);
        exam.setUpdateAt(LocalDateTime.now());
        return toAdminResponse(examRepository.save(exam), countAttempts(id));
    }

    @Override
    public AdminExamDetailResponse saveListeningPart(Long id, String partKey, Object partData) {
        validatePartKey(partKey, LISTENING_PARTS, "Nghe");
        Exam exam = findExam(id);
        exam.setListeningPayload(mergePart(exam.getListeningPayload(), partKey, toJsonNode(partData)));
        recomputeQuestionCounts(exam);
        exam.setUpdateAt(LocalDateTime.now());
        return toDetailResponse(examRepository.save(exam));
    }

    @Override
    public AdminExamDetailResponse saveReadingPart(Long id, String partKey, Object partData) {
        validatePartKey(partKey, READING_PARTS, "Đọc");
        Exam exam = findExam(id);
        exam.setReadingPayload(mergePart(exam.getReadingPayload(), partKey, toJsonNode(partData)));
        recomputeQuestionCounts(exam);
        exam.setUpdateAt(LocalDateTime.now());
        return toDetailResponse(examRepository.save(exam));
    }

    /**
     * Spring Boot 4.1 dùng Jackson 3 cho @RequestBody nên controller nhận phần thi dưới dạng
     * Object (Map/List). Chuyển về JsonNode của Jackson 2 bằng ObjectMapper nội bộ để tái dùng
     * toàn bộ logic gộp/đếm câu hỏi vốn viết trên JsonNode.
     */
    private JsonNode toJsonNode(Object partData) {
        if (partData == null) return null;
        return objectMapper.valueToTree(partData);
    }

    @Override
    public PublishValidationResult publishExam(Long id) {
        Exam exam = findExam(id);

        List<String> missing = new ArrayList<>();
        JsonNode listening = readPayload(exam.getListeningPayload());
        JsonNode reading = readPayload(exam.getReadingPayload());

        for (String key : LISTENING_PARTS) {
            if (isPartEmpty(listening.get(key))) {
                missing.add("Nghe - " + partLabel(key));
            }
        }
        for (String key : READING_PARTS) {
            if (isPartEmpty(reading.get(key))) {
                missing.add("Đọc - " + partLabel(key));
            }
        }

        if (!missing.isEmpty()) {
            return PublishValidationResult.failed(
                    "Chưa thể xuất bản: còn " + missing.size() + " phần chưa soạn nội dung.",
                    missing);
        }

        exam.setIsPublished(true);
        exam.setUpdateAt(LocalDateTime.now());
        examRepository.save(exam);
        return PublishValidationResult.success("Đã xuất bản đề thi \"" + exam.getTitle() + "\" thành công!");
    }

    // ==========================================
    // HỖ TRỢ
    // ==========================================

    private Exam findExam(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đề thi với id: " + id));
    }

    private Long countAttempts(Long examId) {
        for (Object[] row : examHistoryRepository.countAttemptsGroupedByExam()) {
            if (examId.equals(row[0])) return (Long) row[1];
        }
        return 0L;
    }

    private void applyMetadata(Exam exam, AdminExamRequest request) {
        if (request.getExamType() != null) {
            exam.setExamType(ExamType.valueOf(request.getExamType()));
        }
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setLevel(request.getLevel());
        exam.setListeningDuration(request.getListeningDuration());
        exam.setReadingDuration(request.getReadingDuration());
    }

    private void validatePartKey(String partKey, List<String> allowed, String sectionLabel) {
        if (!allowed.contains(partKey)) {
            throw new IllegalArgumentException(
                    "Phần không hợp lệ cho bài " + sectionLabel + ": " + partKey);
        }
    }

    /** Đọc payload hiện có, thay/thêm đúng 1 key part rồi trả lại chuỗi JSON mới. */
    private String mergePart(String currentPayload, String partKey, JsonNode partData) {
        try {
            JsonNode root = readPayload(currentPayload);
            ObjectNode obj = root.isObject() ? (ObjectNode) root : objectMapper.createObjectNode();
            obj.set(partKey, partData != null ? partData : objectMapper.createObjectNode());
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.error("Lỗi khi gộp phần {} vào payload đề thi", partKey, e);
            throw new RuntimeException("Không thể lưu nội dung phần " + partKey);
        }
    }

    private JsonNode readPayload(String payload) {
        try {
            if (payload == null || payload.isBlank()) return objectMapper.createObjectNode();
            JsonNode node = objectMapper.readTree(payload);
            return node != null ? node : objectMapper.createObjectNode();
        } catch (Exception e) {
            log.warn("Payload đề thi không phải JSON hợp lệ, coi như rỗng", e);
            return objectMapper.createObjectNode();
        }
    }

    private boolean isPartEmpty(JsonNode part) {
        if (part == null || part.isNull() || part.isMissingNode()) return true;
        if (part.isArray()) return part.isEmpty();
        if (part.isObject()) return part.isEmpty();
        return false;
    }

    private String partLabel(String partKey) {
        return "Part " + partKey.replace("part", "");
    }

    /** Tính lại tổng số câu hỏi thật (không tính câu ví dụ) của cả 2 bài. */
    private void recomputeQuestionCounts(Exam exam) {
        exam.setTotalListeningQuestions(countSection(readPayload(exam.getListeningPayload()), LISTENING_PARTS));
        exam.setTotalReadingQuestions(countSection(readPayload(exam.getReadingPayload()), READING_PARTS));
    }

    private int countSection(JsonNode sectionNode, List<String> partKeys) {
        int total = 0;
        for (String key : partKeys) {
            total += countAnswerable(sectionNode.get(key));
        }
        return total;
    }

    /**
     * Đếm số câu có tính điểm trong 1 phần, xử lý được mọi hình dạng đang dùng:
     * - mảng phẳng (Đọc part1/part3)
     * - mảng nhóm chứa "questions" (Đọc part5)
     * - object chứa "coordinates" / "questions" / "answers" (các phần còn lại)
     * Bỏ qua phần tử có is_example = true.
     */
    private int countAnswerable(JsonNode part) {
        if (part == null || part.isNull() || part.isMissingNode()) return 0;

        if (part.isArray()) {
            int total = 0;
            for (JsonNode item : part) {
                JsonNode nested = item.get("questions");
                if (nested != null && nested.isArray()) {
                    total += countAnswerable(nested);
                } else if (!isExample(item)) {
                    total++;
                }
            }
            return total;
        }

        if (part.isObject()) {
            for (String listKey : List.of("coordinates", "questions", "answers")) {
                JsonNode list = part.get(listKey);
                if (list != null && list.isArray()) {
                    return countAnswerable(list);
                }
            }
        }
        return 0;
    }

    private boolean isExample(JsonNode item) {
        JsonNode flag = item.get("is_example");
        return flag != null && flag.asBoolean(false);
    }

    // ==========================================
    // MAPPING
    // ==========================================

    private boolean isPublished(Exam e) {
        // Đề thi cũ (chưa có cờ) coi như đã phát hành; chỉ false mới là nháp.
        return !Boolean.FALSE.equals(e.getIsPublished());
    }

    private AdminExamResponse toAdminResponse(Exam e, Long attemptCount) {
        boolean published = isPublished(e);
        return AdminExamResponse.builder()
                .id(e.getId())
                .examType(e.getExamType() != null ? e.getExamType().name() : null)
                .title(e.getTitle())
                .description(e.getDescription())
                .level(e.getLevel())
                .listeningDuration(e.getListeningDuration())
                .readingDuration(e.getReadingDuration())
                .totalListeningQuestions(e.getTotalListeningQuestions())
                .totalReadingQuestions(e.getTotalReadingQuestions())
                .isPublished(published)
                .badge(published ? "PUBLISHED" : "DRAFT")
                .attemptCount(attemptCount)
                .createdAt(e.getCreateAt())
                .build();
    }

    private AdminExamDetailResponse toDetailResponse(Exam e) {
        boolean published = isPublished(e);
        return AdminExamDetailResponse.builder()
                .id(e.getId())
                .examType(e.getExamType() != null ? e.getExamType().name() : null)
                .title(e.getTitle())
                .description(e.getDescription())
                .level(e.getLevel())
                .listeningDuration(e.getListeningDuration())
                .readingDuration(e.getReadingDuration())
                .totalListeningQuestions(e.getTotalListeningQuestions())
                .totalReadingQuestions(e.getTotalReadingQuestions())
                .isPublished(published)
                .badge(published ? "PUBLISHED" : "DRAFT")
                .attemptCount(countAttempts(e.getId()))
                .createdAt(e.getCreateAt())
                .listeningPayload(e.getListeningPayload() == null || e.getListeningPayload().isBlank()
                        ? "{}" : e.getListeningPayload())
                .readingPayload(e.getReadingPayload() == null || e.getReadingPayload().isBlank()
                        ? "{}" : e.getReadingPayload())
                .build();
    }
}
