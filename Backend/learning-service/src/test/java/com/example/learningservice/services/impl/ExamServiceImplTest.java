package com.example.learningservice.services.impl;

import com.example.learningservice.dto.ExamResultResponse;
import com.example.learningservice.dto.ExamSubmitRequest;
import com.example.learningservice.dto.ExamSummaryResponse;
import com.example.learningservice.entities.Exam;
import com.example.learningservice.entities.ExamHistory;
import com.example.learningservice.entities.enums.ExamType;
import com.example.learningservice.repositories.ExamHistoryRepository;
import com.example.learningservice.repositories.ExamRepository;
import com.example.learningservice.services.VocabularyTrackingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Exam Service Unit Tests")
class ExamServiceImplTest {

    @Mock
    private ExamRepository examRepository;

    @Mock
    private ExamHistoryRepository examHistoryRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private VocabularyTrackingService vocabularyTrackingService;

    @InjectMocks
    private ExamServiceImpl examService;

    /**
     * Verifies that requesting exams without a user returns active exams as incomplete.
     */
    @Test
    @DisplayName("getAllExams: Trả đề thi đang hoạt động với trạng thái chưa hoàn thành")
    void getAllExams_nullUserId_returnsAllActiveExamsWithCompletedFalse() {
        // Arrange
        Exam exam1 = exam(1L, "Exam One");
        Exam exam2 = exam(2L, "Exam Two");
        when(examRepository.findAllActive()).thenReturn(List.of(exam1, exam2));

        // Act
        List<ExamSummaryResponse> result = examService.getAllExams(null);

        // Assert
        assertThat(result).hasSize(2)
                .extracting(ExamSummaryResponse::getIsCompleted)
                .containsOnly(false);
    }

    /**
     * Verifies that an existing exam is returned with its detail fields.
     */
    @Test
    @DisplayName("getExamById: Trả chi tiết đề thi khi ID tồn tại")
    void getExamById_existingId_returnsExamDetail() {
        // Arrange
        Exam exam = exam(5L, "Cambridge A1");
        exam.setListeningPayload("{\"part1\":[]}");
        exam.setReadingPayload("{\"part1\":[]}");
        when(examRepository.findById(5L)).thenReturn(Optional.of(exam));

        // Act
        var result = examService.getExamById(5L);

        // Assert
        assertThat(result.getId()).isEqualTo(5L);
        assertThat(result.getTitle()).isEqualTo("Cambridge A1");
        assertThat(result.getExamType()).isEqualTo("CAMBRIDGE");
        assertThat(result.getListeningPayload()).isEqualTo("{\"part1\":[]}");
        assertThat(result.getReadingPayload()).isEqualTo("{\"part1\":[]}");
    }

    /**
     * Verifies that a perfect listening score awards five shields.
     */
    @Test
    @DisplayName("submitExam: Đạt năm khiên khi làm đúng toàn bộ câu nghe")
    void submitExam_perfectListening_5Shields() throws Exception {
        // Arrange
        Exam exam = exam(5L, "Perfect Listening");
        String listeningPayload = "{\"part1\":{\"coordinates\":[" + IntStream.range(0, 18)
                .mapToObj(index -> "{\"word\":\"cat\",\"is_example\":false}")
                .collect(Collectors.joining(",")) + "]}}";
        exam.setListeningPayload(listeningPayload);
        exam.setReadingPayload("{}");
        exam.setTotalListeningQuestions(20);
        exam.setTotalReadingQuestions(25);
        when(examRepository.findById(5L)).thenReturn(Optional.of(exam));
        when(objectMapper.readTree(listeningPayload))
                .thenReturn(new ObjectMapper().readTree(listeningPayload));
        when(objectMapper.readTree(exam.getReadingPayload()))
                .thenReturn(new ObjectMapper().readTree(exam.getReadingPayload()));
        when(objectMapper.writeValueAsString(any())).thenReturn("{}");
        when(examHistoryRepository.save(any(ExamHistory.class)))
                .thenAnswer(invocation -> {
                    ExamHistory history = invocation.getArgument(0);
                    history.setId(50L);
                    return history;
                });
        ExamSubmitRequest request = ExamSubmitRequest.builder()
                .listening(java.util.Map.of(
                        "part1",
                        IntStream.range(0, 18).mapToObj(index -> answer(index, "CAT")).toList()))
                .reading(java.util.Map.of())
                .build();

        // Act
        ExamResultResponse result = examService.submitExam(100L, 5L, request);

        // Assert
        assertThat(result.getListeningCorrect()).isEqualTo(18);
        assertThat(result.getListeningShields()).isEqualTo(5);
        assertThat(result.getListeningPartScores().getPart1Correct()).isEqualTo(18);
        assertThat(result.getListeningPartScores().getPart1Total()).isEqualTo(18);
    }

    /**
     * Verifies that submitting an exam persists a history record with computed scores.
     */
    @Test
    @DisplayName("submitExam: Lưu lịch sử làm bài vào cơ sở dữ liệu")
    void submitExam_always_savesExamHistoryToDb() throws Exception {
        // Arrange
        Exam exam = exam(6L, "History Exam");
        exam.setListeningPayload("{}");
        exam.setReadingPayload("{}");
        when(examRepository.findById(6L)).thenReturn(Optional.of(exam));
        when(objectMapper.readTree(exam.getListeningPayload()))
                .thenReturn(new ObjectMapper().readTree("{}"));
        when(objectMapper.readTree(exam.getReadingPayload()))
                .thenReturn(new ObjectMapper().readTree("{}"));
        when(objectMapper.writeValueAsString(any())).thenReturn("{}");
        when(examHistoryRepository.save(any(ExamHistory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ExamSubmitRequest request = ExamSubmitRequest.builder()
                .listening(java.util.Map.of())
                .reading(java.util.Map.of())
                .build();

        ArgumentCaptor<ExamHistory> historyCaptor = ArgumentCaptor.forClass(ExamHistory.class);

        // Act
        examService.submitExam(100L, 6L, request);

        // Assert
        verify(examHistoryRepository).save(historyCaptor.capture());
        assertThat(historyCaptor.getValue().getUserId()).isEqualTo(100L);
        assertThat(historyCaptor.getValue().getExam()).isSameAs(exam);
        assertThat(historyCaptor.getValue().getTotalCorrect()).isZero();
        assertThat(historyCaptor.getValue().getTotalQuestions()).isEqualTo(45);
        assertThat(historyCaptor.getValue().getCompletedAt()).isNotNull();
    }

    /**
     * Verifies that submitting a nonexistent exam throws a runtime exception.
     */
    @Test
    @DisplayName("submitExam: Báo lỗi khi không tìm thấy đề thi")
    void submitExam_examNotFound_throwsRuntimeException() {
        // Arrange
        when(examRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> examService.submitExam(
                100L, 999L, ExamSubmitRequest.builder().build()))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Không tìm thấy đề thi với id: 999");
    }

    private Exam exam(Long id, String title) {
        return Exam.builder()
                .id(id)
                .examType(ExamType.CAMBRIDGE)
                .title(title)
                .description("Exam description")
                .level("A1")
                .listeningDuration(30)
                .readingDuration(45)
                .totalListeningQuestions(20)
                .totalReadingQuestions(25)
                .isPublished(true)
                .build();
    }

    private ExamSubmitRequest.PartAnswer answer(int index, String value) {
        return ExamSubmitRequest.PartAnswer.builder()
                .index(index)
                .answer(value)
                .build();
    }
}
