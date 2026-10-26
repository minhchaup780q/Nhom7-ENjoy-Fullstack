package edu.vn.iuh.fit.admin.controller;

import edu.vn.iuh.fit.admin.dto.response.CohortRetentionRowResponse;
import edu.vn.iuh.fit.admin.dto.response.OverviewResponse;
import edu.vn.iuh.fit.admin.dto.response.UserCountResponse;
import edu.vn.iuh.fit.admin.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
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

    @GetMapping("/overview")
    public ResponseEntity<OverviewResponse> getOverview() {
        return ResponseEntity.ok(adminUserService.getOverview());
    }

    @GetMapping("/cohort-retention")
    public ResponseEntity<List<CohortRetentionRowResponse>> getCohortRetention(
            @RequestParam(value = "days", defaultValue = "7") int days) {
        return ResponseEntity.ok(adminUserService.getCohortRetention(days));
    }
}
