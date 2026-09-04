package edu.iuh.fit.chatbot_service.controller;

import edu.iuh.fit.chatbot_service.dto.ApiResponse;
import edu.iuh.fit.chatbot_service.dto.ChatRequest;
import edu.iuh.fit.chatbot_service.dto.ChatResponse;
import edu.iuh.fit.chatbot_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * Endpoint nhận request dạng JSON, trả về kết quả AI
     */
    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<ChatResponse>> ask(@RequestBody ChatRequest request) {
        String message = request.message();
        String context = request.context();
        String reply = chatService.generateResponse(message, context);

        ChatResponse response = ChatResponse.builder()
                .reply(reply)
                .userId(request.userId())
                .conversationId(request.conversationId())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Endpoint nhận text thuần túy trực tiếp, trả về text kết quả thuần túy
     */
    @PostMapping(value = "/generate", consumes = "text/plain", produces = "text/plain;charset=UTF-8")
    public ResponseEntity<String> generateText(@RequestBody String prompt) {
        String reply = chatService.generateResponse(prompt, null);
        return ResponseEntity.ok(reply);
    }
}