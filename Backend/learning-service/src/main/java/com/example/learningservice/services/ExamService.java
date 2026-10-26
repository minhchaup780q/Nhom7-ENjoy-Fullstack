package com.example.learningservice.services;

import com.example.learningservice.dto.ExamDetailResponse;
import com.example.learningservice.dto.ExamResultResponse;
import com.example.learningservice.dto.ExamSubmitRequest;
import com.example.learningservice.dto.ExamSummaryResponse;

import java.util.List;

public interface ExamService {

    /** Lấy danh sách tóm tắt tất cả đề thi (không bao gồm payload câu hỏi). */
    List<ExamSummaryResponse> getAllExams(Long userId);

    /** Lấy chi tiết một đề thi theo ID, bao gồm toàn bộ payload câu hỏi. */
    ExamDetailResponse getExamById(Long examId);

    /** Nộp bài, tính điểm, lưu lịch sử, trả về kết quả. */
    ExamResultResponse submitExam(Long userId, Long examId, ExamSubmitRequest request);

    /** Lấy lịch sử làm bài của một user. */
    List<ExamResultResponse> getExamHistory(Long userId);
}
