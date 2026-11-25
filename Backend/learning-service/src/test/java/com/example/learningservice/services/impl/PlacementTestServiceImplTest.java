package com.example.learningservice.services.impl;

import com.example.learningservice.dto.PlacementTestDto;
import com.example.learningservice.dto.PlacementTestResultResponse;
import com.example.learningservice.dto.PlacementTestSubmitRequest;
import com.example.learningservice.dto.S3PlacementTestDto;
import com.example.learningservice.entities.Part;
import com.example.learningservice.entities.PartVocabulary;
import com.example.learningservice.entities.PlacementTestHistory;
import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.Topic;
import com.example.learningservice.entities.UserProgress;
import com.example.learningservice.entities.Vocabulary;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.entities.enums.SessionType;
import com.example.learningservice.repositories.PartRepository;
import com.example.learningservice.repositories.PartVocabularyRepository;
import com.example.learningservice.repositories.PlacementTestDetailRepository;
import com.example.learningservice.repositories.PlacementTestHistoryRepository;
import com.example.learningservice.repositories.SessionRepository;
import com.example.learningservice.repositories.TopicRepository;
import com.example.learningservice.repositories.UserProgressRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Placement Test Service Unit Tests")
class PlacementTestServiceImplTest {

    private static final Long USER_ID = 101L;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private PartRepository partRepository;

    @Mock
    private PartVocabularyRepository partVocabularyRepository;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private PlacementTestHistoryRepository placementTestHistoryRepository;

    @Mock
    private PlacementTestDetailRepository placementTestDetailRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PlacementTestServiceImpl placementTestService;

    /**
     * Verifies that generating a test with no topics returns three empty rounds.
     */
    @Test
    @DisplayName("generateTest: Trả về các vòng rỗng khi không có topic")
    void generateTest_noTopics_returnsEmptyRounds() {
        // Arrange
        when(topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc()).thenReturn(List.of());

        // Act
        PlacementTestDto result = placementTestService.generateTest();

        // Assert
        assertThat(result.getVocabRound()).isEmpty();
        assertThat(result.getGrammarRound()).isEmpty();
        assertThat(result.getSpeakingRound()).isEmpty();
    }

    /**
     * Verifies that the vocabulary round includes at most two words for each topic.
     */
    @Test
    @DisplayName("generateTest: Lấy tối đa hai từ vựng cho mỗi topic")
    void generateTest_topicsWithVocabs_vocabRoundContainsAtMost2PerTopic() {
        // Arrange
        Part part = Part.builder().id(1L).build();
        Topic topic = Topic.builder().id(2L).title("Food").parts(List.of(part)).build();
        List<PartVocabulary> vocabularies = List.of(
                partVocabulary(11L, "apple"),
                partVocabulary(12L, "bread"),
                partVocabulary(13L, "water"));
        when(topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc()).thenReturn(List.of(topic));
        when(partVocabularyRepository.findByPartIdOrderByOrderIndexAsc(1L)).thenReturn(vocabularies);
        when(sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(1L)).thenReturn(List.of());

        // Act
        PlacementTestDto result = placementTestService.generateTest();

        // Assert
        assertThat(result.getVocabRound()).hasSize(2)
                .allSatisfy(question -> assertThat(question.getTopicId()).isEqualTo(topic.getId()));
    }

    /**
     * Verifies that a user with a placement-test history is reported as having completed it.
     */
    @Test
    @DisplayName("hasCompletedPlacementTest: Trả true khi đã có lịch sử")
    void hasCompletedPlacementTest_historyExists_returnsTrue() {
        // Arrange
        when(placementTestHistoryRepository.existsByUserId(USER_ID)).thenReturn(true);

        // Act
        boolean completed = placementTestService.hasCompletedPlacementTest(USER_ID);

        // Assert
        assertThat(completed).isTrue();
        verify(placementTestHistoryRepository).existsByUserId(USER_ID);
    }

