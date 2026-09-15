package edu.iuh.fit.chatbot_service.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    /**
     * Nhận vào text message và context (nếu có), gọi AI và trả về text kết quả thuần túy
     */
    public String generateResponse(String message, String context) {
        if (message == null || message.trim().isEmpty()) {
            return "Vui lòng nhập nội dung câu hỏi.";
        }

        try {
            var promptSpec = chatClient.prompt();
            if (context != null && !context.isBlank()) {
                promptSpec = promptSpec.system("Ngữ cảnh bài học/yêu cầu:\n" + context);
            }

            String response = promptSpec
                    .user(message.trim())
                    .call()
                    .content();

            return (response != null && !response.isBlank()) ? response.strip() : "Không có phản hồi từ AI.";
        } catch (Exception e) {
            log.error("Lỗi khi gọi AI Chatbot: ", e);
            return "Lỗi khi kết nối với mô hình AI: " + e.getMessage();
        }
    }
}