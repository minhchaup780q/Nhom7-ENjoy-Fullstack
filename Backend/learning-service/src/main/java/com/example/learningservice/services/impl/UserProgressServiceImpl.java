package com.example.learningservice.services.impl;

import com.example.learningservice.dto.UserStatsResponse;
import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.UserProgress;
import com.example.learningservice.entities.enums.SessionStatus;
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
}
