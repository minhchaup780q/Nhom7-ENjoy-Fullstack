package com.example.learningservice.controllers;

import com.example.learningservice.dto.CommunityChatPageResponseDto;
import com.example.learningservice.services.CommunityChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community-chat")
@RequiredArgsConstructor
public class CommunityChatController {

    private final CommunityChatService communityChatService;

    /**
     * API phân trang tải 30 tin nhắn cộng đồng:
     * - Khi mở hộp chat: không truyền beforeId -> Lấy 30 tin mới nhất.
     * - Khi cuộn lên trên cùng: truyền beforeId -> Lấy 30 tin cũ hơn beforeId.
     */
    @GetMapping("/messages")
    public ResponseEntity<CommunityChatPageResponseDto> getMessages(
            @RequestParam(value = "beforeId", required = false) Long beforeId,
            @RequestParam(value = "limit", defaultValue = "30") int limit
    ) {
        CommunityChatPageResponseDto response = communityChatService.getRecentMessages(beforeId, limit);
        return ResponseEntity.ok(response);
    }
}
