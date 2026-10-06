package com.example.learningservice.services.impl;

import com.example.learningservice.dto.*;
import com.example.learningservice.entities.Exam;
import com.example.learningservice.entities.ExamHistory;
import com.example.learningservice.repositories.ExamHistoryRepository;
import com.example.learningservice.repositories.ExamRepository;
import com.example.learningservice.services.ExamService;
import com.example.learningservice.services.VocabularyTrackingService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final ExamHistoryRepository examHistoryRepository;
    private final ObjectMapper objectMapper;
    private final VocabularyTrackingService vocabularyTrackingService;

    // -------------------------------------------------------
    // Bảng quy đổi điểm sang số khiên (dựa trên đặc tả):
    // Listening (tối đa 20 điểm):
    //   >= 18 -> 5 khiên, >= 16 -> 4, >= 13 -> 3, >= 11 -> 2, còn lại -> 1
    // Reading (tối đa 25 điểm):
    //   >= 21 -> 5 khiên, >= 19 -> 4, >= 16 -> 3, >= 13 -> 2, còn lại -> 1
    // -------------------------------------------------------

    @Override
    public List<ExamSummaryResponse> getAllExams() {
        return examRepository.findAllActive().stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    public ExamDetailResponse getExamById(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đề thi với id: " + examId));
        return toDetail(exam);
    }

    @Override
    public ExamResultResponse submitExam(Long userId, Long examId, ExamSubmitRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đề thi với id: " + examId));

        try {
            JsonNode listeningNode = objectMapper.readTree(exam.getListeningPayload());
            JsonNode readingNode = objectMapper.readTree(exam.getReadingPayload());

            // --- Tính điểm Listening ---
            ExamResultResponse.PartScoreDetail lisScores = calculateListeningScore(
                    listeningNode, request.getListening()
            );
            int lisCorrect = sumCorrect(lisScores, false);
            int lisTotal = exam.getTotalListeningQuestions() != null ? exam.getTotalListeningQuestions() : 20;
            int lisShields = calcListeningShields(lisCorrect);

            // --- Tính điểm Reading ---
            ExamResultResponse.PartScoreDetail readScores = calculateReadingScore(
                    readingNode, request.getReading()
            );
            int readCorrect = sumCorrect(readScores, true);
            int readTotal = exam.getTotalReadingQuestions() != null ? exam.getTotalReadingQuestions() : 25;
            int readShields = calcReadingShields(readCorrect);

            int totalCorrect = lisCorrect + readCorrect;
            int totalQuestions = lisTotal + readTotal;

            // --- Lưu lịch sử ---
            Map<String, Object> partScoresMap = new java.util.HashMap<>();
            partScoresMap.put("listening", lisScores);
            partScoresMap.put("reading", readScores);
            String partScoresJson = objectMapper.writeValueAsString(partScoresMap);

            Map<String, Object> answersMap = new java.util.HashMap<>();
            answersMap.put("listening", request.getListening() != null ? request.getListening() : new java.util.HashMap<>());
            answersMap.put("reading", request.getReading() != null ? request.getReading() : new java.util.HashMap<>());
            String answersJson = objectMapper.writeValueAsString(answersMap);

            ExamHistory history = ExamHistory.builder()
                    .userId(userId)
                    .exam(exam)
                    .totalCorrect(totalCorrect)
                    .totalQuestions(totalQuestions)
                    .listeningShields(lisShields)
                    .readingShields(readShields)
                    .partScoresPayload(partScoresJson)
                    .answersPayload(answersJson)
                    .completedAt(LocalDateTime.now())
                    .build();
            history.setCreateAt(LocalDateTime.now());
            history.setIsDelete(false);

            ExamHistory saved = examHistoryRepository.save(history);

            // --- Trích xuất từ vựng đúng/sai và cập nhật tracking ---
            List<String> wrongWords = new ArrayList<>();
            List<String> correctWords = new ArrayList<>();
            Map<String, java.util.List<String>> wrongVocabByTopic = new java.util.LinkedHashMap<>();
            try {
                vocabularyTrackingService.extractListeningPart2(
                        listeningNode.path("part2"), request.getListening() != null ? request.getListening().get("part2") : null,
                        wrongWords, correctWords);
                vocabularyTrackingService.extractListeningPart4(
                        listeningNode.path("part4"), request.getListening() != null ? request.getListening().get("part4") : null,
                        wrongWords, correctWords);
                vocabularyTrackingService.extractReadingPart1(
                        readingNode.path("part1"), request.getReading() != null ? request.getReading().get("part1") : null,
                        wrongWords, correctWords);
                vocabularyTrackingService.extractReadingPart3(
                        readingNode.path("part3"), request.getReading() != null ? request.getReading().get("part3") : null,
                        wrongWords, correctWords);
                vocabularyTrackingService.extractReadingPart4(
                        readingNode.path("part4"), request.getReading() != null ? request.getReading().get("part4") : null,
                        wrongWords, correctWords);
                wrongVocabByTopic = vocabularyTrackingService.processExamResult(userId, wrongWords, correctWords);
            } catch (Exception vocabEx) {
                log.warn("Lỗi khi xử lý tracking từ vựng: {}", vocabEx.getMessage());
            }

            return ExamResultResponse.builder()
                    .totalCorrect(totalCorrect)
                    .totalQuestions(totalQuestions)
                    .listeningCorrect(lisCorrect)
                    .listeningTotal(lisTotal)
                    .listeningShields(lisShields)
                    .listeningPartScores(lisScores)
                    .readingCorrect(readCorrect)
                    .readingTotal(readTotal)
                    .readingShields(readShields)
                    .readingPartScores(readScores)
                    .historyId(saved.getId())
                    .wrongVocabByTopic(wrongVocabByTopic.isEmpty() ? null : wrongVocabByTopic)
                    .build();

        } catch (Exception e) {
            log.error("Lỗi khi tính điểm bài thi id={}: {}", examId, e.getMessage(), e);
            throw new RuntimeException("Lỗi khi tính điểm bài thi: " + e.getMessage());
        }
    }

    @Override
    public List<ExamResultResponse> getExamHistory(Long userId) {
        // Chức năng xem lịch sử - để mở rộng sau
        return new ArrayList<>();
    }

    // -------------------------------------------------------
    // Helper: Tính điểm từng Part Listening
    // -------------------------------------------------------
    private ExamResultResponse.PartScoreDetail calculateListeningScore(
            JsonNode listeningNode, Map<String, List<ExamSubmitRequest.PartAnswer>> answers) {

        if (answers == null) return emptyPartScore();

        // Part 1: Drag & Drop tên lên ảnh - so sánh word với answer theo index
        var p1 = scoreListeningPart1(listeningNode.path("part1"), answers.get("part1"));
        // Part 2: Điền từ/số - so sánh keyword với answer (case-insensitive, trim)
        var p2 = scoreListeningPart2(listeningNode.path("part2"), answers.get("part2"));
        // Part 3: Trắc nghiệm hình ảnh A/B/C
        var p3 = scoreListeningPart3(listeningNode.path("part3"), answers.get("part3"));
        // Part 4: Drag & Drop màu sắc
        var p4 = scoreListeningPart4(listeningNode.path("part4"), answers.get("part4"));

        return ExamResultResponse.PartScoreDetail.builder()
                .part1Correct(p1[0]).part1Total(p1[1])
                .part2Correct(p2[0]).part2Total(p2[1])
                .part3Correct(p3[0]).part3Total(p3[1])
                .part4Correct(p4[0]).part4Total(p4[1])
                .build();
    }

    /** Part 1 Listening: coordinates - is_example=false thì tính điểm */
    private int[] scoreListeningPart1(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || userAnswers == null) return new int[]{0, 0};
        JsonNode coords = part.path("coordinates");
        int correct = 0, total = 0;
        int ansIdx = 0;
        for (JsonNode coord : coords) {
            if (!coord.path("is_example").asBoolean(false)) {
                total++;
                if (ansIdx < userAnswers.size()) {
                    String expected = coord.path("word").asText("").trim().toLowerCase();
                    String given = normalize(userAnswers.get(ansIdx).getAnswer());
                    if (expected.equals(given)) correct++;
                    ansIdx++;
                }
            }
        }
        return new int[]{correct, total};
    }

    /** Part 2 Listening: questions - is_example=false thì tính điểm */
    private int[] scoreListeningPart2(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || userAnswers == null) return new int[]{0, 0};
        JsonNode questions = part.path("questions");
        int correct = 0, total = 0, ansIdx = 0;
        for (JsonNode q : questions) {
            if (!q.path("is_example").asBoolean(false)) {
                total++;
                if (ansIdx < userAnswers.size()) {
                    String expected = q.path("keyword").asText("").trim().toLowerCase();
                    String given = normalize(userAnswers.get(ansIdx).getAnswer());
                    if (expected.equals(given)) correct++;
                    ansIdx++;
                }
            }
        }
        return new int[]{correct, total};
    }

    /** Part 3 Listening: questions - is_example=false, so sánh answer (A/B/C) */
    private int[] scoreListeningPart3(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || userAnswers == null) return new int[]{0, 0};
        JsonNode questions = part.path("questions");
        int correct = 0, total = 0, ansIdx = 0;
        for (JsonNode q : questions) {
            if (!q.path("is_example").asBoolean(false)) {
                total++;
                if (ansIdx < userAnswers.size()) {
                    String expected = q.path("answer").asText("").trim().toUpperCase();
                    String given = userAnswers.get(ansIdx).getAnswer() != null
                            ? userAnswers.get(ansIdx).getAnswer().trim().toUpperCase() : "";
                    if (expected.equals(given)) correct++;
                    ansIdx++;
                }
            }
        }
        return new int[]{correct, total};
    }

    /** Part 4 Listening: coordinates - is_example=false, so sánh màu (word) */
    private int[] scoreListeningPart4(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || userAnswers == null) return new int[]{0, 0};
        JsonNode coords = part.path("coordinates");
        int correct = 0, total = 0, ansIdx = 0;
        for (JsonNode coord : coords) {
            if (!coord.path("is_example").asBoolean(false)) {
                total++;
                if (ansIdx < userAnswers.size()) {
                    String expected = coord.path("word").asText("").trim().toLowerCase();
                    String given = normalize(userAnswers.get(ansIdx).getAnswer());
                    if (expected.equals(given)) correct++;
                    ansIdx++;
                }
            }
        }
        return new int[]{correct, total};
    }

    // -------------------------------------------------------
    // Helper: Tính điểm từng Part Reading
    // -------------------------------------------------------
    private ExamResultResponse.PartScoreDetail calculateReadingScore(
            JsonNode readingNode, Map<String, List<ExamSubmitRequest.PartAnswer>> answers) {

        if (answers == null) return emptyPartScore();

        // Part 1: Right/Wrong - so sánh status
        var p1 = scoreReadingPart1(readingNode.path("part1"), answers.get("part1"));
        // Part 2: Yes/No
        var p2 = scoreReadingPart2(readingNode.path("part2"), answers.get("part2"));
        // Part 3: Sắp xếp chữ cái - gõ từ đúng
        var p3 = scoreReadingPart3(readingNode.path("part3"), answers.get("part3"));
        // Part 4: Điền từ vào đoạn văn
        var p4 = scoreReadingPart4(readingNode.path("part4"), answers.get("part4"));
        // Part 5: Trả lời câu hỏi ngắn theo cụm ảnh
        var p5 = scoreReadingPart5(readingNode.path("part5"), answers.get("part5"));

        return ExamResultResponse.PartScoreDetail.builder()
                .part1Correct(p1[0]).part1Total(p1[1])
                .part2Correct(p2[0]).part2Total(p2[1])
                .part3Correct(p3[0]).part3Total(p3[1])
                .part4Correct(p4[0]).part4Total(p4[1])
                .part5Correct(p5[0]).part5Total(p5[1])
                .build();
    }

    /** Part 1 Reading: array of questions, status=right/wrong */
    private int[] scoreReadingPart1(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || !part.isArray() || userAnswers == null) return new int[]{0, 0};
        int correct = 0, total = 0, ansIdx = 0;
        for (JsonNode q : part) {
            if (!q.path("is_example").asBoolean(false)) {
                total++;
                if (ansIdx < userAnswers.size()) {
                    String expected = q.path("status").asText("").trim().toLowerCase();
                    String given = normalize(userAnswers.get(ansIdx).getAnswer());
                    if (expected.equals(given)) correct++;
                    ansIdx++;
                }
            }
        }
        return new int[]{correct, total};
    }

    /** Part 2 Reading: object with questions, status=yes/no */
    private int[] scoreReadingPart2(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || userAnswers == null) return new int[]{0, 0};
        JsonNode questions = part.path("questions");
        int correct = 0, total = 0, ansIdx = 0;
        for (JsonNode q : questions) {
            if (!q.path("is_example").asBoolean(false)) {
                total++;
                if (ansIdx < userAnswers.size()) {
                    String expected = q.path("status").asText("").trim().toLowerCase();
                    String given = normalize(userAnswers.get(ansIdx).getAnswer());
                    if (expected.equals(given)) correct++;
                    ansIdx++;
                }
            }
        }
        return new int[]{correct, total};
    }

    /** Part 3 Reading: array of {word, img_url}, is_example=false - user gõ từ */
    private int[] scoreReadingPart3(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || !part.isArray() || userAnswers == null) return new int[]{0, 0};
        int correct = 0, total = 0, ansIdx = 0;
        for (JsonNode q : part) {
            if (!q.path("is_example").asBoolean(false)) {
                total++;
                if (ansIdx < userAnswers.size()) {
                    String expected = q.path("word").asText("").trim().toLowerCase();
                    String given = normalize(userAnswers.get(ansIdx).getAnswer());
                    if (expected.equals(given)) correct++;
                    ansIdx++;
                }
            }
        }
        return new int[]{correct, total};
    }

    /** Part 4 Reading: {text, options, answers} - user điền từ vào vị trí (1)...(5) */
    private int[] scoreReadingPart4(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || userAnswers == null) return new int[]{0, 0};
        JsonNode answers = part.path("answers");
        int correct = 0, total = 0;
        // Mỗi PartAnswer có position (1-5) và answer
        for (JsonNode ans : answers) {
            int pos = ans.path("position").asInt(0);
            String expected = ans.path("word").asText("").trim().toLowerCase();
            total++;
            // Tìm câu trả lời của user theo position
            for (ExamSubmitRequest.PartAnswer ua : userAnswers) {
                if (ua.getPosition() != null && ua.getPosition() == pos) {
                    String given = normalize(ua.getAnswer());
                    if (expected.equals(given)) correct++;
                    break;
                }
            }
        }
        return new int[]{correct, total};
    }

    /** Part 5 Reading: array of {img_url, questions[]} - grouped */
    private int[] scoreReadingPart5(JsonNode part, List<ExamSubmitRequest.PartAnswer> userAnswers) {
        if (part.isMissingNode() || !part.isArray() || userAnswers == null) return new int[]{0, 0};
        System.out.println("----- DEBUG SCORE PART 5 -----");
        System.out.println("userAnswers size: " + userAnswers.size());
        for (ExamSubmitRequest.PartAnswer ua : userAnswers) {
             System.out.println("UA: groupIndex=" + ua.getGroupIndex() + " qIndex=" + ua.getQuestionIndex() + " ans=" + ua.getAnswer());
        }

        int correct = 0, total = 0;
        for (int gi = 0; gi < part.size(); gi++) {
            JsonNode group = part.get(gi);
            JsonNode questions = group.path("questions");
            for (int qi = 0; qi < questions.size(); qi++) {
                JsonNode q = questions.get(qi);
                if (!q.path("is_example").asBoolean(false)) {
                    total++;
                    String expected = (q.has("keyword") ? q.path("keyword") : q.path("answer")).asText("").trim().toLowerCase();
                    System.out.println("Expected [" + gi + "-" + qi + "]: " + expected);
                    
                    // Dùng loop thường để kiểm tra và gán biến correct
                    for (ExamSubmitRequest.PartAnswer ua : userAnswers) {
                        if (ua.getGroupIndex() != null && ua.getGroupIndex().equals(gi)
                                && ua.getQuestionIndex() != null && ua.getQuestionIndex().equals(qi)) {
                            System.out.println("  Match found for [" + gi + "-" + qi + "], given: " + ua.getAnswer() + ", expected: " + expected);
                            if (expected.equals(normalize(ua.getAnswer()))) {
                                correct++;
                                System.out.println("  -> CORRECT!");
                            } else {
                                System.out.println("  -> WRONG!");
                            }
                            break;
                        }
                    }
                }
            }
        }
        System.out.println("Total correct: " + correct + "/" + total);
        return new int[]{correct, total};
    }

    // -------------------------------------------------------
    // Helper: Quy đổi điểm Listening -> Khiên
    // -------------------------------------------------------
    private int calcListeningShields(int score) {
        if (score >= 18) return 5;
        if (score >= 16) return 4;
        if (score >= 13) return 3;
        if (score >= 11) return 2;
        return 1;
    }

    // -------------------------------------------------------
    // Helper: Quy đổi điểm Reading -> Khiên
    // -------------------------------------------------------
    private int calcReadingShields(int score) {
        if (score >= 21) return 5;
        if (score >= 19) return 4;
        if (score >= 16) return 3;
        if (score >= 13) return 2;
        return 1;
    }

    // -------------------------------------------------------
    // Helper: Tổng số câu đúng từ PartScoreDetail
    // -------------------------------------------------------
    private int sumCorrect(ExamResultResponse.PartScoreDetail d, boolean includeP5) {
        int sum = safe(d.getPart1Correct()) + safe(d.getPart2Correct())
                + safe(d.getPart3Correct()) + safe(d.getPart4Correct());
        if (includeP5) sum += safe(d.getPart5Correct());
        return sum;
    }

    private int safe(Integer v) { return v != null ? v : 0; }

    private String normalize(String s) {
        return s != null ? s.trim().toLowerCase() : "";
    }

    private ExamResultResponse.PartScoreDetail emptyPartScore() {
        return ExamResultResponse.PartScoreDetail.builder()
                .part1Correct(0).part1Total(0)
                .part2Correct(0).part2Total(0)
                .part3Correct(0).part3Total(0)
                .part4Correct(0).part4Total(0)
                .part5Correct(0).part5Total(0)
                .build();
    }

    // -------------------------------------------------------
    // Mapper: Entity -> DTO
    // -------------------------------------------------------
    private ExamSummaryResponse toSummary(Exam e) {
        return ExamSummaryResponse.builder()
                .id(e.getId())
                .examType(e.getExamType() != null ? e.getExamType().name() : null)
                .title(e.getTitle())
                .description(e.getDescription())
                .level(e.getLevel())
                .listeningDuration(e.getListeningDuration())
                .readingDuration(e.getReadingDuration())
                .totalListeningQuestions(e.getTotalListeningQuestions())
                .totalReadingQuestions(e.getTotalReadingQuestions())
                .build();
    }

    private ExamDetailResponse toDetail(Exam e) {
        return ExamDetailResponse.builder()
                .id(e.getId())
                .examType(e.getExamType() != null ? e.getExamType().name() : null)
                .title(e.getTitle())
                .description(e.getDescription())
                .level(e.getLevel())
                .listeningDuration(e.getListeningDuration())
                .readingDuration(e.getReadingDuration())
                .totalListeningQuestions(e.getTotalListeningQuestions())
                .totalReadingQuestions(e.getTotalReadingQuestions())
                .listeningPayload(e.getListeningPayload())
                .readingPayload(e.getReadingPayload())
                .build();
    }
}
