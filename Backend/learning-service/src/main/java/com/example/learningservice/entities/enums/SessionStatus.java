package com.example.learningservice.entities.enums;


public enum SessionStatus {
    LOCK,
    UNLOCK,
    FINISH,
    SKIPPED  // Đã qua bài kiểm tra đầu vào => bỏ qua topic này
}