    /**
     * Verifies that a new-format submission is processed by the S3 test grading flow.
     */
    @Test
    @DisplayName("submitTest: Chuyển bài nộp định dạng mới sang xử lý đề S3")
    void submitTest_newFormat_delegatesToSubmitS3Test() {
        // Arrange
        cacheS3Test(testQuestion("q1", "A", "apple", "I eat apples."));
        PlacementTestSubmitRequest request = PlacementTestSubmitRequest.builder()
                .testId("placement-2026")
                .round1Answers(List.of(round1Answer("q1", "A")))
                .build();
        when(placementTestHistoryRepository.save(any(PlacementTestHistory.class)))
                .thenAnswer(invocation -> {
                    PlacementTestHistory history = invocation.getArgument(0);
                    history.setId(50L);
                    return history;
                });
        when(topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc()).thenReturn(List.of());

        // Act
        PlacementTestResultResponse response = placementTestService.submitTest(USER_ID, request);

        // Assert
        assertThat(response.getHistoryId()).isEqualTo(50L);
        assertThat(response.getRound1Result().getCorrect()).isEqualTo(1);
        assertThat(response.getRound1Result().getTotal()).isEqualTo(1);
        verify(placementTestHistoryRepository).save(any(PlacementTestHistory.class));
        verify(placementTestDetailRepository).saveAll(any());
    }

