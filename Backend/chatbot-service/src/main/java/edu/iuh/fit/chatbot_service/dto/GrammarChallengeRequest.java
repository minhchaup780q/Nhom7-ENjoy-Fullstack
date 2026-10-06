package edu.iuh.fit.chatbot_service.dto;

/**
 * Request body cho Grammar Challenge API.
 * Frontend chỉ cần gửi word + topic — backend tự RAG + AI.
 */
public record GrammarChallengeRequest(
        String word,
        String topic,
        String avoidGrammarName
) {}
