package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.request.PendingRegistrationDto;
import edu.vn.iuh.fit.authservice.entities.enums.AuthProvider;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("OTP behavior tests")
class OtpServiceImplTest {

    private RedisTemplate<String, Object> redisTemplate;
    private ValueOperations<String, Object> valueOperations;
    private final Map<String, Object> redisValues = new HashMap<>();
    private final Map<String, Duration> expirations = new HashMap<>();
    private OtpServiceImpl otpService;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() {
        redisTemplate = Mockito.mock(RedisTemplate.class);
        valueOperations = Mockito.mock(ValueOperations.class);
        redisValues.clear();
        expirations.clear();
        otpService = new OtpServiceImpl(redisTemplate);

        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        lenient().doAnswer(invocation -> {
                    String key = invocation.getArgument(0);
                    Object value = invocation.getArgument(1);
                    Duration ttl = invocation.getArgument(2);
                    redisValues.put(key, value);
                    expirations.put(key, ttl);
                    return null;
                }).when(valueOperations).set(Mockito.anyString(), Mockito.any(), Mockito.any(Duration.class));
        lenient().when(valueOperations.get(Mockito.anyString()))
                .thenAnswer(invocation -> redisValues.get(invocation.getArgument(0)));
        lenient().when(redisTemplate.delete(Mockito.anyString())).thenAnswer(invocation ->
                redisValues.remove(invocation.getArgument(0)) != null);
    }

    /**
     * Verifies that registration data and OTP are stored with their configured TTLs.
     */
    @Test
    @DisplayName("TC31: Lưu đăng ký tạm và OTP với thời hạn tương ứng")
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

        assertThat(redisValues.get("otp:" + email)).isEqualTo(otp);
        assertThat(expirations.get("otp:" + email)).isEqualTo(Duration.ofMinutes(5));
        assertThat(redisValues.get("pending_registrationDto:" + email)).isEqualTo(pendingRegistration);
        assertThat(expirations.get("pending_registrationDto:" + email)).isEqualTo(Duration.ofMinutes(15));
    }

    /**
     * Verifies that an existing registration object is returned with its DTO type.
     */
    @Test
    @DisplayName("TC32: Trả thông tin đăng ký tạm khi key tồn tại")
    void getPendingRegistration_keyExists_returnsCastedDto() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";
        PendingRegistrationDto pendingRegistration = PendingRegistrationDto.builder()
                .email(email)
                .username("New User")
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.LOCAL)
                .build();
        redisValues.put("pending_registrationDto:" + email, pendingRegistration);

        // Act
        PendingRegistrationDto actual = otpService.getPendingRegistration(email);

        // Assert
        assertThat(actual).isSameAs(pendingRegistration);
    }

    /**
     * Verifies that OTP validation succeeds when the submitted code matches Redis.
     */
    @Test
    @DisplayName("TC33: Mã OTP trùng khớp được xác nhận")
    void validateOtp_matchingOtp_returnsTrue() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";
        String otp = "123456";
        redisValues.put("otp:" + email, otp);

        // Act
        boolean valid = otpService.validateOtp(email, otp);

        // Assert
        assertThat(valid).isTrue();
    }

    /**
     * Verifies that OTP validation fails when the submitted code does not match Redis.
     */
    @Test
    @DisplayName("TC34: Mã OTP không trùng khớp bị từ chối")
    void validateOtp_wrongOtp_returnsFalse() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";
        redisValues.put("otp:" + email, "123456");

        // Act
        boolean valid = otpService.validateOtp(email, "654321");

        // Assert
        assertThat(valid).isFalse();
    }

    /**
     * Verifies that clearing registration data deletes both temporary Redis keys.
     */
    @Test
    @DisplayName("TC35: Xóa OTP và thông tin đăng ký tạm")
    void clearRegistrationData_always_deletesBothKeys() {
        // Arrange
        String email = "newuser@enjoy.edu.vn";
        redisValues.put("otp:" + email, "123456");
        redisValues.put("pending_registrationDto:" + email, PendingRegistrationDto.builder()
                .email(email)
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.LOCAL)
                .build());

        // Act
        otpService.clearRegistrationData(email);

        assertThat(redisValues).doesNotContainKeys(
                "otp:" + email, "pending_registrationDto:" + email);
    }
}
