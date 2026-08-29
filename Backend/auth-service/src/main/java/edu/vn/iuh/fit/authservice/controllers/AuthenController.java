package edu.vn.iuh.fit.authservice.controllers;

import edu.vn.iuh.fit.authservice.dto.request.LoginRequest;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;
import edu.vn.iuh.fit.authservice.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.apache.http.protocol.HTTP;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
            LoginResponse loginResponse = authenticationService.login(request);
            return ResponseEntity.ok().body(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestHeader(value = "refreshToken", required = false) String refreshToken) {
        LoginResponse response = authenticationService.refresh(refreshToken);
        return ResponseEntity.ok(response);
    }
}

