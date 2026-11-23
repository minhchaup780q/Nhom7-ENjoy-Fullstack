package com.example.learningservice.workers;

import com.example.learningservice.config.RabbitMQConfig;
import com.example.learningservice.dto.CommunityChatMessageDto;
import com.example.learningservice.services.CommunityChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Worker chạy ngầm hứng tin nhắn Chat Cộng Đồng từ RabbitMQ (Queue chat.community.queue)
 * và lưu trữ bền vững vào MariaDB.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CommunityChatConsumer {

    private final CommunityChatService communityChatService;

    @RabbitListener(queues = RabbitMQConfig.CHAT_QUEUE)
    public void handleChatMessage(CommunityChatMessageDto messageDto) {
        if (messageDto == null || messageDto.getUserId() == null || messageDto.getContent() == null) {
            log.warn("[RabbitMQ Chat Worker] Bỏ qua tin nhắn không hợp lệ: {}", messageDto);
            return;
        }

        log.info("--> [RabbitMQ Chat Worker] Đã nhận tin nhắn từ User #{} ({}): \"{}\"",
                messageDto.getUserId(), messageDto.getUsername(),
                messageDto.getContent().length() > 30 ? messageDto.getContent().substring(0, 30) + "..." : messageDto.getContent());

        try {
            communityChatService.saveMessage(messageDto);
        } catch (Exception e) {
            log.error("[RabbitMQ Chat Worker] Lỗi khi lưu tin nhắn vào MariaDB: {}", e.getMessage(), e);
        }
    }
}
