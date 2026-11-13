package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.client.UserClient;
import edu.vn.iuh.fit.authservice.dto.request.EmailDetails;
import edu.vn.iuh.fit.authservice.dto.request.PendingRegistrationDto;
import edu.vn.iuh.fit.authservice.dto.request.RegisterRequest;
import edu.vn.iuh.fit.authservice.entities.enums.AuthProvider;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import edu.vn.iuh.fit.authservice.repositories.AccountRepository;
import edu.vn.iuh.fit.authservice.services.ActiveUserService;
import edu.vn.iuh.fit.authservice.services.EmailService;
import edu.vn.iuh.fit.authservice.services.JWTService;
import edu.vn.iuh.fit.authservice.services.OtpService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Register Feature Unit Tests")
class RegisterTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private UserClient userClient;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JWTService jwtService;

    @Mock
    private OtpService otpService;

    @Mock
    private EmailService emailService;

    @Mock
    private ActiveUserService activeUserService;

    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    /**
     * Test Case 1: Đăng ký tài khoản mới với độ tuổi người lớn (> 16 tuổi) lưu thông tin chờ với vai trò ROLE_PARENT.
     */
    @Test
    @DisplayName("register: Email mới và độ tuổi người lớn (> 16 tuổi) -> Lưu pending với ROLE_PARENT")
    void register_newEmailAdultAge_savesAsPendingWithRoleParent() {
        // Arrange
        String email = "adult@enjoy.edu.vn";
        String rawPwd = "AdultPassword@123";
        LocalDate birthday = LocalDate.now().minusYears(25);
        RegisterRequest request = RegisterRequest.builder()
                .email(email)
                .password(rawPwd)
                .username("AdultUser")
                .birthday(birthday)
                .build();

        when(accountRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(rawPwd)).thenReturn("hashed_adult_pwd");
        when(otpService.generateOtp()).thenReturn("123456");

        ArgumentCaptor<PendingRegistrationDto> pendingDtoCaptor = ArgumentCaptor.forClass(PendingRegistrationDto.class);
        ArgumentCaptor<EmailDetails> emailDetailsCaptor = ArgumentCaptor.forClass(EmailDetails.class);

        // Act
        authenticationService.register(request);

        // Assert
        verify(accountRepository, times(1)).existsByEmail(email);
        verify(passwordEncoder, times(1)).encode(rawPwd);
        verify(otpService, times(1)).savePendingRegistration(eq(email), pendingDtoCaptor.capture(), eq("123456"));
        verify(emailService, times(1)).sendOtpHtmlMail(emailDetailsCaptor.capture());

        PendingRegistrationDto savedDto = pendingDtoCaptor.getValue();
        assertThat(savedDto).isNotNull();
        assertThat(savedDto.getEmail()).isEqualTo(email);
        assertThat(savedDto.getPasswordHash()).isEqualTo("hashed_adult_pwd");
        assertThat(savedDto.getUsername()).isEqualTo("AdultUser");
        assertThat(savedDto.getBirthday()).isEqualTo(birthday);
        assertThat(savedDto.getRole()).isEqualTo(UserRole.ROLE_PARENT);
        assertThat(savedDto.getProvider()).isEqualTo(AuthProvider.LOCAL);

        EmailDetails sentEmail = emailDetailsCaptor.getValue();
        assertThat(sentEmail.getRecipient()).isEqualTo(email);
        assertThat(sentEmail.getMsgBody()).isEqualTo("123456");
        assertThat(sentEmail.getSubject()).contains("Mã xác thực OTP");
    }

    /**
     * Test Case 2: Đăng ký tài khoản mới cho trẻ em 10 tuổi (<= 16 tuổi) lưu thông tin chờ với vai trò ROLE_CHILDREN.
     */
    @Test
    @DisplayName("register: Email mới và trẻ em 10 tuổi (<= 16 tuổi) -> Lưu pending với ROLE_CHILDREN")
    void register_newEmailChildAge10_savesAsPendingWithRoleChildren() {
        // Arrange
        String email = "child10@enjoy.edu.vn";
        String rawPwd = "ChildPassword@123";
        LocalDate birthday = LocalDate.now().minusYears(10);
        RegisterRequest request = RegisterRequest.builder()
                .email(email)
                .password(rawPwd)
                .username("Child10")
                .birthday(birthday)
                .build();

        when(accountRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(rawPwd)).thenReturn("hashed_child_pwd");
        when(otpService.generateOtp()).thenReturn("654321");

        ArgumentCaptor<PendingRegistrationDto> pendingDtoCaptor = ArgumentCaptor.forClass(PendingRegistrationDto.class);

        // Act
        authenticationService.register(request);

        // Assert
        verify(otpService, times(1)).savePendingRegistration(eq(email), pendingDtoCaptor.capture(), eq("654321"));

        PendingRegistrationDto savedDto = pendingDtoCaptor.getValue();
        assertThat(savedDto.getRole()).isEqualTo(UserRole.ROLE_CHILDREN);
        assertThat(savedDto.getEmail()).isEqualTo(email);
        assertThat(savedDto.getUsername()).isEqualTo("Child10");
        assertThat(savedDto.getBirthday()).isEqualTo(birthday);
    }

    /**
     * Test Case 3: Đăng ký với ngày sinh vừa tròn 16 tuổi (giá trị biên) -> được phân quyền ROLE_CHILDREN.
     */
    @Test
    @DisplayName("register: Ngày sinh vừa tròn 16 tuổi (Boundary <= 16) -> Phân quyền ROLE_CHILDREN")
    void register_birthday_exactly16YearsOld_roleIsChildren() {
        // Arrange
        String email = "teen16@enjoy.edu.vn";
        String rawPwd = "TeenPassword@123";
        LocalDate birthday = LocalDate.now().minusYears(16);
        RegisterRequest request = RegisterRequest.builder()
                .email(email)
                .password(rawPwd)
                .username("Teen16")
                .birthday(birthday)
                .build();

        when(accountRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(rawPwd)).thenReturn("hashed_teen_pwd");
        when(otpService.generateOtp()).thenReturn("112233");

        ArgumentCaptor<PendingRegistrationDto> pendingDtoCaptor = ArgumentCaptor.forClass(PendingRegistrationDto.class);

        // Act
        authenticationService.register(request);

        // Assert
        verify(otpService, times(1)).savePendingRegistration(eq(email), pendingDtoCaptor.capture(), eq("112233"));

        PendingRegistrationDto savedDto = pendingDtoCaptor.getValue();
        assertThat(savedDto.getRole()).isEqualTo(UserRole.ROLE_CHILDREN);
    }

    /**
     * Test Case 4: Đăng ký với ngày sinh vừa tròn 17 tuổi (giá trị biên) -> được phân quyền ROLE_PARENT.
     */
    @Test
    @DisplayName("register: Ngày sinh vừa tròn 17 tuổi (Boundary > 16) -> Phân quyền ROLE_PARENT")
    void register_birthday_17YearsOld_roleIsParent() {
        // Arrange
        String email = "teen17@enjoy.edu.vn";
        String rawPwd = "TeenPassword@123";
        LocalDate birthday = LocalDate.now().minusYears(17);
        RegisterRequest request = RegisterRequest.builder()
                .email(email)
                .password(rawPwd)
                .username("Teen17")
                .birthday(birthday)
                .build();

        when(accountRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(rawPwd)).thenReturn("hashed_parent_pwd");
        when(otpService.generateOtp()).thenReturn("445566");

        ArgumentCaptor<PendingRegistrationDto> pendingDtoCaptor = ArgumentCaptor.forClass(PendingRegistrationDto.class);

        // Act
        authenticationService.register(request);

        // Assert
        verify(otpService, times(1)).savePendingRegistration(eq(email), pendingDtoCaptor.capture(), eq("445566"));

        PendingRegistrationDto savedDto = pendingDtoCaptor.getValue();
        assertThat(savedDto.getRole()).isEqualTo(UserRole.ROLE_PARENT);
    }

    /**
     * Test Case 5: Đăng ký với birthday mang giá trị null -> mặc định phân quyền ROLE_PARENT.
     */
    @Test
    @DisplayName("register: Ngày sinh là null -> Mặc định phân quyền ROLE_PARENT")
    void register_newEmailNullBirthday_defaultsToRoleParent() {
        // Arrange
        String email = "null_birthday@enjoy.edu.vn";
        String rawPwd = "PassNoBirthday@123";
        RegisterRequest request = RegisterRequest.builder()
                .email(email)
                .password(rawPwd)
                .username("NoBirthdayUser")
                .birthday(null)
                .build();

        when(accountRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(rawPwd)).thenReturn("hashed_default_pwd");
        when(otpService.generateOtp()).thenReturn("998877");

        ArgumentCaptor<PendingRegistrationDto> pendingDtoCaptor = ArgumentCaptor.forClass(PendingRegistrationDto.class);

        // Act
        authenticationService.register(request);

        // Assert
        verify(otpService, times(1)).savePendingRegistration(eq(email), pendingDtoCaptor.capture(), eq("998877"));

        PendingRegistrationDto savedDto = pendingDtoCaptor.getValue();
        assertThat(savedDto.getRole()).isEqualTo(UserRole.ROLE_PARENT);
        assertThat(savedDto.getBirthday()).isNull();
    }

    /**
     * Test Case 6: Đăng ký thất bại khi email đã tồn tại trong hệ thống, ném ResponseStatusException 400 BAD_REQUEST.
     */
    @Test
    @DisplayName("register: Email đã được đăng ký -> Ném ResponseStatusException 400 BAD_REQUEST")
    void register_duplicateEmail_throwsResponseStatusException400() {
        // Arrange
        String duplicateEmail = "existing@enjoy.edu.vn";
        RegisterRequest request = RegisterRequest.builder()
                .email(duplicateEmail)
                .password("Password@123")
                .username("ExistingUser")
                .birthday(LocalDate.of(1995, 5, 20))
                .build();

        when(accountRepository.existsByEmail(duplicateEmail)).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authenticationService.register(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(rse.getReason()).isEqualTo("Email này đã được đăng ký!");
                });

        verify(accountRepository, times(1)).existsByEmail(duplicateEmail);
        verifyNoInteractions(passwordEncoder);
        verifyNoInteractions(otpService);
        verifyNoInteractions(emailService);
        verifyNoInteractions(userClient);
        verifyNoInteractions(activeUserService);
        verifyNoInteractions(jwtService);
    }
}

