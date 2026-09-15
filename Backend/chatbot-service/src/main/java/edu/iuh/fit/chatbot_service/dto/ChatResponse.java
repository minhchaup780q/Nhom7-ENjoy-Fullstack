package edu.iuh.fit.chatbot_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String reply;
    private String userId;
    private String conversationId;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
