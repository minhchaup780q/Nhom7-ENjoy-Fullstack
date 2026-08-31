package edu.vn.iuh.fit.authservice.services;

import edu.vn.iuh.fit.authservice.dto.request.PendingRegistrationDto;

public interface OtpService {
    String generateOtp();
    void savePendingRegistration(String email, PendingRegistrationDto dto, String otpCode);
    PendingRegistrationDto getPendingRegistration(String email);
    String getOtp(String email);
    boolean validateOtp(String email, String otpCode);
    void clearRegistrationData(String email);
}
