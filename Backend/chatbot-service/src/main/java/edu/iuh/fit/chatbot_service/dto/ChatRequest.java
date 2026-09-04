package edu.iuh.fit.chatbot_service.dto;

public record ChatRequest(
        String message,
        String userId,
        String conversationId,
        String context
) {
    public ChatRequest(String message, String userId) {
        this(message, userId, userId, null);
    }
}
