package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.request.PendingRegistrationDto;
import edu.vn.iuh.fit.authservice.entities.enums.AuthProvider;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("OTP Service Unit Tests")
class OtpServiceImplTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private OtpServiceImpl otpService;

    /**
     * Verifies that registration data and OTP are stored with their configured TTLs.
     */
    @Test
    @DisplayName("savePendingRegistration: Lưu OTP với TTL 5 phút")
    void savePendingRegistration_valid_setsOtpWithTtl5Min() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";
        String otp = "123456";
        PendingRegistrationDto pendingRegistration = PendingRegistrationDto.builder()
                .email(email)
                .passwordHash("encoded-password")
                .username("New User")
                .birthday(LocalDate.of(2000, 1, 1))
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.LOCAL)
                .build();
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // Act
        otpService.savePendingRegistration(email, pendingRegistration, otp);

        // Assert
        verify(valueOperations).set("otp:" + email, otp, Duration.ofMinutes(5));
        verify(valueOperations).set(
                "pending_registrationDto:" + email, pendingRegistration, Duration.ofMinutes(15));
    }

    /**
     * Verifies that an existing registration object is returned with its DTO type.
     */
    @Test
    @DisplayName("getPendingRegistration: Lấy đúng DTO khi key tồn tại")
    void getPendingRegistration_keyExists_returnsCastedDto() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";
        PendingRegistrationDto pendingRegistration = PendingRegistrationDto.builder()
                .email(email)
                .username("New User")
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.LOCAL)
                .build();
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("pending_registrationDto:" + email)).thenReturn(pendingRegistration);

        // Act
        PendingRegistrationDto actual = otpService.getPendingRegistration(email);

        // Assert
        assertThat(actual).isSameAs(pendingRegistration);
        verify(valueOperations).get("pending_registrationDto:" + email);
    }

    /**
     * Verifies that OTP validation succeeds when the submitted code matches Redis.
     */
    @Test
    @DisplayName("validateOtp: Mã OTP trùng khớp trả về true")
    void validateOtp_matchingOtp_returnsTrue() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";
        String otp = "123456";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("otp:" + email)).thenReturn(otp);

        // Act
        boolean valid = otpService.validateOtp(email, otp);

        // Assert
        assertThat(valid).isTrue();
        verify(valueOperations).get("otp:" + email);
    }

    /**
     * Verifies that OTP validation fails when the submitted code does not match Redis.
     */
    @Test
    @DisplayName("validateOtp: Mã OTP không trùng khớp trả về false")
    void validateOtp_wrongOtp_returnsFalse() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("otp:" + email)).thenReturn("123456");

        // Act
        boolean valid = otpService.validateOtp(email, "654321");

        // Assert
        assertThat(valid).isFalse();
        verify(valueOperations).get("otp:" + email);
    }

    /**
     * Verifies that clearing registration data deletes both temporary Redis keys.
     */
    @Test
    @DisplayName("clearRegistrationData: Xóa cả key OTP và thông tin đăng ký tạm")
    void clearRegistrationData_always_deletesBothKeys() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";

        // Act
        otpService.clearRegistrationData(email);

        // Assert
        verify(redisTemplate).delete("otp:" + email);
        verify(redisTemplate).delete("pending_registrationDto:" + email);
    }
}
