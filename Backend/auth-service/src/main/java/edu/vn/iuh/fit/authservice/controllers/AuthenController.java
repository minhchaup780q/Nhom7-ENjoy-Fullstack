package edu.vn.iuh.fit.authservice.controllers;

import edu.vn.iuh.fit.authservice.dto.request.*;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;
import edu.vn.iuh.fit.authservice.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenController {

    private final AuthenticationService authenticationService;
    private final edu.vn.iuh.fit.authservice.services.JWTService jwtService;
    private final edu.vn.iuh.fit.authservice.services.EmailService emailService;

    @PostMapping("/internal/send-family-invite")
    public ResponseEntity<Void> sendFamilyInvite(@RequestBody SendFamilyInviteEmailRequest request) {
        emailService.sendFamilyInviteMail(request.getRecipient(), request.getParentName(), request.getOtpCode());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authenticationService.login(request);
        return ResponseEntity.ok().body(loginResponse);
    }

//    xử lý: kiểm tra email đã được đăng kí chưa, lưu tạm userInfor + OTP vào Redis
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        authenticationService.register(request);
        return ResponseEntity.ok().build();
    }

//    xử lý: so OTP người dùng nhập với trong Redis, tạo user lưu vào db, xóa Redis
    @PostMapping("/verify-otp")
    public ResponseEntity<Void> verifyOtp(@RequestBody VerifyOtpRequest request) {
        authenticationService.verifyOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<Void> resendOtp(@RequestBody ResendOtpRequest request) {
        authenticationService.resendOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login-by-google")
    public ResponseEntity<LoginResponse> loginByGoogle(@RequestBody GoogleAuthRequest request) {
        LoginResponse response = authenticationService.googleAuth(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader(value = "X-User-Id") Long userId,
            @RequestBody ChangePasswordRequest request
    ) {
        authenticationService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestHeader(value = "refreshToken", required = false) String refreshToken) {
        LoginResponse response = authenticationService.refresh(refreshToken);
        return ResponseEntity.ok(response);
    }
}
