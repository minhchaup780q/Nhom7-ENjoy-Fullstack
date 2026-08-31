package edu.vn.iuh.fit.authservice.services;

import edu.vn.iuh.fit.authservice.dto.request.*;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;

public interface AuthenticationService {

    LoginResponse login(LoginRequest request);

    LoginResponse refresh(String refreshToken);

    void register(RegisterRequest request);

    void verifyOtp(VerifyOtpRequest request);

    void resendOtp(ResendOtpRequest request);

    LoginResponse googleAuth(GoogleAuthRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);
}
