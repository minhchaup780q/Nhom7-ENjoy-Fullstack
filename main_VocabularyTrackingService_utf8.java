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
 * Service xß╗¡ l├╜ to├án bß╗Ö logic tracking v├á thß╗æng k├¬ tß╗½ vß╗▒ng.
 * ─É╞░ß╗úc gß╗ìi sau khi chß║Ñm ─æiß╗âm b├ái thi xong.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VocabularyTrackingService {

    private final UserVocabularyTrackingRepository trackingRepository;
    private final MockVocabularyRepository mockVocabularyRepository;
    private final VocabularyRepository vocabularyRepository;
    private final VocabPracticeAiChallengeRepository aiChallengeRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // =========================================================
    // H├ám ch├¡nh: gß╗ìi sau khi nß╗Öp b├ái thi
    // =========================================================

    /**
     * Xß╗¡ l├╜ cß║¡p nhß║¡t tracking dß╗▒a tr├¬n danh s├ích tß╗½ ─æ├║ng/sai.
     * Quy tß║»c:
     *  - wrongWords: Nß║┐u tß╗½ thuß╗Öc 1 topic -> INSERT vß╗¢i WEAK (hoß║╖c cß║¡p nhß║¡t WEAK nß║┐u ─æ├ú c├│).
     *  - correctWords: Nß║┐u tß╗½ ─æ├ú c├│ record trong DB -> cß║¡p nhß║¡t th├ánh CORRECT.
     *
     * @param userId       ID cß╗ºa user
     * @param wrongWords   Danh s├ích c├íc tß╗½ l├ám sai
     * @param correctWords Danh s├ích c├íc tß╗½ l├ám ─æ├║ng
     * @return Map: topic -> danh s├ích c├íc tß╗½ sai THUß╗ÿC topic ─æ├│ (─æß╗â hiß╗ân thß╗ï tr├¬n result page)
     */
    @Transactional
    public Map<String, List<String>> processExamResult(
            Long userId,
            List<String> wrongWords,
            List<String> correctWords,
            Map<String, String> wordImages) {
        Map<String, List<String>> wrongByTopic = new LinkedHashMap<>();

        // T├¼m tr╞░ß╗¢c trong Vocabulary table ─æß╗â lß║Ñy ß║únh/ngh─⌐a nß║┐u c├│
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

        // 1. Xß╗¡ l├╜ tß╗½ sai
        for (String rawWord : wrongWords) {
            String word = normalize(rawWord);
            if (word.isEmpty()) continue;

            String topic = mockVocabularyRepository.findTopicByWord(word);
            if (topic == null) continue; // Tß╗½ kh├┤ng thuß╗Öc topic n├áo -> bß╗Å qua

            // X├íc ─æß╗ïnh ß║únh tß╗½ exam hoß║╖c tß╗½ bß║úng vocabularies
            String imgUrl = (wordImages != null) ? wordImages.get(word) : null;
            if ((imgUrl == null || imgUrl.isBlank()) && vocabMap.containsKey(word)) {
                imgUrl = vocabMap.get(word).getImageUrl();
            }

            // L╞░u v├áo DB
            Optional<UserVocabularyTracking> existing = trackingRepository.findByUserIdAndWord(userId, word);
            if (existing.isPresent()) {
                // ─É├ú c├│ bß║ún ghi -> lu├┤n set vß╗ü WEAK (d├╣ tr╞░ß╗¢c ─æ├│ CORRECT hay WEAK)
                UserVocabularyTracking record = existing.get();
                record.setStatus(VocabTrackingStatus.WEAK);
                if (imgUrl != null && !imgUrl.isBlank()) {
                    record.setImageUrl(imgUrl);
                }
                record.setUpdatedAt(LocalDateTime.now());
                trackingRepository.save(record);
            } else {
                // Ch╞░a c├│ -> insert mß╗¢i
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

            // Gom v├áo map ─æß╗â trß║ú vß╗ü cho result page
            wrongByTopic.computeIfAbsent(topic, k -> new ArrayList<>()).add(word);
        }

        // 2. Xß╗¡ l├╜ tß╗½ ─æ├║ng: chß╗ë cß║¡p nhß║¡t nß║┐u tß╗½ ─æ├│ ─É├â C├ô bß║ún ghi (tß╗½ng sai tr╞░ß╗¢c)
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
    // H├ám thß╗æng k├¬ cho trang Statistics
    // =========================================================

    /**
     * Lß║Ñy thß╗æng k├¬ tß╗½ vß╗▒ng cß╗ºa user ─æß╗â hiß╗ân thß╗ï tr├¬n trang thß╗æng k├¬.
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

        // Lß║Ñy danh s├ích c├íc tß╗½ WEAK ─æß╗â gß║»n v├áo mß╗ùi topic
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

        return VocabStatsResponse.builder()
                .noExamHistory(false)
                .topics(stats)
                .build();
    }

    // =========================================================
    // C├íc h├ám phß╗Ñc vß╗Ñ Luyß╗çn tß║¡p tß╗½ vß╗▒ng sai theo chß╗º ─æß╗ü
    // =========================================================

    /**
     * Lß║Ñy danh s├ích chi tiß║┐t c├íc tß╗½ sai cß╗ºa 1 topic k├¿m metadata h├¼nh ß║únh, ph├ít ├óm, ngh─⌐a tiß║┐ng Viß╗çt.
     */
    public List<TopicWeakWordDetailDto> getTopicWeakWords(Long userId, String topicName) {
        List<UserVocabularyTracking> weakRecords = trackingRepository.findByUserIdAndStatus(userId, VocabTrackingStatus.WEAK);

        List<UserVocabularyTracking> targetRecords = weakRecords.stream()
                .filter(r -> r.getTopic() != null && r.getTopic().equalsIgnoreCase(topicName.trim()))
                .toList();

        if (targetRecords.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> targetWords = targetRecords.stream()
                .map(UserVocabularyTracking::getWord)
                .map(this::normalize)
                .distinct()
                .toList();

        List<Vocabulary> vocabEntities = vocabularyRepository.findByWordInIgnoreCase(targetWords);
        Map<String, Vocabulary> vocabMap = vocabEntities.stream()
                .collect(Collectors.toMap(v -> normalize(v.getWord()), v -> v, (a, b) -> a));

        Map<String, String> trackingImageMap = targetRecords.stream()
                .filter(r -> r.getImageUrl() != null && !r.getImageUrl().isBlank())
                .collect(Collectors.toMap(r -> normalize(r.getWord()), UserVocabularyTracking::getImageUrl, (a, b) -> a));

        List<TopicWeakWordDetailDto> result = new ArrayList<>();
        long fallbackId = 1000L;
        for (String w : targetWords) {
            Vocabulary entity = vocabMap.get(w);
            String trackingImg = trackingImageMap.get(w);
            String finalImg = (trackingImg != null && !trackingImg.isBlank()) ? trackingImg : (entity != null ? entity.getImageUrl() : null);
            String translation = (entity != null && entity.getTranslation() != null && !entity.getTranslation().isBlank())
                    ? entity.getTranslation() : w;
            String audioUrl = entity != null ? entity.getAudioUrl() : null;

            result.add(TopicWeakWordDetailDto.builder()
                    .id(entity != null ? entity.getId() : fallbackId++)
                    .word(w)
                    .translation(translation)
                    .imageUrl(finalImg)
                    .audioUrl(audioUrl)
                    .topic(topicName)
                    .build());
        }
        return result;
    }


    /**
     * ─É├ính dß║Ñu ho├án th├ánh luyß╗çn tß║¡p cho 1 tß╗½ vß╗▒ng (chuyß╗ân WEAK -> CORRECT).
     */
    @Transactional
    public boolean completePracticeWord(Long userId, String word, String topic) {
        String cleanWord = normalize(word);
        if (cleanWord.isEmpty()) return false;

        Optional<UserVocabularyTracking> recordOpt = trackingRepository.findByUserIdAndWord(userId, cleanWord);
        if (recordOpt.isPresent()) {
            UserVocabularyTracking record = recordOpt.get();
            record.setStatus(VocabTrackingStatus.CORRECT);
            record.setUpdatedAt(LocalDateTime.now());
            trackingRepository.save(record);
            return true;
        } else {
            String resolvedTopic = (topic != null && !topic.isBlank()) ? topic : mockVocabularyRepository.findTopicByWord(cleanWord);
            if (resolvedTopic != null) {
                trackingRepository.save(UserVocabularyTracking.builder()
                        .userId(userId)
                        .word(cleanWord)
                        .topic(resolvedTopic)
                        .status(VocabTrackingStatus.CORRECT)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());
                return true;
            }
        }
        return false;
    }

    /**
     * Lß║Ñy c├óu hß╗Åi ngß╗» ph├íp AI ─æ├ú l╞░u cho tß╗½ vß╗▒ng cß╗ºa user (nß║┐u force=false).
     */
    public VocabAiChallengeDto getAiChallenge(Long userId, String word, boolean force) {
        if (force) return null;
        String cleanWord = normalize(word);
        return aiChallengeRepository.findFirstByUserIdAndWordOrderByUpdatedAtDesc(userId, cleanWord)
                .map(VocabAiChallengeDto::fromEntity)
                .orElse(null);
    }

    /**
     * L╞░u hoß║╖c cß║¡p nhß║¡t c├óu hß╗Åi ngß╗» ph├íp AI sinh ra cho tß╗½ vß╗▒ng cß╗ºa user.
     */
    @Transactional
    public VocabAiChallengeDto saveAiChallenge(SaveAiChallengeRequest req) {
        if (req == null || req.getUserId() == null || req.getWord() == null) return null;

        String cleanWord = normalize(req.getWord());
        Optional<VocabPracticeAiChallenge> existingOpt = aiChallengeRepository.findFirstByUserIdAndWordOrderByUpdatedAtDesc(req.getUserId(), cleanWord);

        String optionsJson = "[]";
        if (req.getOptions() != null) {
            try {
                optionsJson = objectMapper.writeValueAsString(req.getOptions());
            } catch (Exception ignored) {
            }
        }

        String blanksJson = "[]";
        if (req.getBlanks() != null) {
            try {
                blanksJson = objectMapper.writeValueAsString(req.getBlanks());
            } catch (Exception ignored) {
            }
        }

        VocabPracticeAiChallenge challenge = existingOpt.orElseGet(() -> VocabPracticeAiChallenge.builder()
                .userId(req.getUserId())
                .word(cleanWord)
                .createdAt(LocalDateTime.now())
                .build());

        challenge.setTopic(req.getTopic());
        challenge.setGrammarName(req.getGrammarName());
        challenge.setSentence(req.getSentence());
        challenge.setBlanksJson(blanksJson);
        challenge.setOptionsJson(optionsJson);
        challenge.setCorrectAnswer(req.getCorrectAnswer());
        challenge.setTranslation(req.getTranslation());
        challenge.setHint(req.getHint());
        challenge.setUpdatedAt(LocalDateTime.now());

        VocabPracticeAiChallenge saved = aiChallengeRepository.save(challenge);
        return VocabAiChallengeDto.fromEntity(saved);
    }

    // =========================================================
    // Tr├¡ch xuß║Ñt tß╗½ vß╗▒ng tß╗½ b├ái thi (gß╗ìi sau khi score xong)
    // =========================================================

    /**
     * Tr├¡ch xuß║Ñt tß╗½ vß╗▒ng l├ám SAI tß╗½ Listening Part 2 (keyword).
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
     * Tr├¡ch xuß║Ñt tß╗½ vß╗▒ng l├ám SAI tß╗½ Listening Part 4 (m├áu sß║»c).
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
     * Tr├¡ch xuß║Ñt tß╗½ vß╗▒ng tß╗½ Reading Part 1 (tß╗½ cuß╗æi c├óu - keyword m├┤ tß║ú).
     * C├óu dß║íng: "This is a cat." -> tß╗½ cuß╗æi l├á "cat."
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
                // Lß║Ñy tß╗½ cuß╗æi c├óu l├ám keyword
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
     * Tr├¡ch xuß║Ñt tß╗½ vß╗▒ng tß╗½ Reading Part 3 (g├╡ tß╗½ ─æ├║ng).
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
     * Tr├¡ch xuß║Ñt tß╗½ vß╗▒ng tß╗½ Reading Part 4 (─æiß╗ün tß╗½ v├áo ─æoß║ín v─ân).
     */
    public void extractReadingPart4(
            com.fasterxml.jackson.databind.JsonNode part,
            List<com.example.learningservice.dto.ExamSubmitRequest.PartAnswer> userAnswers,
            List<String> wrongWords, List<String> correctWords,
            Map<String, String> wordImages) {

        if (part == null || part.isMissingNode() || userAnswers == null) return;

        // Tr├¡ch xuß║Ñt h├¼nh ß║únh tß╗½ danh s├ích options nß║┐u c├│
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
                .replaceAll("[.,!?;:\"]$", "") // bß╗Å dß║Ñu c├óu cuß╗æi
                .trim();
    }

    /** Lß║Ñy tß╗½ cuß╗æi c├╣ng trong c├óu, loß║íi bß╗Å dß║Ñu c├óu */
    private String extractLastWord(String sentence) {
        if (sentence == null || sentence.isBlank()) return "";
        String[] tokens = sentence.trim().split("\\s+");
        if (tokens.length == 0) return "";
        return normalize(tokens[tokens.length - 1]);
    }
}
