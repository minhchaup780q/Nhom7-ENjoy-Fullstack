package com.example.learningservice.services.impl;

import com.example.learningservice.dto.SkillComparisonResponse;
import com.example.learningservice.dto.UserStatsResponse;
import com.example.learningservice.entities.Mistake;
import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.SessionItemMapping;
import com.example.learningservice.entities.UserProgress;
import com.example.learningservice.entities.enums.MistakeStatus;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.entities.enums.SessionType;
import com.example.learningservice.repositories.MistakeRepository;
import com.example.learningservice.repositories.SessionItemMappingRepository;
import com.example.learningservice.repositories.SessionRepository;
import com.example.learningservice.repositories.UserProgressRepository;
import com.example.learningservice.services.UserProgressService;
import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class UserProgressServiceImpl implements UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final SessionRepository sessionRepository;
    private final MistakeRepository mistakeRepository;
    private final SessionItemMappingRepository sessionItemMappingRepository;

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

        if (finishedByDate.isEmpty()) {
            return SkillComparisonResponse.SkillScoresDto.builder()
                    .listening(0)
                    .speaking(0)
                    .reading(0)
                    .writing(0)
                    .vocabGrammar(0)
                    .build();
        }

        Map<String, Mistake> mistakeMap = new HashMap<>();
        for (Mistake m : allMistakes) {
            LocalDateTime mCreated = m.getCreatedAt() != null ? m.getCreatedAt() : m.getCreateAt();
            if (mCreated != null && !mCreated.toLocalDate().isAfter(targetDate)) {
                if (m.getQuestion() != null) {
                    String key = m.getQuestion().getId() + "_" + m.getRoundType();
                    mistakeMap.put(key, m);
                }
            }
        }

        double listeningScore = 0; int listeningCount = 0;
        double speakingScore = 0; int speakingCount = 0;
        double readingScore = 0; int readingCount = 0;
        double writingScore = 0; int writingCount = 0;
        double vocabGrammarScore = 0; int vocabGrammarCount = 0;

        for (UserProgress up : finishedByDate) {
            Session s = up.getSession();
            if (s == null || s.getSessionType() == null) continue;

            List<SessionItemMapping> mappings = sessionItemMappingRepository.findBySessionIdOrderByOrderIndexAsc(s.getId());
            int roundType = getRoundTypeBySessionType(s.getSessionType());

            for (SessionItemMapping sim : mappings) {
                if (sim.getSessionItem() == null) continue;
                Long questionId = sim.getSessionItem().getId();
                String key = questionId + "_" + roundType;

                double itemScore = 1.0;
                if (mistakeMap.containsKey(key)) {
                    Mistake m = mistakeMap.get(key);
                    if (m.getLastPracticedAt() != null && !m.getLastPracticedAt().toLocalDate().isAfter(targetDate)) {
                        itemScore = (m.getMasteryScore() != null) ? m.getMasteryScore() : 0.0;
                    } else {
                        itemScore = 0.0;
                    }
                }

                switch (s.getSessionType()) {
                    case LISTENING -> { listeningScore += itemScore; listeningCount++; }
                    case SPEAKING -> { speakingScore += itemScore; speakingCount++; }
                    case INTRODUCTION -> { readingScore += itemScore; readingCount++; }
                    case GAMIFIED_REVIEW -> { writingScore += itemScore; writingCount++; }
                    case WORD_RECOGNITION -> { vocabGrammarScore += itemScore; vocabGrammarCount++; }
                }
            }
        }

        return SkillComparisonResponse.SkillScoresDto.builder()
                .listening(listeningCount > 0 ? Math.min(100, (int) Math.round((listeningScore / listeningCount) * 100.0)) : 100)
                .speaking(speakingCount > 0 ? Math.min(100, (int) Math.round((speakingScore / speakingCount) * 100.0)) : 100)
                .reading(readingCount > 0 ? Math.min(100, (int) Math.round((readingScore / readingCount) * 100.0)) : 100)
                .writing(writingCount > 0 ? Math.min(100, (int) Math.round((writingScore / writingCount) * 100.0)) : 100)
                .vocabGrammar(vocabGrammarCount > 0 ? Math.min(100, (int) Math.round((vocabGrammarScore / vocabGrammarCount) * 100.0)) : 100)
                .build();
    }

    private int getRoundTypeBySessionType(SessionType sessionType) {
        if (sessionType == null) return 1;
        return switch (sessionType) {
            case INTRODUCTION -> 1;
            case LISTENING -> 2;
            case SPEAKING -> 3;
            case WORD_RECOGNITION -> 4;
            case GAMIFIED_REVIEW -> 5;
        };
    }
}
