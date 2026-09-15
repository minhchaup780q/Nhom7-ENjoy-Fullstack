package edu.vn.iuh.fit.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/user/internal/count")
    Long getTotalUserCount();
}
