package com.example.learningservice.services.impl;

import com.example.learningservice.dto.SkillComparisonResponse;
import com.example.learningservice.dto.UserStatsResponse;
import com.example.learningservice.entities.*;
import com.example.learningservice.entities.enums.MistakeStatus;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.entities.enums.SessionType;
import com.example.learningservice.repositories.MistakeRepository;
import com.example.learningservice.repositories.PartVocabularyRepository;
import com.example.learningservice.repositories.SessionRepository;
import com.example.learningservice.repositories.UserProgressRepository;
import com.example.learningservice.services.UserProgressService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProgressServiceImpl implements UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final SessionRepository sessionRepository;
    private final MistakeRepository mistakeRepository;
    private final PartVocabularyRepository partVocabularyRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<UserProgress> getUserProgress(Long userId) {
        return userProgressRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public UserProgress completeSession(Long userId, Long sessionId) {
        return completeSession(userId, sessionId, 300); // Mặc định 5 phút (300 giây)
    }

    @Override
    @Transactional
    public UserProgress completeSession(Long userId, Long sessionId, Integer durationSeconds) {
        Session currentSession = sessionRepository.findByIdAndIsDeleteFalse(sessionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học với ID: " + sessionId));

        // 1. Cập nhật tiến độ của session hiện tại thành FINISH
        UserProgress currentProgress = userProgressRepository
                .findByUserIdAndSessionId(userId, sessionId)
                .orElse(UserProgress.builder()
                        .userId(userId)
                        .session(currentSession)
                        .build());  

        currentProgress.setStatus(SessionStatus.FINISH);
        currentProgress.setCompletedAt(LocalDateTime.now());
        currentProgress.setDurationSeconds(durationSeconds != null && durationSeconds > 0 ? durationSeconds : 300);
        currentProgress.setUpdateAt(LocalDateTime.now());
        if (currentProgress.getCreateAt() == null) {
            currentProgress.setCreateAt(LocalDateTime.now());
        }

        UserProgress savedProgress = userProgressRepository.save(currentProgress);

        // 2. Tìm bài học tiếp theo trong cùng Part để UNLOCK
        List<Session> partSessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(currentSession.getPart().getId());
        int currentIndex = -1;
        for (int i = 0; i < partSessions.size(); i++) {
            if (partSessions.get(i).getId().equals(sessionId)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex != -1 && currentIndex < partSessions.size() - 1) {
            Session nextSession = partSessions.get(currentIndex + 1);
            Optional<UserProgress> nextProgressOpt = userProgressRepository.findByUserIdAndSessionId(userId, nextSession.getId());

            if (nextProgressOpt.isEmpty()) {
                UserProgress nextProgress = UserProgress.builder()
                        .userId(userId)
                        .session(nextSession)
                        .status(SessionStatus.UNLOCK)
                        .build();
                nextProgress.setCreateAt(LocalDateTime.now());
                nextProgress.setUpdateAt(LocalDateTime.now());
                userProgressRepository.save(nextProgress);
            }
        }

        return savedProgress;
    }

    @Override
    public UserStatsResponse getUserStats(Long userId) {
        // 1. Lấy tất cả bài học đã hoàn thành (FINISH) của user
        List<UserProgress> allFinished = userProgressRepository.findByUserIdAndStatus(userId, SessionStatus.FINISH);
        long totalCompleted = allFinished.size();

        // 2. Thống kê 7 ngày trong tuần hiện tại (Thứ 2 -> Chủ Nhật)
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        LocalDateTime startOfWeek = monday.atStartOfDay();
        LocalDateTime endOfWeek = sunday.atTime(LocalTime.MAX);

        // Gom nhóm thời lượng theo ngày (YYYY-MM-DD)
        Map<LocalDate, Integer> dailyMinutesMap = new HashMap<>();
        for (UserProgress up : allFinished) {
            LocalDateTime compTime = up.getCompletedAt() != null ? up.getCompletedAt()
                    : (up.getUpdateAt() != null ? up.getUpdateAt() : up.getCreateAt());
            if (compTime != null && !compTime.isBefore(startOfWeek) && !compTime.isAfter(endOfWeek)) {
                LocalDate compDate = compTime.toLocalDate();
                int seconds = up.getDurationSeconds() != null ? up.getDurationSeconds() : 300;
                int mins = Math.max(1, seconds / 60);
                dailyMinutesMap.put(compDate, dailyMinutesMap.getOrDefault(compDate, 0) + mins);
            }
        }

        String[] dayNames = {"Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"};
        List<UserStatsResponse.DailyStudyTimeDto> dailyList = new ArrayList<>();
        int weeklyTotalMins = 0;

        for (int i = 0; i < 7; i++) {
            LocalDate dayDate = monday.plusDays(i);
            int minutes = dailyMinutesMap.getOrDefault(dayDate, 0);
            weeklyTotalMins += minutes;

            dailyList.add(UserStatsResponse.DailyStudyTimeDto.builder()
                    .day(dayNames[i])
                    .date(dayDate.toString())
                    .minutes(minutes)
                    .targetMinutes(20)
                    .build());
        }

        // 3. Lịch sử các bài học gần nhất (sắp xếp thời gian giảm dần, tối đa 10 bài)
        List<UserProgress> sortedList = allFinished.stream()
                .sorted((a, b) -> {
                    LocalDateTime t1 = a.getCompletedAt() != null ? a.getCompletedAt() : a.getUpdateAt();
                    LocalDateTime t2 = b.getCompletedAt() != null ? b.getCompletedAt() : b.getUpdateAt();
                    if (t1 == null && t2 == null) return 0;
                    if (t1 == null) return 1;
                    if (t2 == null) return -1;
                    return t2.compareTo(t1);
                })
                .limit(10)
                .collect(Collectors.toList());

        List<UserStatsResponse.RecentSessionDto> recentSessions = new ArrayList<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");

        for (UserProgress up : sortedList) {
            Session s = up.getSession();
            String topicTitle = "";
            if (s != null && s.getPart() != null && s.getPart().getTopic() != null) {
                topicTitle = s.getPart().getTopic().getTitle();
            }

            int dur = up.getDurationSeconds() != null ? Math.max(1, up.getDurationSeconds() / 60) : 5;
            LocalDateTime compTime = up.getCompletedAt() != null ? up.getCompletedAt() : up.getUpdateAt();
            String compStr = compTime != null ? compTime.format(dtf) : "Gần đây";

            recentSessions.add(UserStatsResponse.RecentSessionDto.builder()
                    .id(s != null ? s.getId() : up.getId())
                    .title(s != null ? s.getTitle() : "Bài học")
                    .topic(topicTitle.isEmpty() ? "Bài học tiếng Anh" : "Chủ đề: " + topicTitle)
                    .completedAt(compStr)
                    .durationMinutes(dur)
                    .score(100)
                    .build());
        }

        return UserStatsResponse.builder()
                .totalCompletedLessons(totalCompleted)
                .weeklyStudyMinutes(weeklyTotalMins)
                .dailyStudyTime(dailyList)
                .recentSessions(recentSessions)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public SkillComparisonResponse getSkillComparisonStats(Long userId, LocalDate currentDate, LocalDate previousDate) {
        LocalDate curr = (currentDate != null) ? currentDate : LocalDate.now();
        LocalDate prev = (previousDate != null) ? previousDate : curr.minusDays(7);

        List<UserProgress> allFinished = userProgressRepository.findByUserIdAndStatus(userId, SessionStatus.FINISH);
        List<Mistake> allMistakes = mistakeRepository.findByUserId(userId);

        SkillComparisonResponse.SkillScoresDto currentScores = calculateSkillScoresAtDate(curr, allFinished, allMistakes);
        SkillComparisonResponse.SkillScoresDto previousScores = calculateSkillScoresAtDate(prev, allFinished, allMistakes);

        long masteredCount = allMistakes.stream()
                .filter(m -> m.getStatus() == MistakeStatus.MASTERED || (m.getCorrectStreakDays() != null && m.getCorrectStreakDays() >= 3))
                .count();

        return SkillComparisonResponse.builder()
                .currentDate(curr.toString())
                .previousDate(prev.toString())
                .currentSkills(currentScores)
                .previousSkills(previousScores)
                .totalCompletedLessons((long) allFinished.size())
                .totalMistakes((long) allMistakes.size())
                .masteredMistakes(masteredCount)
                .build();
    }

    private SkillComparisonResponse.SkillScoresDto calculateSkillScoresAtDate(
            LocalDate targetDate,
            List<UserProgress> allFinished,
            List<Mistake> allMistakes) {

        List<UserProgress> finishedByDate = allFinished.stream()
                .filter(up -> {
                    LocalDateTime comp = up.getCompletedAt() != null ? up.getCompletedAt()
                            : (up.getUpdateAt() != null ? up.getUpdateAt() : up.getCreateAt());
                    return comp != null && !comp.toLocalDate().isAfter(targetDate);
                })
                .collect(Collectors.toList());

        if (finishedByDate.isEmpty() && allMistakes.isEmpty()) {
            return SkillComparisonResponse.SkillScoresDto.builder()
                    .listening(0)
                    .speaking(0)
                    .reading(0)
                    .writing(0)
                    .vocabGrammar(0)
                    .grammar(0)
                    .build();
        }

        // Lọc danh sách mistakes trước hoặc trong targetDate
        List<Mistake> mistakesByDate = allMistakes.stream()
                .filter(m -> {
                    LocalDateTime mCreated = m.getCreatedAt() != null ? m.getCreatedAt() : m.getCreateAt();
                    return mCreated != null && !mCreated.toLocalDate().isAfter(targetDate);
                })
                .collect(Collectors.toList());

        // Gom nhóm lỗi sai của user trước hoặc trong targetDate theo key: vocabularyId_roundType hoặc wrongText_roundType
        Map<String, Mistake> mistakeMap = new HashMap<>();
        for (Mistake m : mistakesByDate) {
            if (m.getVocabulary() != null && m.getVocabulary().getId() != null) {
                String key = m.getVocabulary().getId() + "_" + m.getRoundType();
                mistakeMap.put(key, m);
            } else if (m.getWrongAnswerSubmitted() != null) {
                String key = m.getWrongAnswerSubmitted().trim().toLowerCase() + "_" + m.getRoundType();
                mistakeMap.put(key, m);
            }
        }

        double listeningScore = 0; int listeningCount = 0;
        double speakingScore = 0; int speakingCount = 0;
        double readingScore = 0; int readingCount = 0;
        double writingScore = 0; int writingCount = 0;
        double vocabScore = 0; int vocabCount = 0;
        double grammarScore = 0; int grammarCount = 0;

        for (UserProgress up : finishedByDate) {
            Session s = up.getSession();
            if (s == null || s.getSessionType() == null) continue;

            SessionType type = s.getSessionType();

            // Màn 1: Học từ vựng (FLASHCARD) -> không tính vào score
            if (type == SessionType.FLASHCARD) {
                continue;
            }

            Long partId = (s.getPart() != null) ? s.getPart().getId() : null;
            List<PartVocabulary> partVocabs = (partId != null)
                    ? partVocabularyRepository.findByPartIdOrderByOrderIndexAsc(partId)
                    : Collections.emptyList();

            switch (type) {
                case MATCH_WORD -> {
                    // Màn 2: Nối từ vựng -> tính vô điểm vocabulary (roundType = 2)
                    if (!partVocabs.isEmpty()) {
                        for (PartVocabulary pv : partVocabs) {
                            if (pv.getVocabulary() == null) continue;
                            Long vocabId = pv.getVocabulary().getId();
                            double itemScore = calculateItemScore(vocabId + "_2", mistakeMap, targetDate);
                            vocabScore += itemScore;
                            vocabCount++;
                        }
                    } else {
                        vocabScore += 1.0;
                        vocabCount++;
                    }
                }
                case SPEAKING -> {
                    // Màn 3: Speaking từ đơn -> tính điểm speaking (roundType = 3)
                    if (!partVocabs.isEmpty()) {
                        for (PartVocabulary pv : partVocabs) {
                            if (pv.getVocabulary() == null) continue;
                            Long vocabId = pv.getVocabulary().getId();
                            double itemScore = calculateItemScore(vocabId + "_3", mistakeMap, targetDate);
                            speakingScore += itemScore;
                            speakingCount++;
                        }
                    } else {
                        speakingScore += 1.0;
                        speakingCount++;
                    }
                }
                case RE_ORDER -> {
                    // Màn 4: Sắp xếp chữ cái -> tính vô writing (roundType = 4)
                    if (!partVocabs.isEmpty()) {
                        for (PartVocabulary pv : partVocabs) {
                            if (pv.getVocabulary() == null) continue;
                            Long vocabId = pv.getVocabulary().getId();
                            double itemScore = calculateItemScore(vocabId + "_4", mistakeMap, targetDate);
                            writingScore += itemScore;
                            writingCount++;
                        }
                    } else {
                        writingScore += 1.0;
                        writingCount++;
                    }
                }
                case DRAG_DROP -> {
                    // Màn 5: Nghe và kéo thả chữ vào toạ độ -> tính listening (roundType = 5)
                    int qCount = getDragDropQuestionCount(s.getPayload(), partVocabs.size());
                    for (int i = 0; i < qCount; i++) {
                        Long vocabId = (i < partVocabs.size() && partVocabs.get(i).getVocabulary() != null)
                                ? partVocabs.get(i).getVocabulary().getId() : null;
                        String key = (vocabId != null) ? (vocabId + "_5") : ("dragdrop_" + s.getId() + "_" + i);
                        double itemScore = calculateItemScore(key, mistakeMap, targetDate);
                        listeningScore += itemScore;
                        listeningCount++;
                    }
                }
                case GRAMMAR -> {
                    // Màn 6: Bỏ không tính vào reading
                }
                case FILL_IN_BLANK -> {
                    // Màn 7: Điền từ vào chỗ trống -> tính grammar (roundType = 7)
                    int qCount = getItemsQuestionCount(s.getPayload(), 6);
                    for (int i = 0; i < qCount; i++) {
                        Long vocabId = (i < partVocabs.size() && partVocabs.get(i).getVocabulary() != null)
                                ? partVocabs.get(i).getVocabulary().getId()
                                : (!partVocabs.isEmpty() && partVocabs.get(0).getVocabulary() != null ? partVocabs.get(0).getVocabulary().getId() : null);
                        String key = (vocabId != null) ? (vocabId + "_7") : ("fill_blank_" + s.getId() + "_" + i);
                        double itemScore = calculateItemScore(key, mistakeMap, targetDate);
                        grammarScore += itemScore;
                        grammarCount++;
                    }
                }
                case RE_ORDER_SENTENCE -> {
                    // Màn 8: Sắp xếp câu ngữ pháp -> tính grammar (roundType = 8)
                    int qCount = getItemsQuestionCount(s.getPayload(), 5);
                    for (int i = 0; i < qCount; i++) {
                        Long vocabId = (i < partVocabs.size() && partVocabs.get(i).getVocabulary() != null)
                                ? partVocabs.get(i).getVocabulary().getId()
                                : (!partVocabs.isEmpty() && partVocabs.get(0).getVocabulary() != null ? partVocabs.get(0).getVocabulary().getId() : null);
                        String key = (vocabId != null) ? (vocabId + "_8") : ("reorder_sentence_" + s.getId() + "_" + i);
                        double itemScore = calculateItemScore(key, mistakeMap, targetDate);
                        grammarScore += itemScore;
                        grammarCount++;
                    }
                }
                case SPEAKING_SENTENCE -> {
                    // Màn 9: Luyện nói câu -> tính speaking (roundType = 9)
                    int qCount = getItemsQuestionCount(s.getPayload(), 5);
                    for (int i = 0; i < qCount; i++) {
                        Long vocabId = (i < partVocabs.size() && partVocabs.get(i).getVocabulary() != null)
                                ? partVocabs.get(i).getVocabulary().getId()
                                : (!partVocabs.isEmpty() && partVocabs.get(0).getVocabulary() != null ? partVocabs.get(0).getVocabulary().getId() : null);
                        String key = (vocabId != null) ? (vocabId + "_9") : ("speaking_sentence_" + s.getId() + "_" + i);
                        double itemScore = calculateItemScore(key, mistakeMap, targetDate);
                        speakingScore += itemScore;
                        speakingCount++;
                    }
                }
                case CONVERSATION -> {
                    // Màn 10: Hội thoại đọc hiểu -> tính reading (roundType = 10)
                    int qCount = getItemsQuestionCount(s.getPayload(), 5);
                    for (int i = 0; i < qCount; i++) {
                        Long vocabId = (i < partVocabs.size() && partVocabs.get(i).getVocabulary() != null)
                                ? partVocabs.get(i).getVocabulary().getId()
                                : (!partVocabs.isEmpty() && partVocabs.get(0).getVocabulary() != null ? partVocabs.get(0).getVocabulary().getId() : null);
                        String key = (vocabId != null) ? (vocabId + "_10") : ("conversation_" + s.getId() + "_" + i);
                        double itemScore = calculateItemScore(key, mistakeMap, targetDate);
                        readingScore += itemScore;
                        readingCount++;
                    }
                }
            }
        }

        // Bổ sung: Nếu kỹ năng chưa có bài học FINISH từ lộ trình nhưng user có các câu sai trong bảng Mistake của vòng đó,
        // tính điểm kỹ năng đó dựa trên độ thành thạo masteryScore trung bình của các câu sai đó:
        if (vocabCount == 0) {
            List<Mistake> r2 = mistakesByDate.stream().filter(m -> m.getRoundType() != null && m.getRoundType() == 2).collect(Collectors.toList());
            if (!r2.isEmpty()) {
                vocabScore = r2.stream().mapToDouble(m -> m.getMasteryScore() != null ? m.getMasteryScore() : 0.0).sum();
                vocabCount = r2.size();
            }
        }
        if (speakingCount == 0) {
            List<Mistake> rSpeaking = mistakesByDate.stream().filter(m -> m.getRoundType() != null && (m.getRoundType() == 3 || m.getRoundType() == 9)).collect(Collectors.toList());
            if (!rSpeaking.isEmpty()) {
                speakingScore = rSpeaking.stream().mapToDouble(m -> m.getMasteryScore() != null ? m.getMasteryScore() : 0.0).sum();
                speakingCount = rSpeaking.size();
            }
        }
        if (writingCount == 0) {
            List<Mistake> r4 = mistakesByDate.stream().filter(m -> m.getRoundType() != null && m.getRoundType() == 4).collect(Collectors.toList());
            if (!r4.isEmpty()) {
                writingScore = r4.stream().mapToDouble(m -> m.getMasteryScore() != null ? m.getMasteryScore() : 0.0).sum();
                writingCount = r4.size();
            }
        }
        if (listeningCount == 0) {
            List<Mistake> r5 = mistakesByDate.stream().filter(m -> m.getRoundType() != null && m.getRoundType() == 5).collect(Collectors.toList());
            if (!r5.isEmpty()) {
                listeningScore = r5.stream().mapToDouble(m -> m.getMasteryScore() != null ? m.getMasteryScore() : 0.0).sum();
                listeningCount = r5.size();
            }
        }
        if (readingCount == 0) {
            List<Mistake> rReading = mistakesByDate.stream().filter(m -> m.getRoundType() != null && m.getRoundType() == 10).collect(Collectors.toList());
            if (!rReading.isEmpty()) {
                readingScore = rReading.stream().mapToDouble(m -> m.getMasteryScore() != null ? m.getMasteryScore() : 0.0).sum();
                readingCount = rReading.size();
            }
        }
        if (grammarCount == 0) {
            List<Mistake> rGrammar = mistakesByDate.stream().filter(m -> m.getRoundType() != null && (m.getRoundType() == 7 || m.getRoundType() == 8)).collect(Collectors.toList());
            if (!rGrammar.isEmpty()) {
                grammarScore = rGrammar.stream().mapToDouble(m -> m.getMasteryScore() != null ? m.getMasteryScore() : 0.0).sum();
                grammarCount = rGrammar.size();
            }
        }

        return SkillComparisonResponse.SkillScoresDto.builder()
                .listening(listeningCount > 0 ? Math.min(100, (int) Math.round((listeningScore / listeningCount) * 100.0)) : 0)
                .speaking(speakingCount > 0 ? Math.min(100, (int) Math.round((speakingScore / speakingCount) * 100.0)) : 0)
                .reading(readingCount > 0 ? Math.min(100, (int) Math.round((readingScore / readingCount) * 100.0)) : 0)
                .writing(writingCount > 0 ? Math.min(100, (int) Math.round((writingScore / writingCount) * 100.0)) : 0)
                .vocabGrammar(vocabCount > 0 ? Math.min(100, (int) Math.round((vocabScore / vocabCount) * 100.0)) : 0)
                .grammar(grammarCount > 0 ? Math.min(100, (int) Math.round((grammarScore / grammarCount) * 100.0)) : 0)
                .build();
    }

    private double calculateItemScore(String key, Map<String, Mistake> mistakeMap, LocalDate targetDate) {
        if (mistakeMap.containsKey(key)) {
            Mistake m = mistakeMap.get(key);
            // Luôn trả masteryScore hiện tại của câu sai:
            // - Mới sai (chưa ôn): masteryScore=0.0 → điểm = 0%
            // - Đã ôn 1 ngày: masteryScore=0.33 → điểm = 33%
            // - Đã ôn 2 ngày: masteryScore=0.67 → điểm = 67%
            // - Đã ôn 3 ngày (MASTERED): masteryScore=1.0 → điểm = 100%
            return (m.getMasteryScore() != null) ? m.getMasteryScore() : 0.0;
        }
        // Không có trong mistakeMap = chưa sai bao giờ → điểm tuyệt đối
        return 1.0;
    }

    private int getDragDropQuestionCount(String payload, int fallbackCount) {
        if (payload != null && !payload.isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(payload);
                JsonNode coords = root.get("coordinates");
                if (coords != null && coords.isArray() && coords.size() > 0) {
                    return coords.size();
                }
            } catch (Exception e) {
                log.debug("Error parsing DRAG_DROP payload: {}", e.getMessage());
            }
        }
        return fallbackCount > 0 ? fallbackCount : 5;
    }

    private int getGrammarQuestionCount(String payload) {
        if (payload != null && !payload.isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(payload);
                JsonNode blocks = root.get("blocks");
                if (blocks != null && blocks.isArray()) {
                    int count = 0;
                    for (JsonNode block : blocks) {
                        if (block.has("type") && "QUESTION".equalsIgnoreCase(block.get("type").asText())) {
                            count++;
                        }
                    }
                    if (count > 0) return count;
                }
            } catch (Exception e) {
                log.debug("Error parsing GRAMMAR payload: {}", e.getMessage());
            }
        }
        return 4;
    }

    private int getItemsQuestionCount(String payload, int fallbackCount) {
        if (payload != null && !payload.isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(payload);
                JsonNode items = root.get("items");
                if (items != null && items.isArray() && items.size() > 0) {
                    return items.size();
                }
            } catch (Exception e) {
                log.debug("Error parsing items payload: {}", e.getMessage());
            }
        }
        return fallbackCount;
    }

    private int getFillInBlankQuestionCount(String payload) {
        return getItemsQuestionCount(payload, 6);
    }

}
