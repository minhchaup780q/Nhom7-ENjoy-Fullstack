package com.example.learningservice.controllers;

import com.example.learningservice.dto.LeaderboardResponseDto;
import com.example.learningservice.services.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/current")
    public ResponseEntity<LeaderboardResponseDto> getCurrentLeaderboard(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "avatarUrl", required = false) String avatarUrl,
            @RequestHeader(value = "X-User-Email", required = false) String email
    ) {
        Long userId = (queryUserId != null) ? queryUserId : headerUserId;
        if (userId == null) {
            userId = 1L; // Fallback an toàn cho local dev nếu chưa có gateway header
        }

        String displayName = username;
        if ((displayName == null || displayName.isBlank()) && email != null && email.contains("@")) {
            displayName = email.substring(0, email.indexOf("@"));
        }

        LeaderboardResponseDto response = leaderboardService.getCurrentLeaderboard(userId, displayName, avatarUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/streak")
    public ResponseEntity<LeaderboardResponseDto.StreakDto> getUserStreak(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false) Long queryUserId
    ) {
        Long userId = (queryUserId != null) ? queryUserId : headerUserId;
        if (userId == null) {
            userId = 1L;
        }

        LeaderboardResponseDto.StreakDto streakDto = leaderboardService.getUserStreak(userId);
        return ResponseEntity.ok(streakDto);
    }

    /**
     * API Real-time: Tiếp nhận yêu cầu cộng XP, đóng gói thành AddXpEvent
     * và đẩy ngay vào RabbitMQ rồi trả kết quả về lập tức cho Client.
     */
    @PostMapping({"/add-xp", "/addXp"})
    public ResponseEntity<java.util.Map<String, Object>> addXp(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody com.example.learningservice.dto.AddXpRequestDto request
    ) {
        Long userId = (request.getUserId() != null) ? request.getUserId() : headerUserId;
        if (userId == null) {
            userId = 1L;
        }
        request.setUserId(userId);

        if ((request.getUsername() == null || request.getUsername().isBlank()) && email != null && email.contains("@")) {
            request.setUsername(email.substring(0, email.indexOf("@")));
        }

        leaderboardService.enqueueAddXp(request);

        return ResponseEntity.ok(java.util.Map.of(
                "status", "QUEUED",
                "message", "Sự kiện cộng XP đã được tiếp nhận và đưa vào hàng đợi RabbitMQ xử lý tức thì",
                "userId", userId,
                "xpAmount", request.getXpAmount()
        ));
    }
}
