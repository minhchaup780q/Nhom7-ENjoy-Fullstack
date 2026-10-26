package com.example.learningservice.services;

import com.example.learningservice.dto.CommunityChatMessageDto;
import com.example.learningservice.dto.CommunityChatPageResponseDto;
import com.example.learningservice.entities.CommunityChatMessage;

public interface CommunityChatService {

    /**
     * Lấy danh sách tin nhắn cộng đồng phân trang (mặc định 30 tin)
     * Nếu beforeId được truyền vào -> lấy 30 tin cũ hơn beforeId
     */
    CommunityChatPageResponseDto getRecentMessages(Long beforeId, int limit);

    /**
     * Lưu tin nhắn nhận từ RabbitMQ vào MariaDB
     */
    CommunityChatMessage saveMessage(CommunityChatMessageDto dto);
}
