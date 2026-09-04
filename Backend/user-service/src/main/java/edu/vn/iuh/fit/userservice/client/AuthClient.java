package edu.vn.iuh.fit.userservice.client;

import edu.vn.iuh.fit.userservice.dto.request.SendFamilyInviteEmailRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "auth-service", url = "${auth-service.url:http://localhost:8084}")
public interface AuthClient {

    @PostMapping("/api/auth/internal/send-family-invite")
    void sendFamilyInvite(@RequestBody SendFamilyInviteEmailRequest request);
}
