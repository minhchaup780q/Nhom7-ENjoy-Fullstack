package com.example.learningservice.services;

import com.example.learningservice.dto.PlacementTestDto;
import com.example.learningservice.dto.PlacementTestResultResponse;
import com.example.learningservice.dto.PlacementTestSubmitRequest;

public interface PlacementTestService {

    /**
     * Tạo đề bài kiểm tra đầu vào: lấy random từ vựng, câu re_order, câu speaking từ tất cả topics.
     */
    PlacementTestDto generateTest();

    /**
     * Chấm bài, lưu lịch sử, tạo UserProgress SKIPPED cho các topic đã pass, trả về kết quả nhận xét.
     */
    PlacementTestResultResponse submitTest(Long userId, PlacementTestSubmitRequest request);

    /**
     * Kiểm tra user đã làm bài kiểm tra đầu vào chưa (để quyết định redirect đến welcome hay learn).
     */
    boolean hasCompletedPlacementTest(Long userId);
}
