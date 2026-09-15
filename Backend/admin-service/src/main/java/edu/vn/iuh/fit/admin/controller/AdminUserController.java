package edu.vn.iuh.fit.admin.controller;

import edu.vn.iuh.fit.admin.dto.response.UserCountResponse;
import edu.vn.iuh.fit.admin.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/count")
    public ResponseEntity<UserCountResponse> getUserCount() {
        UserCountResponse response = adminUserService.getUserCount();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/roles/count")
    public ResponseEntity<Map<String, Long>> getRolesCount() {
        return ResponseEntity.ok(adminUserService.getRolesCount());
    }

    @GetMapping("/activity/stats")
    public ResponseEntity<Map<String, Long>> getActivityStats() {
        return ResponseEntity.ok(adminUserService.getActivityStats());
    }
}
