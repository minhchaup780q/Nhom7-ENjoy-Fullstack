package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.request.PendingRegistrationDto;
import edu.vn.iuh.fit.authservice.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final long OTP_TTL_MINUTES = 5;
    private static final long REGISTRATION_TTL_MINUTES = 15;

    @Override
    public String generateOtp() {
        SecureRandom secureRandom = new SecureRandom();
        int otpCode = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otpCode);
    }

    @Override
    public void savePendingRegistration(String email, PendingRegistrationDto dto, String otpCode) {
        String otpKey = "otp:" + email;
        String pendingRegistrationKey = "pending_registrationDto:" + email;

        redisTemplate.opsForValue().set(otpKey, otpCode, Duration.ofMinutes(OTP_TTL_MINUTES));
        redisTemplate.opsForValue().set(pendingRegistrationKey, dto, Duration.ofMinutes(REGISTRATION_TTL_MINUTES));
    }

    @Override
    public PendingRegistrationDto getPendingRegistration(String email) {
        String pendingRegistrationKey = "pending_registrationDto:" + email;
        Object obj = redisTemplate.opsForValue().get(pendingRegistrationKey);
        if (obj instanceof PendingRegistrationDto) {
            return (PendingRegistrationDto) obj;
        }
        return null;
    }

    @Override
    public String getOtp(String email) {
        String otpKey = "otp:" + email;
        Object obj = redisTemplate.opsForValue().get(otpKey);
        return obj != null ? obj.toString() : null;
    }

    @Override
    public boolean validateOtp(String email, String otpCode) {
        String storedOtp = getOtp(email);
        return storedOtp != null && storedOtp.equals(otpCode);
    }

    @Override
    public void clearRegistrationData(String email) {
        String otpKey = "otp:" + email;
        String pendingRegistrationKey = "pending_registrationDto:" + email;

        redisTemplate.delete(otpKey);
        redisTemplate.delete(pendingRegistrationKey);
    }
}
