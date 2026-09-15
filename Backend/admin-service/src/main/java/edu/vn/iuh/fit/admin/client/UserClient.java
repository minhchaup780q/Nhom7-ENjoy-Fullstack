package edu.vn.iuh.fit.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.Map;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/user/internal/count")
    Long getTotalUserCount();

    @GetMapping("/api/user/internal/roles/count")
    Map<String, Long> countUsersByRole();

    @GetMapping("/api/user/internal/activity/stats")
    Map<String, Long> getParentActivityStats();
}
