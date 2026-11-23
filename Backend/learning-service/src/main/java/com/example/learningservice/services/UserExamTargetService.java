package com.example.learningservice.services;

import com.example.learningservice.dto.UserExamTargetDto;

public interface UserExamTargetService {

    /**
     * Lưu hoặc cập nhật mục tiêu khiên của học sinh.
     */
    UserExamTargetDto saveUserTarget(Long userId, Integer listeningShields, Integer readingShields);

    /**
     * Lấy mục tiêu khiên hiện tại của học sinh.
     */
    UserExamTargetDto getUserTarget(Long userId);
}
