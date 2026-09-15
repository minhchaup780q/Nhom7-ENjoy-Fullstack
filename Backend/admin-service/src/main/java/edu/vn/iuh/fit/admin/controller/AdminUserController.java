package edu.vn.iuh.fit.admin.controller;

import edu.vn.iuh.fit.admin.client.UserClient;
import edu.vn.iuh.fit.admin.dto.response.UserCountResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserClient userClient;

    @GetMapping("/count")
    public ResponseEntity<UserCountResponse> getUserCount() {
        Long count = 0L;
        try {
            Long fetchedCount = userClient.getTotalUserCount();
            if (fetchedCount != null) {
                count = fetchedCount;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error calling user-service via OpenFeign in AdminUserController: " + e.getMessage());
        }

        return ResponseEntity.ok(UserCountResponse.builder()
                .totalUsers(count)
                .build());
    }
}