    /**
     * Verifies that correct answers in all three rounds receive maximum round scores.
     */
    @Test
    @DisplayName("submitS3Test: Trả điểm tối đa khi trả lời đúng cả ba vòng")
    void submitS3Test_allCorrect_allRoundsScoreMax() {
        // Arrange
        cacheS3Test(testQuestion("r1", "option-a", "apple", "I eat apples."));
        PlacementTestSubmitRequest request = PlacementTestSubmitRequest.builder()
                .testId("placement-2026")
                .round1Answers(List.of(round1Answer("r1", "option-a")))
                .round2Answers(List.of(round2Answer("r1", "APPLE")))
                .round3Answers(List.of(round3Answer("r1", "I eat apples.")))
                .build();
        when(placementTestHistoryRepository.save(any(PlacementTestHistory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc()).thenReturn(List.of());

        // Act
        PlacementTestResultResponse response = placementTestService.submitTest(USER_ID, request);

        // Assert
        assertThat(response.getTotalQuestions()).isEqualTo(3);
        assertThat(response.getTotalCorrect()).isEqualTo(3);
        assertThat(response.getRound1Result().getCorrect()).isEqualTo(1);
        assertThat(response.getRound2Result().getCorrect()).isEqualTo(1);
        assertThat(response.getRound3Result().getCorrect()).isEqualTo(1);
        assertThat(response.getRound1Result().getMistakes()).isEmpty();
        assertThat(response.getRound2Result().getMistakes()).isEmpty();
        assertThat(response.getRound3Result().getMistakes()).isEmpty();
    }

    /**
     * Verifies that a correct round-one answer skips vocabulary sessions for its topic.
     */
    @Test
    @DisplayName("submitS3Test: Bỏ qua session từ vựng khi trả lời đúng vòng 1")
    void submitS3Test_round1Correct_vocabSessionsSkipped() {
        // Arrange
        cacheS3Test(testQuestion("r1", "option-a", null, null));
        PlacementTestSubmitRequest request = PlacementTestSubmitRequest.builder()
                .testId("placement-2026")
                .round1Answers(List.of(round1Answer("r1", "option-a", "Food")))
                .build();
        Topic topic = Topic.builder().id(5L).title("Food").build();
        Part part = Part.builder().id(6L).title("Food").build();
        Session vocabSession = Session.builder()
                .id(7L)
                .part(part)
                .title("Vocabulary")
                .orderIndex(1)
                .sessionType(SessionType.FLASHCARD)
                .build();
        when(placementTestHistoryRepository.save(any(PlacementTestHistory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc()).thenReturn(List.of(topic));
        when(partRepository.findByTopicIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(5L))
                .thenReturn(List.of());
        when(partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(5L)).thenReturn(List.of(part));
        when(sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(6L))
                .thenReturn(List.of(vocabSession));
        when(userProgressRepository.findByUserIdAndSessionId(USER_ID, 7L)).thenReturn(Optional.empty());
        when(userProgressRepository.save(any(UserProgress.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PlacementTestResultResponse response = placementTestService.submitTest(USER_ID, request);

        // Assert
        assertThat(response.getRound1Result().getCorrect()).isEqualTo(1);
        ArgumentCaptor<UserProgress> progressCaptor = ArgumentCaptor.forClass(UserProgress.class);
        verify(userProgressRepository).save(progressCaptor.capture());
        assertThat(progressCaptor.getValue().getSession()).isSameAs(vocabSession);
        assertThat(progressCaptor.getValue().getStatus()).isEqualTo(SessionStatus.SKIPPED);
    }

    /**
     * Verifies that answer comparison ignores differences in letter case.
     */
    @Test
    @DisplayName("submitS3Test: Không phân biệt chữ hoa chữ thường khi chấm đáp án")
    void submitS3Test_answerCaseInsensitive_treatedAsCorrect() {
        // Arrange
        cacheS3Test(testQuestion("r1", "Option-A", null, null));
        PlacementTestSubmitRequest request = PlacementTestSubmitRequest.builder()
                .testId("placement-2026")
                .round1Answers(List.of(round1Answer("r1", "option-a")))
                .build();
        when(placementTestHistoryRepository.save(any(PlacementTestHistory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(topicRepository.findByIsDeleteFalseOrderByOrderIndexAsc()).thenReturn(List.of());

        // Act
        PlacementTestResultResponse response = placementTestService.submitTest(USER_ID, request);

        // Assert
        assertThat(response.getRound1Result().getCorrect()).isEqualTo(1);
        assertThat(response.getRound1Result().getMistakes()).isEmpty();
        verify(userProgressRepository, never()).save(any(UserProgress.class));
    }

    private void cacheS3Test(S3PlacementTestDto.QuestionDto... questions) {
        S3PlacementTestDto.RoundDto round1 = S3PlacementTestDto.RoundDto.builder()
                .roundNumber(1)
                .questions(List.of(questions))
                .build();
        ReflectionTestUtils.setField(
                placementTestService,
                "cachedS3Test",
                S3PlacementTestDto.builder().testId("placement-2026").rounds(List.of(round1)).build());
    }

    private S3PlacementTestDto.QuestionDto testQuestion(
            String id, String correctAnswer, String meaning, String sentence) {
        return S3PlacementTestDto.QuestionDto.builder()
                .questionId(id)
                .topic("Unmatched topic")
                .correctAnswer(correctAnswer)
                .meaning(meaning)
                .sentence(sentence)
                .build();
    }

    private PlacementTestSubmitRequest.Round1Answer round1Answer(String questionId, String selectedOption) {
        return round1Answer(questionId, selectedOption, "Unmatched topic");
    }

    private PlacementTestSubmitRequest.Round1Answer round1Answer(
            String questionId, String selectedOption, String topic) {
        return PlacementTestSubmitRequest.Round1Answer.builder()
                .questionId(questionId)
                .topic(topic)
                .selectedOptionId(selectedOption)
                .build();
    }

    private PlacementTestSubmitRequest.Round2Answer round2Answer(String questionId, String selectedMeaning) {
        return PlacementTestSubmitRequest.Round2Answer.builder()
                .questionId(questionId)
                .topic("Unmatched topic")
                .word("apple")
                .selectedMeaning(selectedMeaning)
                .build();
    }

    private PlacementTestSubmitRequest.Round3Answer round3Answer(String questionId, String userSentence) {
        return PlacementTestSubmitRequest.Round3Answer.builder()
                .questionId(questionId)
                .topic("Unmatched topic")
                .userSentence(userSentence)
                .build();
    }

    private PartVocabulary partVocabulary(Long vocabularyId, String word) {
        Vocabulary vocabulary = Vocabulary.builder()
                .id(vocabularyId)
                .word(word)
                .translation("translation-" + word)
                .build();
        return PartVocabulary.builder().vocabulary(vocabulary).build();
    }
}
