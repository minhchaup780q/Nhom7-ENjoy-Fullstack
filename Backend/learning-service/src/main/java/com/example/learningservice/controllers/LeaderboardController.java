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
}
