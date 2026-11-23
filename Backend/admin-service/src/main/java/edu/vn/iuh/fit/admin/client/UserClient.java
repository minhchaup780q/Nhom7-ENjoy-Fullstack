package edu.vn.iuh.fit.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/user/internal/count")
    Long getTotalUserCount();

    // time: ISO date-time, vd. 2026-10-01T00:00:00
    @GetMapping("/api/user/internal/count/created-before")
    Long countUsersCreatedBefore(@RequestParam("time") String time);

    @GetMapping("/api/user/internal/roles/count")
    Map<String, Long> countUsersByRole();
                                                         
    @GetMapping("/api/user/internal/activity/stats")
    Map<String, Long> getParentActivityStats();
}
