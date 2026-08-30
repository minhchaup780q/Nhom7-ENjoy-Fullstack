package edu.vn.iuh.fit.authservice.client;

import edu.vn.iuh.fit.authservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.authservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserCreateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/user/internal/by-email")
    UserAuthResponse getUserByEmail(@RequestParam("email") String email);

    @PostMapping("/api/user/internal/create")
    UserCreateResponse createUserProfile(@RequestBody UserCreateRequest request);
}
