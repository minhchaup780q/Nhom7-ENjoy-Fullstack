package com.example.learningservice.services.impl;

import com.example.learningservice.dto.SkillComparisonResponse;
import com.example.learningservice.dto.UserStatsResponse;
import com.example.learningservice.entities.Mistake;
import com.example.learningservice.entities.Part;
import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.UserProgress;
import com.example.learningservice.entities.enums.MistakeStatus;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.entities.enums.SessionType;
import com.example.learningservice.entities.enums.XpSourceType;
import com.example.learningservice.repositories.MistakeRepository;
import com.example.learningservice.repositories.PartVocabularyRepository;
import com.example.learningservice.repositories.SessionRepository;
import com.example.learningservice.repositories.UserProgressRepository;
import com.example.learningservice.services.LeaderboardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("User Progress Service Unit Tests")
class UserProgressServiceImplTest {

    private static final Long USER_ID = 10L;
    private static final Long SESSION_ID = 20L;
    private static final Long PART_ID = 30L;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private MistakeRepository mistakeRepository;

    @Mock
    private PartVocabularyRepository partVocabularyRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private LeaderboardService leaderboardService;

    @InjectMocks
    private UserProgressServiceImpl userProgressService;

    /**
     * Verifies that progress retrieval delegates to the repository for the requested user.
     */
    @Test
    @DisplayName("getUserProgress: Lấy tiến độ theo userId")
    void getUserProgress_always_delegatesToRepository() {
        // Arrange
        List<UserProgress> expected = List.of(progress(USER_ID, session(SESSION_ID, "Lesson"), SessionStatus.FINISH));
        when(userProgressRepository.findByUserId(USER_ID)).thenReturn(expected);

        // Act
        List<UserProgress> result = userProgressService.getUserProgress(USER_ID);

        // Assert
        assertThat(result).isSameAs(expected);
        verify(userProgressRepository).findByUserId(USER_ID);
    }

