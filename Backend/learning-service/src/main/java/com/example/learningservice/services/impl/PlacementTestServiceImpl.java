package com.example.learningservice.services.impl;

import com.example.learningservice.dto.PlacementTestDto;
import com.example.learningservice.dto.PlacementTestResultResponse;
import com.example.learningservice.dto.PlacementTestSubmitRequest;
import com.example.learningservice.entities.*;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.entities.enums.SessionType;
import com.example.learningservice.repositories.*;
import com.example.learningservice.services.PlacementTestService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlacementTestServiceImpl implements PlacementTestService {

    private final TopicRepository topicRepository;
    private final PartVocabularyRepository partVocabularyRepository;
    private final SessionRepository sessionRepository;
    private final UserProgressRepository userProgressRepository;
    private final PlacementTestHistoryRepository placementTestHistoryRepository;
    private final PlacementTestDetailRepository placementTestDetailRepository;
    private final ObjectMapper objectMapper;

    /** Ngưỡng điểm speaking để coi là "đúng" */
    private static final float SPEAKING_PASS_SCORE = 60.0f;

    // ==============================================================
    // 1. GENERATE TEST
    // ==============================================================
    @Override
    public PlacementTestDto generateTest() {
        List<Topic> topics = topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc();

        List<PlacementTestDto.VocabRoundQuestion> vocabRound = new ArrayList<>();
        List<PlacementTestDto.GrammarRoundQuestion> grammarRound = new ArrayList<>();
        List<PlacementTestDto.SpeakingRoundQuestion> speakingRound = new ArrayList<>();

        for (Topic topic : topics) {
            if (topic.getParts() == null || topic.getParts().isEmpty()) continue;

            // ---- Vòng 1: Từ vựng - lấy 2 từ random từ toàn bộ vocab của topic ----
            List<PartVocabulary> allTopicVocabs = new ArrayList<>();
            for (Part part : topic.getParts()) {
                allTopicVocabs.addAll(partVocabularyRepository.findByPartIdOrderByOrderIndexAsc(part.getId()));
            }
            Collections.shuffle(allTopicVocabs);
            List<PartVocabulary> selectedVocabs = allTopicVocabs.stream().limit(2).collect(Collectors.toList());
            for (PartVocabulary pv : selectedVocabs) {
                if (pv.getVocabulary() == null) continue;
                vocabRound.add(PlacementTestDto.VocabRoundQuestion.builder()
                        .vocabularyId(pv.getVocabulary().getId())
                        .topicId(topic.getId())
                        .topicTitle(topic.getTitle())
                        .word(pv.getVocabulary().getWord())
                        .translation(pv.getVocabulary().getTranslation())
                        .build());
            }

            // ---- Vòng 2: Ngữ pháp - lấy 2 câu random từ session RE_ORDER_SENTENCE ----
            String grammarName = findGrammarName(topic);
            if (grammarName != null) {
                // Topic có session Grammar => tham gia vòng 2
                List<String> sentences = extractReorderSentences(topic);
                Collections.shuffle(sentences);
                List<String> selectedSentences = sentences.stream().limit(2).collect(Collectors.toList());
                for (String sentence : selectedSentences) {
                    grammarRound.add(PlacementTestDto.GrammarRoundQuestion.builder()
                            .topicId(topic.getId())
                            .topicTitle(topic.getTitle())
                            .sentence(sentence)
                            .grammarName(grammarName)
                            .build());
                }
            }

            // ---- Vòng 3: Speaking - ưu tiên session SPEAKING_SENTENCE, fallback vocab ----
            PlacementTestDto.SpeakingRoundQuestion speakingQuestion = extractSpeakingQuestion(topic, allTopicVocabs);
            if (speakingQuestion != null) {
                speakingRound.add(speakingQuestion);
            }
        }

        return PlacementTestDto.builder()
                .vocabRound(vocabRound)
                .grammarRound(grammarRound)
                .speakingRound(speakingRound)
                .build();
    }

    // ==============================================================
    // 2. SUBMIT TEST
    // ==============================================================
    @Override
    @Transactional
    public PlacementTestResultResponse submitTest(Long userId, PlacementTestSubmitRequest request) {
        // ---- Chấm vòng 1: Từ vựng ----
        List<PlacementTestResultResponse.TopicVocabMistake> vocabMistakes = new ArrayList<>();
        int vocabCorrect = 0;
        int vocabTotal = request.getVocabAnswers() != null ? request.getVocabAnswers().size() : 0;

        // Gom sai theo topicId
        Map<Long, List<String>> wrongVocabByTopic = new LinkedHashMap<>();
        Map<Long, String> topicTitleMap = new LinkedHashMap<>();

        if (request.getVocabAnswers() != null) {
            for (PlacementTestSubmitRequest.VocabAnswer ans : request.getVocabAnswers()) {
                boolean isCorrect = ans.getCorrectTranslation() != null &&
                        ans.getCorrectTranslation().trim().equalsIgnoreCase(
                                ans.getSelectedTranslation() != null ? ans.getSelectedTranslation().trim() : "");
                if (isCorrect) {
                    vocabCorrect++;
                } else {
                    wrongVocabByTopic
                            .computeIfAbsent(ans.getTopicId(), k -> new ArrayList<>())
                            .add(ans.getWord());
                }
                topicTitleMap.put(ans.getTopicId(), "Topic " + ans.getTopicId()); // fallback
            }
        }

        for (Map.Entry<Long, List<String>> entry : wrongVocabByTopic.entrySet()) {
            vocabMistakes.add(PlacementTestResultResponse.TopicVocabMistake.builder()
                    .topicId(entry.getKey())
                    .topicTitle(topicTitleMap.getOrDefault(entry.getKey(), "Topic " + entry.getKey()))
                    .wrongWords(entry.getValue())
                    .build());
        }

        // ---- Chấm vòng 2: Ngữ pháp ----
        List<PlacementTestResultResponse.GrammarMistake> grammarMistakes = new ArrayList<>();
        int grammarCorrect = 0;
        int grammarTotal = request.getGrammarAnswers() != null ? request.getGrammarAnswers().size() : 0;

        if (request.getGrammarAnswers() != null) {
            for (PlacementTestSubmitRequest.GrammarAnswer ans : request.getGrammarAnswers()) {
                String correct = ans.getCorrectSentence() != null ? ans.getCorrectSentence().trim().toLowerCase() : "";
                String user = ans.getUserSentence() != null ? ans.getUserSentence().trim().toLowerCase() : "";
                boolean isCorrect = correct.equals(user);
                if (isCorrect) {
                    grammarCorrect++;
                } else {
                    grammarMistakes.add(PlacementTestResultResponse.GrammarMistake.builder()
                            .topicId(ans.getTopicId())
                            .wrongSentence(ans.getUserSentence())
                            .correctSentence(ans.getCorrectSentence())
                            .grammarName(ans.getGrammarName())
                            .build());
                }
            }
        }

        // ---- Chấm vòng 3: Speaking ----
        List<PlacementTestResultResponse.SpeakingMistake> speakingMistakes = new ArrayList<>();
        int speakingCorrect = 0;
        int speakingTotal = request.getSpeakingAnswers() != null ? request.getSpeakingAnswers().size() : 0;

        if (request.getSpeakingAnswers() != null) {
            for (PlacementTestSubmitRequest.SpeakingAnswer ans : request.getSpeakingAnswers()) {
                boolean isCorrect = ans.getScore() != null && ans.getScore() >= SPEAKING_PASS_SCORE;
                if (isCorrect) {
                    speakingCorrect++;
                } else {
                    speakingMistakes.add(PlacementTestResultResponse.SpeakingMistake.builder()
                            .topicId(ans.getTopicId())
                            .sentence(ans.getSentence())
                            .recognizedText(ans.getRecognizedText())
                            .score(ans.getScore())
                            .build());
                }
            }
        }

        // ---- Nhận xét Speaking ----
        double wrongRate = speakingTotal > 0 ? (double)(speakingTotal - speakingCorrect) / speakingTotal : 0.0;
        String speakingComment;
        if (wrongRate > 0.4) {
            speakingComment = "Kĩ năng nói còn yếu, cần luyện thêm nhiều hơn";
        } else if (wrongRate > 0.2) {
            speakingComment = "Kĩ năng nói khá - Cần cải thiện thêm";
        } else {
            speakingComment = "Kĩ năng nói tốt nhưng cần luyện thêm để đạt kết quả tốt hơn";
        }

        // ---- Lưu lịch sử vào DB ----
        PlacementTestHistory history = PlacementTestHistory.builder()
                .userId(userId)
                .totalQuestions(vocabTotal + grammarTotal + speakingTotal)
                .vocabCorrect(vocabCorrect)
                .vocabTotal(vocabTotal)
                .grammarCorrect(grammarCorrect)
                .grammarTotal(grammarTotal)
                .speakingCorrect(speakingCorrect)
                .speakingTotal(speakingTotal)
                .completedAt(LocalDateTime.now())
                .build();
        history.setCreateAt(LocalDateTime.now());
        history.setUpdateAt(LocalDateTime.now());
        history = placementTestHistoryRepository.save(history);

        // Lưu chi tiết từng câu
        saveDetails(history, request, wrongVocabByTopic, grammarMistakes, speakingMistakes);

        // ---- Tạo lộ trình: gắn SKIPPED cho các topic đã pass ----
        applySkippedProgress(userId, request, wrongVocabByTopic, grammarMistakes);

        return PlacementTestResultResponse.builder()
                .historyId(history.getId())
                .vocabResult(PlacementTestResultResponse.VocabResult.builder()
                        .correct(vocabCorrect)
                        .total(vocabTotal)
                        .mistakes(vocabMistakes)
                        .build())
                .grammarResult(PlacementTestResultResponse.GrammarResult.builder()
                        .correct(grammarCorrect)
                        .total(grammarTotal)
                        .mistakes(grammarMistakes)
                        .build())
                .speakingResult(PlacementTestResultResponse.SpeakingResult.builder()
                        .correct(speakingCorrect)
                        .total(speakingTotal)
                        .wrongRate(wrongRate)
                        .overallComment(speakingComment)
                        .mistakes(speakingMistakes)
                        .build())
                .build();
    }

    @Override
    public boolean hasCompletedPlacementTest(Long userId) {
        return placementTestHistoryRepository.existsByUserId(userId);
    }

    // ==============================================================
    // PRIVATE HELPERS
    // ==============================================================

    /**
     * Tìm tên Grammar của topic (từ session có order_index=6, type=GRAMMAR).
     * Lấy field "title" bên trong payload JSON.
     */
    private String findGrammarName(Topic topic) {
        if (topic.getParts() == null) return null;
        for (Part part : topic.getParts()) {
            List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
            for (Session s : sessions) {
                if (s.getSessionType() == SessionType.GRAMMAR && s.getPayload() != null) {
                    try {
                        JsonNode root = objectMapper.readTree(s.getPayload());
                        JsonNode titleNode = root.get("title");
                        if (titleNode != null && !titleNode.isNull()) {
                            return titleNode.asText();
                        }
                    } catch (Exception e) {
                        log.debug("Error parsing GRAMMAR payload for topic {}: {}", topic.getId(), e.getMessage());
                    }
                    // Fallback: dùng title của session
                    return s.getTitle();
                }
            }
        }
        return null; // Topic không có Grammar session => bỏ qua vòng 2
    }

    /**
     * Lấy danh sách câu từ session RE_ORDER_SENTENCE của topic.
     */
    private List<String> extractReorderSentences(Topic topic) {
        List<String> sentences = new ArrayList<>();
        if (topic.getParts() == null) return sentences;
        for (Part part : topic.getParts()) {
            List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
            for (Session s : sessions) {
                if (s.getSessionType() == SessionType.RE_ORDER_SENTENCE && s.getPayload() != null) {
                    try {
                        JsonNode root = objectMapper.readTree(s.getPayload());
                        JsonNode items = root.get("items");
                        if (items != null && items.isArray()) {
                            for (JsonNode item : items) {
                                JsonNode sentenceNode = item.get("sentence");
                                if (sentenceNode != null && !sentenceNode.isNull()) {
                                    sentences.add(sentenceNode.asText());
                                }
                            }
                        }
                    } catch (Exception e) {
                        log.debug("Error parsing RE_ORDER_SENTENCE payload: {}", e.getMessage());
                    }
                    // Lấy từ session đầu tiên tìm được thôi
                    return sentences;
                }
            }
        }
        return sentences;
    }

    /**
     * Lấy 1 câu speaking cho topic.
     * Ưu tiên session SPEAKING_SENTENCE (vòng 9), fallback lấy từ vựng.
     */
    private PlacementTestDto.SpeakingRoundQuestion extractSpeakingQuestion(Topic topic, List<PartVocabulary> allVocabs) {
        if (topic.getParts() == null) return null;
        for (Part part : topic.getParts()) {
            List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
            for (Session s : sessions) {
                if (s.getSessionType() == SessionType.SPEAKING_SENTENCE && s.getPayload() != null) {
                    try {
                        JsonNode root = objectMapper.readTree(s.getPayload());
                        JsonNode items = root.get("items");
                        if (items != null && items.isArray() && items.size() > 0) {
                            // Lấy random 1 câu
                            int idx = new Random().nextInt(items.size());
                            JsonNode item = items.get(idx);
                            String sentence = item.has("sentence") ? item.get("sentence").asText() : null;
                            if (sentence != null) {
                                return PlacementTestDto.SpeakingRoundQuestion.builder()
                                        .topicId(topic.getId())
                                        .topicTitle(topic.getTitle())
                                        .sentence(sentence)
                                        .vocabularyId(null)
                                        .build();
                            }
                        }
                    } catch (Exception e) {
                        log.debug("Error parsing SPEAKING_SENTENCE payload: {}", e.getMessage());
                    }
                }
            }
        }
        // Fallback: lấy từ vựng đầu tiên làm câu speaking
        if (!allVocabs.isEmpty()) {
            Collections.shuffle(allVocabs);
            PartVocabulary pv = allVocabs.get(0);
            if (pv.getVocabulary() != null) {
                return PlacementTestDto.SpeakingRoundQuestion.builder()
                        .topicId(topic.getId())
                        .topicTitle(topic.getTitle())
                        .sentence(pv.getVocabulary().getWord())
                        .vocabularyId(pv.getVocabulary().getId())
                        .build();
            }
        }
        return null;
    }

    /**
     * Lưu chi tiết từng câu trả lời vào bảng placement_test_details.
     */
    private void saveDetails(PlacementTestHistory history,
                             PlacementTestSubmitRequest request,
                             Map<Long, List<String>> wrongVocabByTopic,
                             List<PlacementTestResultResponse.GrammarMistake> grammarMistakes,
                             List<PlacementTestResultResponse.SpeakingMistake> speakingMistakes) {
        List<PlacementTestDetail> details = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // Vòng 1
        if (request.getVocabAnswers() != null) {
            for (PlacementTestSubmitRequest.VocabAnswer ans : request.getVocabAnswers()) {
                boolean isCorrect = ans.getCorrectTranslation() != null &&
                        ans.getCorrectTranslation().trim().equalsIgnoreCase(
                                ans.getSelectedTranslation() != null ? ans.getSelectedTranslation().trim() : "");
                PlacementTestDetail d = PlacementTestDetail.builder()
                        .history(history)
                        .round(1)
                        .topicId(ans.getTopicId())
                        .vocabularyId(ans.getVocabularyId())
                        .correctAnswer(ans.getWord() + " = " + ans.getCorrectTranslation())
                        .userAnswer(ans.getSelectedTranslation())
                        .isCorrect(isCorrect)
                        .build();
                d.setCreateAt(now);
                d.setUpdateAt(now);
                details.add(d);
            }
        }

        // Vòng 2
        if (request.getGrammarAnswers() != null) {
            for (PlacementTestSubmitRequest.GrammarAnswer ans : request.getGrammarAnswers()) {
                String correct = ans.getCorrectSentence() != null ? ans.getCorrectSentence().trim().toLowerCase() : "";
                String user = ans.getUserSentence() != null ? ans.getUserSentence().trim().toLowerCase() : "";
                PlacementTestDetail d = PlacementTestDetail.builder()
                        .history(history)
                        .round(2)
                        .topicId(ans.getTopicId())
                        .correctAnswer(ans.getCorrectSentence())
                        .userAnswer(ans.getUserSentence())
                        .isCorrect(correct.equals(user))
                        .grammarName(ans.getGrammarName())
                        .build();
                d.setCreateAt(now);
                d.setUpdateAt(now);
                details.add(d);
            }
        }

        // Vòng 3
        if (request.getSpeakingAnswers() != null) {
            for (PlacementTestSubmitRequest.SpeakingAnswer ans : request.getSpeakingAnswers()) {
                boolean isCorrect = ans.getScore() != null && ans.getScore() >= SPEAKING_PASS_SCORE;
                PlacementTestDetail d = PlacementTestDetail.builder()
                        .history(history)
                        .round(3)
                        .topicId(ans.getTopicId())
                        .correctAnswer(ans.getSentence())
                        .userAnswer(ans.getRecognizedText())
                        .isCorrect(isCorrect)
                        .speakingScore(ans.getScore())
                        .build();
                d.setCreateAt(now);
                d.setUpdateAt(now);
                details.add(d);
            }
        }

        placementTestDetailRepository.saveAll(details);
    }

    /**
     * Tạo UserProgress SKIPPED cho các session của topic mà user đã pass.
     *
     * Logic:
     * - Nếu user làm ĐÚNG HẾT từ vựng của topic đó => SKIPPED sessions orderIndex 1-5 (FLASHCARD->DRAG_DROP).
     * - Nếu user làm ĐÚNG HẾT câu grammar của topic đó => SKIPPED sessions orderIndex 6-10 (GRAMMAR->CONVERSATION).
     * - Nếu cả 2 đều pass => SKIPPED toàn bộ topic (ẩn luôn).
     */
    private void applySkippedProgress(Long userId,
                                      PlacementTestSubmitRequest request,
                                      Map<Long, List<String>> wrongVocabByTopic,
                                      List<PlacementTestResultResponse.GrammarMistake> grammarMistakes) {
        // Tập hợp topicId có từ vựng sai
        Set<Long> failedVocabTopics = wrongVocabByTopic.keySet();
        // Tập hợp topicId có grammar sai
        Set<Long> failedGrammarTopics = grammarMistakes.stream()
                .map(PlacementTestResultResponse.GrammarMistake::getTopicId)
                .collect(Collectors.toSet());

        // Tập hợp topicId xuất hiện trong bài test
        Set<Long> allTestedVocabTopics = request.getVocabAnswers() != null
                ? request.getVocabAnswers().stream().map(PlacementTestSubmitRequest.VocabAnswer::getTopicId).collect(Collectors.toSet())
                : Set.of();
        Set<Long> allTestedGrammarTopics = request.getGrammarAnswers() != null
                ? request.getGrammarAnswers().stream().map(PlacementTestSubmitRequest.GrammarAnswer::getTopicId).collect(Collectors.toSet())
                : Set.of();

        // Topic có từ vựng pass = được test nhưng không sai
        Set<Long> passedVocabTopics = new HashSet<>(allTestedVocabTopics);
        passedVocabTopics.removeAll(failedVocabTopics);

        // Topic có grammar pass = được test nhưng không sai
        Set<Long> passedGrammarTopics = new HashSet<>(allTestedGrammarTopics);
        passedGrammarTopics.removeAll(failedGrammarTopics);

        List<Topic> allTopics = topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc();
        LocalDateTime now = LocalDateTime.now();

        for (Topic topic : allTopics) {
            boolean vocabPassed = passedVocabTopics.contains(topic.getId());
            boolean grammarPassed = passedGrammarTopics.contains(topic.getId());
            // Topic không được test gram => không được "pass" grammar
            // Nhưng nếu không có RE_ORDER_SENTENCE => grammar không có session 6-10 meaningful => để user học bình thường

            if (!vocabPassed && !grammarPassed) continue;

            if (topic.getParts() == null) continue;

            for (Part part : topic.getParts()) {
                List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
                for (Session session : sessions) {
                    int orderIdx = session.getOrderIndex() != null ? session.getOrderIndex() : 0;
                    boolean shouldSkip = (vocabPassed && orderIdx >= 1 && orderIdx <= 5)
                                      || (grammarPassed && orderIdx >= 6 && orderIdx <= 10);

                    if (!shouldSkip) continue;

                    // Chỉ tạo nếu chưa có UserProgress cho session này
                    Optional<UserProgress> existing = userProgressRepository.findByUserIdAndSessionId(userId, session.getId());
                    if (existing.isEmpty()) {
                        UserProgress skipped = UserProgress.builder()
                                .userId(userId)
                                .session(session)
                                .status(SessionStatus.SKIPPED)
                                .completedAt(now)
                                .durationSeconds(0)
                                .build();
                        skipped.setCreateAt(now);
                        skipped.setUpdateAt(now);
                        userProgressRepository.save(skipped);
                    }
                }
            }
        }
    }
}
