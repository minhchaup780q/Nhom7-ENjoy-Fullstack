package com.example.learningservice.services.impl;

import com.example.learningservice.dto.*;
import com.example.learningservice.entities.*;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.entities.enums.SessionType;
import com.example.learningservice.repositories.*;
import com.example.learningservice.services.PlacementTestService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlacementTestServiceImpl implements PlacementTestService {

    private final TopicRepository topicRepository;
    private final PartRepository partRepository;
    private final PartVocabularyRepository partVocabularyRepository;
    private final SessionRepository sessionRepository;
    private final UserProgressRepository userProgressRepository;
    private final PlacementTestHistoryRepository placementTestHistoryRepository;
    private final PlacementTestDetailRepository placementTestDetailRepository;
    private final ObjectMapper objectMapper;

    private static final String DEFAULT_S3_TEST_URL =
            "https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/placement_test.json";

    private final RestTemplate restTemplate = new RestTemplate();
    private volatile S3PlacementTestDto cachedS3Test = null;

    /**
     * Đọc file JSON đề thi từ S3 và cache vào RAM.
     */
    public S3PlacementTestDto getS3PlacementTest() {
        if (cachedS3Test != null) {
            return cachedS3Test;
        }
        synchronized (this) {
            if (cachedS3Test != null) {
                return cachedS3Test;
            }
            try {
                log.info("Fetching placement test JSON from S3: {}", DEFAULT_S3_TEST_URL);
                ResponseEntity<String> response = restTemplate.getForEntity(DEFAULT_S3_TEST_URL, String.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    cachedS3Test = objectMapper.readValue(response.getBody(), S3PlacementTestDto.class);
                    log.info("Loaded and cached S3 placement test: testId={}, rounds={}",
                            cachedS3Test.getTestId(),
                            cachedS3Test.getRounds() != null ? cachedS3Test.getRounds().size() : 0);
                }
            } catch (Exception e) {
                log.error("Failed to fetch placement test from S3: {}", e.getMessage(), e);
            }
            return cachedS3Test;
        }
    }

    // ==============================================================
    // 1. GENERATE TEST (Giữ lại để tương thích nếu BE được gọi)
    // ==============================================================
    @Override
    public PlacementTestDto generateTest() {
        List<Topic> topics = topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc();

        List<PlacementTestDto.VocabRoundQuestion> vocabRound = new ArrayList<>();
        List<PlacementTestDto.GrammarRoundQuestion> grammarRound = new ArrayList<>();
        List<PlacementTestDto.SpeakingRoundQuestion> speakingRound = new ArrayList<>();

        for (Topic topic : topics) {
            if (topic.getParts() == null || topic.getParts().isEmpty()) continue;

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

            String grammarName = findGrammarName(topic);
            if (grammarName != null) {
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
        boolean isNewFormat = (request.getTestId() != null && !request.getTestId().isBlank())
                || (request.getRound1Answers() != null && !request.getRound1Answers().isEmpty())
                || (request.getRound2Answers() != null && !request.getRound2Answers().isEmpty())
                || (request.getRound3Answers() != null && !request.getRound3Answers().isEmpty());

        if (isNewFormat) {
            return submitS3Test(userId, request);
        } else {
            return submitLegacyTest(userId, request);
        }
    }

    /**
     * Chấm bài nộp định dạng mới 3 vòng (so khớp với S3 JSON cache trong RAM).
     */
    private PlacementTestResultResponse submitS3Test(Long userId, PlacementTestSubmitRequest request) {
        S3PlacementTestDto s3Test = getS3PlacementTest();

        // Tạo bảng tra cứu nhanh câu hỏi từ S3
        Map<String, S3PlacementTestDto.QuestionDto> s3Questions = new HashMap<>();
        if (s3Test != null && s3Test.getRounds() != null) {
            for (S3PlacementTestDto.RoundDto round : s3Test.getRounds()) {
                if (round.getQuestions() != null) {
                    for (S3PlacementTestDto.QuestionDto q : round.getQuestions()) {
                        if (q.getQuestionId() != null) {
                            s3Questions.put(q.getQuestionId(), q);
                        }
                    }
                }
            }
        }

        List<QuestionGradingRecord> gradingRecords = new ArrayList<>();

        // ---- Chấm vòng 1: Nghe chọn ảnh (LISTEN_AND_CHOOSE_IMAGE) ----
        int r1Correct = 0;
        int r1Total = request.getRound1Answers() != null ? request.getRound1Answers().size() : 0;
        List<PlacementTestResultResponse.Round1Mistake> r1Mistakes = new ArrayList<>();

        if (request.getRound1Answers() != null) {
            for (PlacementTestSubmitRequest.Round1Answer ans : request.getRound1Answers()) {
                S3PlacementTestDto.QuestionDto s3Q = s3Questions.get(ans.getQuestionId());
                String expected = (s3Q != null && s3Q.getCorrectAnswer() != null) ? s3Q.getCorrectAnswer().trim() : "";
                String given = ans.getSelectedOptionId() != null ? ans.getSelectedOptionId().trim() : "";
                boolean isCorrect = !expected.isEmpty() && expected.equalsIgnoreCase(given);

                if (isCorrect) {
                    r1Correct++;
                } else {
                    r1Mistakes.add(PlacementTestResultResponse.Round1Mistake.builder()
                            .questionId(ans.getQuestionId())
                            .topic(ans.getTopic())
                            .selectedOptionId(ans.getSelectedOptionId())
                            .correctOptionId(expected)
                            .build());
                }

                gradingRecords.add(new QuestionGradingRecord(
                        1, ans.getQuestionId(), ans.getTopic(), expected, given, isCorrect
                ));
            }
        }

        // ---- Chấm vòng 2: Nối từ với nghĩa (MATCH_PAIR) ----
        int r2Correct = 0;
        int r2Total = request.getRound2Answers() != null ? request.getRound2Answers().size() : 0;
        List<PlacementTestResultResponse.Round2Mistake> r2Mistakes = new ArrayList<>();

        if (request.getRound2Answers() != null) {
            for (PlacementTestSubmitRequest.Round2Answer ans : request.getRound2Answers()) {
                S3PlacementTestDto.QuestionDto s3Q = s3Questions.get(ans.getQuestionId());
                String expectedMeaning = (s3Q != null && s3Q.getMeaning() != null) ? s3Q.getMeaning().trim() : "";
                String givenMeaning = ans.getSelectedMeaning() != null ? ans.getSelectedMeaning().trim() : "";
                boolean isCorrect = !expectedMeaning.isEmpty() && expectedMeaning.equalsIgnoreCase(givenMeaning);

                if (isCorrect) {
                    r2Correct++;
                } else {
                    r2Mistakes.add(PlacementTestResultResponse.Round2Mistake.builder()
                            .questionId(ans.getQuestionId())
                            .topic(ans.getTopic())
                            .word(ans.getWord())
                            .selectedMeaning(ans.getSelectedMeaning())
                            .correctMeaning(expectedMeaning)
                            .build());
                }

                gradingRecords.add(new QuestionGradingRecord(
                        2, ans.getQuestionId(), ans.getTopic(), (ans.getWord() + " = " + expectedMeaning), givenMeaning, isCorrect
                ));
            }
        }

        // ---- Chấm vòng 3: Ghép câu (SENTENCE_BUILDER) ----
        int r3Correct = 0;
        int r3Total = request.getRound3Answers() != null ? request.getRound3Answers().size() : 0;
        List<PlacementTestResultResponse.Round3Mistake> r3Mistakes = new ArrayList<>();

        if (request.getRound3Answers() != null) {
            for (PlacementTestSubmitRequest.Round3Answer ans : request.getRound3Answers()) {
                S3PlacementTestDto.QuestionDto s3Q = s3Questions.get(ans.getQuestionId());
                String expectedSentence = (s3Q != null && s3Q.getSentence() != null) ? s3Q.getSentence() : "";
                String userSentence = ans.getUserSentence() != null ? ans.getUserSentence() : "";
                boolean isCorrect = normalizeSentence(expectedSentence).equalsIgnoreCase(normalizeSentence(userSentence));

                if (isCorrect) {
                    r3Correct++;
                } else {
                    r3Mistakes.add(PlacementTestResultResponse.Round3Mistake.builder()
                            .questionId(ans.getQuestionId())
                            .topic(ans.getTopic())
                            .userSentence(ans.getUserSentence())
                            .correctSentence(expectedSentence)
                            .build());
                }

                gradingRecords.add(new QuestionGradingRecord(
                        3, ans.getQuestionId(), ans.getTopic(), expectedSentence, userSentence, isCorrect
                ));
            }
        }

        // Lưu thông tin tổng quan vào DB
        LocalDateTime now = LocalDateTime.now();
        PlacementTestHistory history = PlacementTestHistory.builder()
                .userId(userId)
                .totalQuestions(r1Total + r2Total + r3Total)
                .vocabCorrect(r1Correct)
                .vocabTotal(r1Total)
                .grammarCorrect(r2Correct)
                .grammarTotal(r2Total)
                .speakingCorrect(r3Correct)
                .speakingTotal(r3Total)
                .completedAt(now)
                .build();
        history.setCreateAt(now);
        history.setUpdateAt(now);
        history = placementTestHistoryRepository.save(history);

        // Lưu chi tiết từng câu trả lời vào placement_test_details
        List<PlacementTestDetail> details = new ArrayList<>();
        for (QuestionGradingRecord rec : gradingRecords) {
            PlacementTestDetail d = PlacementTestDetail.builder()
                    .history(history)
                    .round(rec.round)
                    .topicTitle(rec.topic)
                    .correctAnswer(rec.correctAnswer)
                    .userAnswer(rec.userAnswer)
                    .isCorrect(rec.isCorrect)
                    .build();
            d.setCreateAt(now);
            d.setUpdateAt(now);
            details.add(d);
        }
        placementTestDetailRepository.saveAll(details);

        // Áp dụng cơ chế bỏ qua Topic (Skip Topic) nếu làm đúng 100% câu hỏi thuộc Topic đó
        List<String> skippedTopics = applySkippedProgressByTopic(userId, gradingRecords);

        return PlacementTestResultResponse.builder()
                .historyId(history.getId())
                .totalQuestions(r1Total + r2Total + r3Total)
                .totalCorrect(r1Correct + r2Correct + r3Correct)
                .skippedTopics(skippedTopics)
                .round1Result(PlacementTestResultResponse.Round1Result.builder()
                        .correct(r1Correct)
                        .total(r1Total)
                        .mistakes(r1Mistakes)
                        .build())
                .round2Result(PlacementTestResultResponse.Round2Result.builder()
                        .correct(r2Correct)
                        .total(r2Total)
                        .mistakes(r2Mistakes)
                        .build())
                .round3Result(PlacementTestResultResponse.Round3Result.builder()
                        .correct(r3Correct)
                        .total(r3Total)
                        .mistakes(r3Mistakes)
                        .build())
                .build();
    }

    /**
     * Logic skip topic:
     * - Vòng 1, 2: so sánh trường topic với title của part trong DB.
     * - Vòng 3: so sánh trường topic với title của session thứ 6 (GRAMMAR) trong DB.
    /**
     * Logic skip theo từng Phần (Part) của Topic:
     * - Vòng 1, 2 (Từ vựng): nếu làm đúng -> Skip toàn bộ sessions từ vựng (orderIndex 1-5).
     * - Vòng 3 (Ngữ pháp / câu): nếu làm đúng -> Skip toàn bộ sessions ngữ pháp (orderIndex 6-10).
     * - Không bắt buộc phải đúng cả Topic mới skip: đúng phần nào thì ẩn và miễn học phần đó.
     * - Nếu đúng cả 2 phần (hoặc topic không có ngữ pháp) -> Ẩn toàn bộ Topic.
     */
    private List<String> applySkippedProgressByTopic(Long userId, List<QuestionGradingRecord> gradingRecords) {
        List<String> skippedTopics = new ArrayList<>();
        if (gradingRecords.isEmpty()) return skippedTopics;

        List<Topic> allTopics = topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc();
        if (allTopics.isEmpty()) return skippedTopics;

        Map<Long, TopicPartEvaluation> evalMap = new LinkedHashMap<>();
        for (Topic topic : allTopics) {
            evalMap.put(topic.getId(), new TopicPartEvaluation(topic));
        }

        // Map câu hỏi sang Topic trong DB và phân loại theo Vocab (Vòng 1, 2) vs Grammar (Vòng 3)
        for (QuestionGradingRecord rec : gradingRecords) {
            Topic matchedTopic = findMatchingTopic(allTopics, rec.round, rec.topic);
            if (matchedTopic != null) {
                TopicPartEvaluation eval = evalMap.get(matchedTopic.getId());
                if (eval != null) {
                    if (rec.round == 1 || rec.round == 2) {
                        eval.vocabTotal++;
                        if (rec.isCorrect) eval.vocabCorrect++;
                    } else if (rec.round == 3) {
                        eval.grammarTotal++;
                        if (rec.isCorrect) eval.grammarCorrect++;
                    }
                }
            }
        }

        LocalDateTime now = LocalDateTime.now();
        for (TopicPartEvaluation eval : evalMap.values()) {
            Topic topic = eval.topic;
            List<Part> parts = partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topic.getId());

            boolean passVocab = (eval.vocabTotal > 0 && eval.vocabCorrect == eval.vocabTotal);
            boolean passGrammar = (eval.grammarTotal > 0 && eval.grammarCorrect == eval.grammarTotal);

            // Kiểm tra xem topic có session ngữ pháp nào không
            boolean hasGrammarSessions = false;
            for (Part part : parts) {
                List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
                for (Session s : sessions) {
                    if (isGrammarSession(s)) {
                        hasGrammarSessions = true;
                        break;
                    }
                }
                if (hasGrammarSessions) break;
            }

            // 1. Nếu pass phần Từ vựng: Skip tất cả sessions từ vựng (orderIndex 1-5)
            if (passVocab) {
                log.info("User {} passed Vocab part for Topic '{}' (id={}). Marking sessions 1-5 as SKIPPED.",
                        userId, topic.getTitle(), topic.getId());
                for (Part part : parts) {
                    List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
                    for (Session s : sessions) {
                        if (isVocabSession(s)) {
                            saveSkippedSession(userId, s, now);
                        }
                    }
                }
            }

            // 2. Nếu pass phần Ngữ pháp: Skip tất cả sessions ngữ pháp (orderIndex 6-10)
            if (passGrammar) {
                log.info("User {} passed Grammar part for Topic '{}' (id={}). Marking sessions 6-10 as SKIPPED.",
                        userId, topic.getTitle(), topic.getId());
                for (Part part : parts) {
                    List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
                    for (Session s : sessions) {
                        if (isGrammarSession(s)) {
                            saveSkippedSession(userId, s, now);
                        }
                    }
                }
            }

            // Ghi nhận phản hồi cho màn hình kết quả
            if (passVocab && (passGrammar || !hasGrammarSessions)) {
                skippedTopics.add(topic.getTitle() + " (Đã miễn toàn bộ chủ đề)");
            } else if (passVocab) {
                skippedTopics.add(topic.getTitle() + " (Đã miễn phần Từ vựng)");
            } else if (passGrammar) {
                skippedTopics.add(topic.getTitle() + " (Đã miễn phần Ngữ pháp)");
            }
        }

        return skippedTopics;
    }

    private boolean isVocabSession(Session s) {
        if (s == null) return false;
        if (s.getOrderIndex() != null && s.getOrderIndex() <= 5) return true;
        SessionType type = s.getSessionType();
        return type == SessionType.FLASHCARD || type == SessionType.MATCH_WORD
                || type == SessionType.SPEAKING || type == SessionType.RE_ORDER || type == SessionType.DRAG_DROP;
    }

    private boolean isGrammarSession(Session s) {
        if (s == null) return false;
        if (s.getOrderIndex() != null && s.getOrderIndex() >= 6) return true;
        SessionType type = s.getSessionType();
        return type == SessionType.GRAMMAR || type == SessionType.FILL_IN_BLANK
                || type == SessionType.RE_ORDER_SENTENCE || type == SessionType.SPEAKING_SENTENCE || type == SessionType.CONVERSATION;
    }

    private void saveSkippedSession(Long userId, Session session, LocalDateTime now) {
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
        } else {
            UserProgress prog = existing.get();
            prog.setStatus(SessionStatus.SKIPPED);
            prog.setCompletedAt(now);
            prog.setUpdateAt(now);
            userProgressRepository.save(prog);
        }
    }

    private Topic findMatchingTopic(List<Topic> allTopics, int round, String questionTopic) {
        if (questionTopic == null || questionTopic.isBlank()) return null;
        String cleanQ = normalizeString(questionTopic);

        for (Topic topic : allTopics) {
            List<Part> parts = partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topic.getId());

            // Vòng 1 & 2: so sánh với title của part
            if (round == 1 || round == 2) {
                for (Part part : parts) {
                    String cleanPart = normalizeString(part.getTitle());
                    if (isFuzzyMatch(cleanQ, cleanPart)) {
                        return topic;
                    }
                }
                // Fallback nếu so trực tiếp với topic.title
                if (isFuzzyMatch(cleanQ, normalizeString(topic.getTitle()))) {
                    return topic;
                }
            } else if (round == 3) {
                // Vòng 3: so sánh với title của session số 6 (GRAMMAR)
                for (Part part : parts) {
                    List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId());
                    for (Session s : sessions) {
                        if (s.getSessionType() == SessionType.GRAMMAR || (s.getOrderIndex() != null && s.getOrderIndex() == 6)) {
                            String grammarTitle = extractGrammarTitle(s);
                            if (isFuzzyMatch(cleanQ, normalizeString(grammarTitle))) {
                                return topic;
                            }
                        }
                    }
                }
                // Fallback so với topic.title
                if (isFuzzyMatch(cleanQ, normalizeString(topic.getTitle()))) {
                    return topic;
                }
            }
        }
        return null;
    }

    private boolean isFuzzyMatch(String a, String b) {
        if (a.isEmpty() || b.isEmpty()) return false;
        if (a.equals(b)) return true;
        if (a.equals(b + "s") || (a + "s").equals(b)) return true;
        if (a.equals(b + "es") || (a + "es").equals(b)) return true;
        if (a.contains(b) || b.contains(a)) return true;
        return false;
    }

    private String normalizeString(String s) {
        if (s == null) return "";
        String res = s.trim().toLowerCase();
        if (res.startsWith("grammar:")) {
            res = res.substring("grammar:".length()).trim();
        }
        return res.replaceAll("[^a-zA-Z0-9 ]", "").replaceAll("\\s+", " ").trim();
    }

    private String normalizeSentence(String s) {
        if (s == null) return "";
        return s.trim().toLowerCase()
                .replaceAll("[?.!,;:\"']", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String extractGrammarTitle(Session grammarSession) {
        if (grammarSession.getPayload() != null) {
            try {
                JsonNode root = objectMapper.readTree(grammarSession.getPayload());
                JsonNode titleNode = root.get("title");
                if (titleNode != null && !titleNode.isNull()) {
                    return titleNode.asText();
                }
            } catch (Exception ignored) {}
        }
        return grammarSession.getTitle() != null ? grammarSession.getTitle() : "";
    }

    // ==============================================================
    // LEGACY SUBMIT TEST
    // ==============================================================
    private PlacementTestResultResponse submitLegacyTest(Long userId, PlacementTestSubmitRequest request) {
        List<PlacementTestResultResponse.TopicVocabMistake> vocabMistakes = new ArrayList<>();
        int vocabCorrect = 0;
        int vocabTotal = request.getVocabAnswers() != null ? request.getVocabAnswers().size() : 0;
        Map<Long, List<String>> wrongVocabByTopic = new LinkedHashMap<>();

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
            }
        }

        int grammarCorrect = 0;
        int grammarTotal = request.getGrammarAnswers() != null ? request.getGrammarAnswers().size() : 0;
        List<PlacementTestResultResponse.GrammarMistake> grammarMistakes = new ArrayList<>();
        if (request.getGrammarAnswers() != null) {
            for (PlacementTestSubmitRequest.GrammarAnswer ans : request.getGrammarAnswers()) {
                String correct = ans.getCorrectSentence() != null ? ans.getCorrectSentence().trim().toLowerCase() : "";
                String user = ans.getUserSentence() != null ? ans.getUserSentence().trim().toLowerCase() : "";
                if (correct.equals(user)) {
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

        int speakingCorrect = 0;
        int speakingTotal = request.getSpeakingAnswers() != null ? request.getSpeakingAnswers().size() : 0;
        List<PlacementTestResultResponse.SpeakingMistake> speakingMistakes = new ArrayList<>();
        if (request.getSpeakingAnswers() != null) {
            for (PlacementTestSubmitRequest.SpeakingAnswer ans : request.getSpeakingAnswers()) {
                boolean isCorrect = ans.getScore() != null && ans.getScore() >= 60.0f;
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

        LocalDateTime now = LocalDateTime.now();
        PlacementTestHistory history = PlacementTestHistory.builder()
                .userId(userId)
                .totalQuestions(vocabTotal + grammarTotal + speakingTotal)
                .vocabCorrect(vocabCorrect)
                .vocabTotal(vocabTotal)
                .grammarCorrect(grammarCorrect)
                .grammarTotal(grammarTotal)
                .speakingCorrect(speakingCorrect)
                .speakingTotal(speakingTotal)
                .completedAt(now)
                .build();
        history.setCreateAt(now);
        history.setUpdateAt(now);
        history = placementTestHistoryRepository.save(history);

        return PlacementTestResultResponse.builder()
                .historyId(history.getId())
                .totalQuestions(vocabTotal + grammarTotal + speakingTotal)
                .totalCorrect(vocabCorrect + grammarCorrect + speakingCorrect)
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
                    } catch (Exception ignored) {}
                    return s.getTitle();
                }
            }
        }
        return null;
    }

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
                    } catch (Exception ignored) {}
                    return sentences;
                }
            }
        }
        return sentences;
    }

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
                    } catch (Exception ignored) {}
                }
            }
        }
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

    private static class QuestionGradingRecord {
        int round;
        String questionId;
        String topic;
        String correctAnswer;
        String userAnswer;
        boolean isCorrect;

        QuestionGradingRecord(int round, String questionId, String topic, String correctAnswer, String userAnswer, boolean isCorrect) {
            this.round = round;
            this.questionId = questionId;
            this.topic = topic;
            this.correctAnswer = correctAnswer;
            this.userAnswer = userAnswer;
            this.isCorrect = isCorrect;
        }
    }

    private static class TopicPartEvaluation {
        Topic topic;
        int vocabTotal = 0;
        int vocabCorrect = 0;
        int grammarTotal = 0;
        int grammarCorrect = 0;

        TopicPartEvaluation(Topic topic) {
            this.topic = topic;
        }
    }
}
