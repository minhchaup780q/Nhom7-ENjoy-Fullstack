package com.example.learningservice.services;

import com.example.learningservice.dto.SaveAiChallengeRequest;
import com.example.learningservice.dto.TopicWeakWordDetailDto;
import com.example.learningservice.dto.VocabAiChallengeDto;
import com.example.learningservice.dto.VocabStatsResponse;
import com.example.learningservice.entities.UserVocabularyTracking;
import com.example.learningservice.entities.VocabPracticeAiChallenge;
import com.example.learningservice.entities.Vocabulary;
import com.example.learningservice.entities.enums.VocabTrackingStatus;
import com.example.learningservice.repositories.MockVocabularyRepository;
import com.example.learningservice.repositories.UserVocabularyTrackingRepository;
import com.example.learningservice.repositories.VocabPracticeAiChallengeRepository;
import com.example.learningservice.repositories.VocabularyRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service xử lý toàn bộ logic tracking và thống kê từ vựng.
 * Được gọi sau khi chấm điểm bài thi xong.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VocabularyTrackingService {

    private final UserVocabularyTrackingRepository trackingRepository;
    private final MockVocabularyRepository mockVocabularyRepository;

    // =========================================================
    // Hàm chính: gọi sau khi nộp bài thi
    // =========================================================

    /**
     * Xử lý cập nhật tracking dựa trên danh sách từ đúng/sai.
     * Quy tắc:
     *  - wrongWords: Nếu từ thuộc 1 topic -> INSERT với WEAK (hoặc cập nhật WEAK nếu đã có).
     *  - correctWords: Nếu từ đã có record trong DB -> cập nhật thành CORRECT.
     *
     * @param userId       ID của user
     * @param wrongWords   Danh sách các từ làm sai
     * @param correctWords Danh sách các từ làm đúng
     * @return Map: topic -> danh sách các từ sai THUỘC topic đó (để hiển thị trên result page)
     */
    @Transactional
    public Map<String, List<String>> processExamResult(
            Long userId,
            List<String> wrongWords,
            List<String> correctWords,
            Map<String, String> wordImages) {
        Map<String, List<String>> wrongByTopic = new LinkedHashMap<>();

        // Tìm trước trong Vocabulary table để lấy ảnh/nghĩa nếu có
        List<String> allCleanWords = wrongWords.stream()
                .map(this::normalize)
                .filter(w -> !w.isEmpty())
                .distinct()
                .toList();

        Map<String, Vocabulary> vocabMap = Collections.emptyMap();
        if (!allCleanWords.isEmpty()) {
            List<Vocabulary> vocabList = vocabularyRepository.findByWordInIgnoreCase(allCleanWords);
            vocabMap = vocabList.stream()
                    .collect(Collectors.toMap(v -> normalize(v.getWord()), v -> v, (a, b) -> a));
        }

        // 1. Xử lý từ sai
        for (String rawWord : wrongWords) {
            String word = normalize(rawWord);
            if (word.isEmpty()) continue;

            String topic = mockVocabularyRepository.findTopicByWord(word);
            if (topic == null) continue; // Từ không thuộc topic nào -> bỏ qua

            // Xác định ảnh từ exam hoặc từ bảng vocabularies
            String imgUrl = (wordImages != null) ? wordImages.get(word) : null;
            if ((imgUrl == null || imgUrl.isBlank()) && vocabMap.containsKey(word)) {
                imgUrl = vocabMap.get(word).getImageUrl();
            }

            // Lưu vào DB
            Optional<UserVocabularyTracking> existing = trackingRepository.findByUserIdAndWord(userId, word);
            if (existing.isPresent()) {
                // Đã có bản ghi -> luôn set về WEAK (dù trước đó CORRECT hay WEAK)
                UserVocabularyTracking record = existing.get();
                record.setStatus(VocabTrackingStatus.WEAK);
                if (imgUrl != null && !imgUrl.isBlank()) {
                    record.setImageUrl(imgUrl);
                }
                record.setUpdatedAt(LocalDateTime.now());
                trackingRepository.save(record);
            } else {
                // Chưa có -> insert mới
                trackingRepository.save(UserVocabularyTracking.builder()
                        .userId(userId)
                        .word(word)
                        .topic(topic)
                        .imageUrl(imgUrl)
                        .status(VocabTrackingStatus.WEAK)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());
            }

            // Gom vào map để trả về cho result page
            wrongByTopic.computeIfAbsent(topic, k -> new ArrayList<>()).add(word);
        }

        // 2. Xử lý từ đúng: chỉ cập nhật nếu từ đó ĐÃ CÓ bản ghi (từng sai trước)
        for (String rawWord : correctWords) {
            String word = normalize(rawWord);
            if (word.isEmpty()) continue;

            trackingRepository.findByUserIdAndWord(userId, word).ifPresent(record -> {
                if (record.getStatus() == VocabTrackingStatus.WEAK) {
                    record.setStatus(VocabTrackingStatus.CORRECT);
                    record.setUpdatedAt(LocalDateTime.now());
                    trackingRepository.save(record);
                }
            });
        }

        return wrongByTopic;
    }

    @Transactional
    public Map<String, List<String>> processExamResult(Long userId, List<String> wrongWords, List<String> correctWords) {
        return processExamResult(userId, wrongWords, correctWords, Collections.emptyMap());
    }

    // =========================================================
    // Hàm thống kê cho trang Statistics
    // =========================================================

    /**
     * Lấy thống kê từ vựng của user để hiển thị trên trang thống kê.
     */
    public VocabStatsResponse getVocabStats(Long userId) {
        boolean hasHistory = trackingRepository.existsByUserId(userId);
        if (!hasHistory) {
            return VocabStatsResponse.builder()
                    .noExamHistory(true)
                    .topics(List.of())
                    .build();
        }

        List<Object[]> rows = trackingRepository.findTopicStatsByUserId(userId);

        // Lấy danh sách các từ WEAK để gắn vào mỗi topic
        List<UserVocabularyTracking> weakRecords = trackingRepository.findByUserIdAndStatus(userId, VocabTrackingStatus.WEAK);
        Map<String, List<String>> weakWordsByTopic = weakRecords.stream()
                .collect(Collectors.groupingBy(
                        UserVocabularyTracking::getTopic,
                        Collectors.mapping(UserVocabularyTracking::getWord, Collectors.toList())
                ));

        List<VocabStatsResponse.TopicStat> stats = rows.stream().map(row -> {
            String topic = (String) row[0];
            int weak = ((Number) row[1]).intValue();
            int correct = ((Number) row[2]).intValue();
            String status;
            if (weak == 0) {
                status = "Mastered";
            } else if (correct > 0) {
                status = "Developing";
            } else {
                status = "Weak";
            }
            List<String> weakWords = weakWordsByTopic.getOrDefault(topic, List.of());
            return VocabStatsResponse.TopicStat.builder()
                    .topicName(topic)
                    .weakCount(weak)
                    .correctCount(correct)
                    .status(status)
                    .weakWords(weakWords)
                    .build();
        }).collect(Collectors.toList());

        // Lấy 5 bài thi gần nhất để vẽ biểu đồ
        List<VocabStatsResponse.ExamHistoryStat> historyStats = examHistoryRepository
                .findByUserIdOrderByCompletedAtDesc(userId).stream()
                .sorted(Comparator.comparing(com.example.learningservice.entities.ExamHistory::getCompletedAt)) // Đảo ngược để vẽ timeline từ cũ đến mới
                .map(h -> VocabStatsResponse.ExamHistoryStat.builder()
                        .date(h.getCompletedAt() != null ? String.format("%02d/%02d", h.getCompletedAt().getDayOfMonth(), h.getCompletedAt().getMonthValue()) : "")
                        .listeningScore(h.getPartScoresPayload() != null ? extractScoreFromPayload(h.getPartScoresPayload(), "listening") : 0)
                        .readingScore(h.getPartScoresPayload() != null ? extractScoreFromPayload(h.getPartScoresPayload(), "reading") : 0)
                        .build())
                .collect(Collectors.toList());

        return VocabStatsResponse.builder()
                .noExamHistory(false)
                .topics(stats)
                .examHistories(historyStats)
                .build();
    }

    // =========================================================
    // Trích xuất từ vựng từ bài thi (gọi sau khi score xong)
    // =========================================================

    /**
     * Trích xuất từ vựng làm SAI từ Listening Part 2 (keyword).
     */
    public void extractListeningPart2(
            com.fasterxml.jackson.databind.JsonNode part,
            java.util.List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords,
            Map<String, String> wordImages) {

        if (part == null || part.isMissingNode() || userAnswers == null) return;
        String partImg = part.path("img_url").asText("").trim();
        com.fasterxml.jackson.databind.JsonNode questions = part.path("questions");
        int ansIdx = 0;
        for (com.fasterxml.jackson.databind.JsonNode q : questions) {
            if (!q.path("is_example").asBoolean(false)) {
                String expected = normalize(q.path("keyword").asText(""));
                if (!expected.isEmpty()) {
                    if (wordImages != null && !partImg.isEmpty()) {
                        wordImages.put(expected, partImg);
                    }
                    if (ansIdx < userAnswers.size()) {
                        String given = normalize(userAnswers.get(ansIdx).getAnswer());
                        if (expected.equals(given)) correctWords.add(expected);
                        else wrongWords.add(expected);
                        ansIdx++;
                    } else {
                        wrongWords.add(expected);
                    }
                }
            }
        }
    }

    public void extractListeningPart2(
            com.fasterxml.jackson.databind.JsonNode part,
            java.util.List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords) {
        extractListeningPart2(part, userAnswers, wrongWords, correctWords, null);
    }

    /**
     * Trích xuất từ vựng làm SAI từ Listening Part 4 (màu sắc).
     */
    public void extractListeningPart4(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords,
            Map<String, String> wordImages) {

        if (part == null || part.isMissingNode() || userAnswers == null) return;
        String partImg = part.path("img_url").asText("").trim();
        com.fasterxml.jackson.databind.JsonNode coords = part.path("coordinates");
        int ansIdx = 0;
        for (com.fasterxml.jackson.databind.JsonNode c : coords) {
            if (!c.path("is_example").asBoolean(false)) {
                String expected = normalize(c.path("word").asText(""));
                if (!expected.isEmpty()) {
                    if (wordImages != null && !partImg.isEmpty()) {
                        wordImages.put(expected, partImg);
                    }
                    if (ansIdx < userAnswers.size()) {
                        String given = normalize(userAnswers.get(ansIdx).getAnswer());
                        if (expected.equals(given)) correctWords.add(expected);
                        else wrongWords.add(expected);
                        ansIdx++;
                    } else {
                        wrongWords.add(expected);
                    }
                }
            }
        }
    }

    public void extractListeningPart4(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords) {
        extractListeningPart4(part, userAnswers, wrongWords, correctWords, null);
    }

    /**
     * Trích xuất từ vựng từ Reading Part 1 (từ cuối câu - keyword mô tả).
     * Câu dạng: "This is a cat." -> từ cuối là "cat."
     */
    public void extractReadingPart1(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords,
            Map<String, String> wordImages) {

        if (part == null || part.isMissingNode() || !part.isArray() || userAnswers == null) return;
        int ansIdx = 0;
        for (com.fasterxml.jackson.databind.JsonNode q : part) {
            if (!q.path("is_example").asBoolean(false)) {
                String question = q.path("question").asText("").trim();
                String expectedStatus = normalize(q.path("status").asText(""));
                String qImg = q.path("img_url").asText("").trim();
                if (qImg.isEmpty()) {
                    qImg = q.path("image_url").asText("").trim();
                }
                // Lấy từ cuối câu làm keyword
                String lastWord = extractLastWord(question);
                if (!lastWord.isEmpty()) {
                    if (wordImages != null && !qImg.isEmpty()) {
                        wordImages.put(lastWord, qImg);
                    }
                    if (ansIdx < userAnswers.size()) {
                        String givenStatus = normalize(userAnswers.get(ansIdx).getAnswer());
                        if (expectedStatus.equals(givenStatus)) correctWords.add(lastWord);
                        else wrongWords.add(lastWord);
                        ansIdx++;
                    } else {
                        wrongWords.add(lastWord);
                    }
                }
            }
        }
    }

    public void extractReadingPart1(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords) {
        extractReadingPart1(part, userAnswers, wrongWords, correctWords, null);
    }

    /**
     * Trích xuất từ vựng từ Reading Part 3 (gõ từ đúng).
     */
    public void extractReadingPart3(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords,
            Map<String, String> wordImages) {

        if (part == null || part.isMissingNode() || !part.isArray() || userAnswers == null) return;
        int ansIdx = 0;
        for (com.fasterxml.jackson.databind.JsonNode q : part) {
            if (!q.path("is_example").asBoolean(false)) {
                String expected = normalize(q.path("word").asText(""));
                String qImg = q.path("img_url").asText("").trim();
                if (qImg.isEmpty()) {
                    qImg = q.path("image_url").asText("").trim();
                }
                if (!expected.isEmpty()) {
                    if (wordImages != null && !qImg.isEmpty()) {
                        wordImages.put(expected, qImg);
                    }
                    if (ansIdx < userAnswers.size()) {
                        String given = normalize(userAnswers.get(ansIdx).getAnswer());
                        if (expected.equals(given)) correctWords.add(expected);
                        else wrongWords.add(expected);
                        ansIdx++;
                    } else {
                        wrongWords.add(expected);
                    }
                }
            }
        }
    }

    public void extractReadingPart3(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords) {
        extractReadingPart3(part, userAnswers, wrongWords, correctWords, null);
    }

    /**
     * Trích xuất từ vựng từ Reading Part 4 (điền từ vào đoạn văn).
     */
    public void extractReadingPart4(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords,
            Map<String, String> wordImages) {

        if (part == null || part.isMissingNode() || userAnswers == null) return;

        // Trích xuất hình ảnh từ danh sách options nếu có
        com.fasterxml.jackson.databind.JsonNode options = part.path("options");
        if (options.isArray() && wordImages != null) {
            for (com.fasterxml.jackson.databind.JsonNode opt : options) {
                String optWord = normalize(opt.path("word").asText(""));
                String optImg = opt.path("img_url").asText("").trim();
                if (optImg.isEmpty()) {
                    optImg = opt.path("image_url").asText("").trim();
                }
                if (!optWord.isEmpty() && !optImg.isEmpty()) {
                    wordImages.put(optWord, optImg);
                }
            }
        }

        com.fasterxml.jackson.databind.JsonNode answers = part.path("answers");
        for (com.fasterxml.jackson.databind.JsonNode ans : answers) {
            int pos = ans.path("position").asInt(0);
            String expected = normalize(ans.path("word").asText(""));
            if (expected.isEmpty()) continue;
            boolean found = false;
            for (com.example.learningservice.dto.ExamSubmitRequest.PartAnswer ua : userAnswers) {
                if (ua.getPosition() != null && ua.getPosition() == pos) {
                    String given = normalize(ua.getAnswer());
                    if (expected.equals(given)) correctWords.add(expected);
                    else wrongWords.add(expected);
                    found = true;
                    break;
                }
            }
            if (!found) wrongWords.add(expected);
        }
    }

    public void extractReadingPart4(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords) {
        extractReadingPart4(part, userAnswers, wrongWords, correctWords, null);
    }


    // =========================================================
    // Helper
    // =========================================================

    private String normalize(String s) {
        if (s == null) return "";
        return s.trim().toLowerCase()
                .replaceAll("[.,!?;:\"]$", "") // bỏ dấu câu cuối
                .trim();
    }

    /** Lấy từ cuối cùng trong câu, loại bỏ dấu câu */
    private String extractLastWord(String sentence) {
        if (sentence == null || sentence.isBlank()) return "";
        String[] tokens = sentence.trim().split("\\s+");
        if (tokens.length == 0) return "";
        return normalize(tokens[tokens.length - 1]);
    }
}