    /**
     * Verifies that first-time completion awards 20 XP and marks progress as finished.
     */
    @Test
    @DisplayName("completeSession: Hoàn thành lần đầu nhận 20 XP và trạng thái FINISH")
    void completeSession_firstTime_xpEarned20AndStatusFinish() {
        // Arrange
        Session current = session(SESSION_ID, "First lesson");
        when(sessionRepository.findByIdAndIsDeleteFalse(SESSION_ID)).thenReturn(Optional.of(current));
        when(userProgressRepository.findByUserIdAndSessionId(USER_ID, SESSION_ID)).thenReturn(Optional.empty());
        when(userProgressRepository.save(any(UserProgress.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(sessionRepository.findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(PART_ID))
                .thenReturn(List.of(current));

        // Act
        UserProgress result = userProgressService.completeSession(USER_ID, SESSION_ID, 180);

        // Assert
        assertThat(result.getStatus()).isEqualTo(SessionStatus.FINISH);
        assertThat(result.getDurationSeconds()).isEqualTo(180);
        assertThat(result.getCompletedAt()).isNotNull();
        verify(leaderboardService).addXp(
                eq(USER_ID), eq(20), eq(XpSourceType.LESSON_FIRST_COMPLETE), eq(SESSION_ID),
                eq("Hoàn thành bài mới: First lesson"), eq(null), eq(null));
        verify(userProgressRepository).save(result);
    }

    /**
     * Verifies that completing an already finished session awards the review XP amount.
     */
    @Test
    @DisplayName("completeSession: Ôn lại bài đã hoàn thành nhận 5 XP")
    void completeSession_relearn_xpEarned5() {
        // Arrange
        Session current = session(SESSION_ID, "Reviewed lesson");
        UserProgress existing = progress(USER_ID, current, SessionStatus.FINISH);
        when(sessionRepository.findByIdAndIsDeleteFalse(SESSION_ID)).thenReturn(Optional.of(current));
        when(userProgressRepository.findByUserIdAndSessionId(USER_ID, SESSION_ID))
                .thenReturn(Optional.of(existing));
        when(userProgressRepository.save(existing)).thenReturn(existing);
        when(sessionRepository.findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(PART_ID))
                .thenReturn(List.of(current));

        // Act
        UserProgress result = userProgressService.completeSession(USER_ID, SESSION_ID, 240);

        // Assert
        assertThat(result).isSameAs(existing);
        assertThat(result.getStatus()).isEqualTo(SessionStatus.FINISH);
        verify(leaderboardService).addXp(
                eq(USER_ID), eq(5), eq(XpSourceType.LESSON_REVIEW), eq(SESSION_ID),
                eq("Ôn tập lại bài học: Reviewed lesson"), eq(null), eq(null));
        verify(userProgressRepository).save(existing);
    }

    /**
     * Verifies that completing a nonexistent or deleted session throws an exception.
     */
    @Test
    @DisplayName("completeSession: Báo lỗi khi không tìm thấy session")
    void completeSession_sessionNotFound_throwsRuntimeException() {
        // Arrange
        when(sessionRepository.findByIdAndIsDeleteFalse(SESSION_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userProgressService.completeSession(USER_ID, SESSION_ID, 180))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Không tìm thấy bài học với ID: " + SESSION_ID);
        verify(userProgressRepository, never()).save(any(UserProgress.class));
        verify(leaderboardService, never()).addXp(any(), any(Integer.class), any(), any(), any(), any(), any());
    }

    /**
     * Verifies that completing a session creates an UNLOCK progress record for the next session.
     */
    @Test
    @DisplayName("completeSession: Tạo bản ghi UNLOCK cho session tiếp theo")
    void completeSession_nextSessionNotYetInProgress_createsUnlockRecord() {
        // Arrange
        Session current = session(SESSION_ID, "Current lesson");
        Session next = session(SESSION_ID + 1, "Next lesson");
        when(sessionRepository.findByIdAndIsDeleteFalse(SESSION_ID)).thenReturn(Optional.of(current));
        when(userProgressRepository.findByUserIdAndSessionId(USER_ID, SESSION_ID))
                .thenReturn(Optional.empty());
        when(userProgressRepository.findByUserIdAndSessionId(USER_ID, next.getId()))
                .thenReturn(Optional.empty());
        when(userProgressRepository.save(any(UserProgress.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(sessionRepository.findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(PART_ID))
                .thenReturn(List.of(current, next));

        ArgumentCaptor<UserProgress> progressCaptor = ArgumentCaptor.forClass(UserProgress.class);

        // Act
        userProgressService.completeSession(USER_ID, SESSION_ID, 180);

        // Assert
        verify(userProgressRepository, org.mockito.Mockito.times(2)).save(progressCaptor.capture());
        assertThat(progressCaptor.getAllValues())
                .filteredOn(progress -> progress.getSession().getId().equals(next.getId()))
                .singleElement()
                .satisfies(unlocked -> {
                    assertThat(unlocked.getStatus()).isEqualTo(SessionStatus.UNLOCK);
                    assertThat(unlocked.getUserId()).isEqualTo(USER_ID);
                    assertThat(unlocked.getCreateAt()).isNotNull();
                });
    }

    /**
     * Verifies that completing the last session in a part does not create another unlock record.
     */
    @Test
    @DisplayName("completeSession: Không tạo UNLOCK khi hoàn thành session cuối part")
    void completeSession_lastSessionInPart_noUnlockCreated() {
        // Arrange
        Session current = session(SESSION_ID, "Last lesson");
        when(sessionRepository.findByIdAndIsDeleteFalse(SESSION_ID)).thenReturn(Optional.of(current));
        when(userProgressRepository.findByUserIdAndSessionId(USER_ID, SESSION_ID)).thenReturn(Optional.empty());
        when(userProgressRepository.save(any(UserProgress.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(sessionRepository.findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(PART_ID))
                .thenReturn(List.of(current));

        // Act
        userProgressService.completeSession(USER_ID, SESSION_ID, 180);

        // Assert
        verify(userProgressRepository).save(any(UserProgress.class));
        verify(userProgressRepository, org.mockito.Mockito.times(1)).save(any(UserProgress.class));
        verify(userProgressRepository, never()).findByUserIdAndSessionId(USER_ID, SESSION_ID + 1);
    }

    /**
     * Verifies that leaderboard failures do not prevent progress from being saved.
     */
    @Test
    @DisplayName("completeSession: Vẫn lưu tiến độ khi leaderboard lỗi")
    void completeSession_leaderboardThrowsException_progressStillSaved() {
        // Arrange
        Session current = session(SESSION_ID, "Lesson despite leaderboard failure");
        when(sessionRepository.findByIdAndIsDeleteFalse(SESSION_ID)).thenReturn(Optional.of(current));
        when(userProgressRepository.findByUserIdAndSessionId(USER_ID, SESSION_ID)).thenReturn(Optional.empty());
        when(userProgressRepository.save(any(UserProgress.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(sessionRepository.findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(PART_ID))
                .thenReturn(List.of(current));
        org.mockito.Mockito.doThrow(new RuntimeException("Leaderboard unavailable"))
                .when(leaderboardService)
                .addXp(any(), any(Integer.class), any(), any(), any(), any(), any());

        // Act
        UserProgress result = userProgressService.completeSession(USER_ID, SESSION_ID, 180);

        // Assert
        assertThat(result.getStatus()).isEqualTo(SessionStatus.FINISH);
        verify(userProgressRepository).save(result);
    }

    /**
     * Verifies that user statistics return zero totals and seven zero-minute days without completed sessions.
     */
    @Test
    @DisplayName("getUserStats: Trả số liệu bằng 0 khi chưa có session hoàn thành")
    void getUserStats_noCompletedSessions_returnsZeroCounts() {
        // Arrange
        when(userProgressRepository.findByUserIdAndStatus(USER_ID, SessionStatus.FINISH)).thenReturn(List.of());

        // Act
        UserStatsResponse response = userProgressService.getUserStats(USER_ID);

        // Assert
        assertThat(response.getTotalCompletedLessons()).isZero();
        assertThat(response.getWeeklyStudyMinutes()).isZero();
        assertThat(response.getDailyStudyTime()).hasSize(7)
                .allSatisfy(day -> assertThat(day.getMinutes()).isZero());
        assertThat(response.getRecentSessions()).isEmpty();
    }

    /**
     * Verifies that this week's completed session durations aggregate into daily and weekly minutes.
     */
    @Test
    @DisplayName("getUserStats: Cộng gộp số phút học trong tuần theo ngày")
    void getUserStats_sessionsThisWeek_dailyMinutesAggregatedCorrectly() {
        // Arrange
        LocalDateTime today = LocalDate.now().atTime(12, 0);
        Session firstSession = session(SESSION_ID, "Lesson one");
        Session secondSession = session(SESSION_ID + 1, "Lesson two");
        UserProgress first = completedProgress(USER_ID, firstSession, today, 125);
        UserProgress second = completedProgress(USER_ID, secondSession, today.minusHours(1), 185);
        UserProgress third = completedProgress(USER_ID, session(SESSION_ID + 2, "Lesson three"), today, 300);
        when(userProgressRepository.findByUserIdAndStatus(USER_ID, SessionStatus.FINISH))
                .thenReturn(List.of(first, second, third));

        // Act
        UserStatsResponse response = userProgressService.getUserStats(USER_ID);

        // Assert
        assertThat(response.getTotalCompletedLessons()).isEqualTo(3);
        assertThat(response.getWeeklyStudyMinutes()).isEqualTo(10);
        assertThat(response.getDailyStudyTime())
                .filteredOn(day -> day.getDate().equals(LocalDate.now().toString()))
                .singleElement()
                .satisfies(day -> assertThat(day.getMinutes()).isEqualTo(10));
    }

    /**
     * Verifies that all skill scores are zero when there are no finished sessions or mistakes.
     */
    @Test
    @DisplayName("getSkillComparisonStats: Điểm các kỹ năng bằng 0 khi chưa có dữ liệu")
    void getSkillComparisonStats_noFinishedSessions_allSkillScores0() {
        // Arrange
        when(userProgressRepository.findByUserIdAndStatus(USER_ID, SessionStatus.FINISH)).thenReturn(List.of());
        when(mistakeRepository.findByUserId(USER_ID)).thenReturn(List.of());

        // Act
        SkillComparisonResponse response =
                userProgressService.getSkillComparisonStats(USER_ID, LocalDate.now(), LocalDate.now().minusDays(7));

        // Assert
        assertThat(response.getCurrentSkills().getListening()).isZero();
        assertThat(response.getCurrentSkills().getSpeaking()).isZero();
        assertThat(response.getCurrentSkills().getReading()).isZero();
        assertThat(response.getCurrentSkills().getWriting()).isZero();
        assertThat(response.getCurrentSkills().getVocabGrammar()).isZero();
        assertThat(response.getCurrentSkills().getGrammar()).isZero();
        assertThat(response.getPreviousSkills().getListening()).isZero();
        assertThat(response.getPreviousSkills().getSpeaking()).isZero();
        assertThat(response.getPreviousSkills().getReading()).isZero();
        assertThat(response.getPreviousSkills().getWriting()).isZero();
        assertThat(response.getPreviousSkills().getVocabGrammar()).isZero();
        assertThat(response.getPreviousSkills().getGrammar()).isZero();
    }

    /**
     * Verifies that mastered mistakes and mistakes with a three-day streak are counted as mastered.
     */
    @Test
    @DisplayName("getSkillComparisonStats: Đếm đúng số lỗi đã thành thạo")
    void getSkillComparisonStats_hasMasteredMistakes_masteredCountCorrect() {
        // Arrange
        List<Mistake> mistakes = List.of(
                mistake(MistakeStatus.MASTERED, 0),
                mistake(MistakeStatus.REVIEWED, 3),
                mistake(MistakeStatus.NEEDS_REVIEW, 1));
        when(userProgressRepository.findByUserIdAndStatus(USER_ID, SessionStatus.FINISH)).thenReturn(List.of());
        when(mistakeRepository.findByUserId(USER_ID)).thenReturn(mistakes);

        // Act
        SkillComparisonResponse response =
                userProgressService.getSkillComparisonStats(USER_ID, LocalDate.now(), LocalDate.now().minusDays(7));

        // Assert
        assertThat(response.getTotalMistakes()).isEqualTo(3);
        assertThat(response.getMasteredMistakes()).isEqualTo(2);
    }

    private Session session(Long id, String title) {
        Part part = Part.builder().id(PART_ID).title("Part 1").build();
        return Session.builder()
                .id(id)
                .part(part)
                .title(title)
                .sessionType(SessionType.FLASHCARD)
                .build();
    }

    private UserProgress progress(Long userId, Session session, SessionStatus status) {
        return UserProgress.builder()
                .userId(userId)
                .session(session)
                .status(status)
                .build();
    }

    private UserProgress completedProgress(Long userId, Session session, LocalDateTime completedAt, int durationSeconds) {
        return UserProgress.builder()
                .userId(userId)
                .session(session)
                .status(SessionStatus.FINISH)
                .completedAt(completedAt)
                .durationSeconds(durationSeconds)
                .build();
    }

    private Mistake mistake(MistakeStatus status, int streakDays) {
        return Mistake.builder()
                .userId(USER_ID)
                .roundType(2)
                .wrongAnswerSubmitted("wrong")
                .status(status)
                .correctStreakDays(streakDays)
                .masteryScore(0.0)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
