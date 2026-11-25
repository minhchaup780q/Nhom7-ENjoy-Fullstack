package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.client.UserClient;
import edu.vn.iuh.fit.authservice.dto.request.EmailDetails;
import edu.vn.iuh.fit.authservice.dto.request.PendingRegistrationDto;
import edu.vn.iuh.fit.authservice.dto.request.RegisterRequest;
import edu.vn.iuh.fit.authservice.dto.request.ResendOtpRequest;
import edu.vn.iuh.fit.authservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.authservice.dto.request.VerifyOtpRequest;
import edu.vn.iuh.fit.authservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.authservice.entities.Account;
import edu.vn.iuh.fit.authservice.entities.enums.AuthProvider;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import edu.vn.iuh.fit.authservice.controllers.AuthenController;
import edu.vn.iuh.fit.authservice.exceptions.GlobalExceptionHandler;
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
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("Registration API behavior tests")
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

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    private MockMvc registrationApi() {
        return MockMvcBuilders.standaloneSetup(
                        new AuthenController(authenticationService, jwtService, emailService, activeUserService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    /**
     * Test Case 1: Đăng ký tài khoản mới với độ tuổi người lớn (> 16 tuổi) lưu thông tin chờ với vai trò ROLE_PARENT.
     */
    @Test
    @DisplayName("TC21: Đăng ký tài khoản mới ở độ tuổi người lớn")
    void register_newEmailAdultAge_savesAsPendingWithRoleParent() throws Exception {
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

        registrationApi().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

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
    @DisplayName("TC22: Đăng ký tài khoản 10 tuổi lưu vai trò trẻ em")
    void register_newEmailChildAge10_savesAsPendingWithRoleChildren() throws Exception {
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

        registrationApi().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

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
    @DisplayName("TC23: Đăng ký ở tuổi 16 được phân vai trò trẻ em")
    void register_birthday_exactly16YearsOld_roleIsChildren() throws Exception {
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

        registrationApi().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Assert
        verify(otpService, times(1)).savePendingRegistration(eq(email), pendingDtoCaptor.capture(), eq("112233"));

        PendingRegistrationDto savedDto = pendingDtoCaptor.getValue();
        assertThat(savedDto.getRole()).isEqualTo(UserRole.ROLE_CHILDREN);
    }

    /**
     * Test Case 4: Đăng ký với ngày sinh vừa tròn 17 tuổi (giá trị biên) -> được phân quyền ROLE_PARENT.
     */
    @Test
    @DisplayName("TC24: Đăng ký ở tuổi 17 được phân vai trò phụ huynh")
    void register_birthday_17YearsOld_roleIsParent() throws Exception {
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

        registrationApi().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

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
    @DisplayName("TC25: Email đã tồn tại bị từ chối khi đăng ký")
    void register_duplicateEmail_throwsResponseStatusException400() throws Exception {
        // Arrange
        String duplicateEmail = "existing@enjoy.edu.vn";
        RegisterRequest request = RegisterRequest.builder()
                .email(duplicateEmail)
                .password("Password@123")
                .username("ExistingUser")
                .birthday(LocalDate.of(1995, 5, 20))
                .build();

        when(accountRepository.existsByEmail(duplicateEmail)).thenReturn(true);

        registrationApi().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email này đã được đăng ký!"));

        verify(accountRepository, times(1)).existsByEmail(duplicateEmail);
        verifyNoInteractions(passwordEncoder);
        verifyNoInteractions(otpService);
        verifyNoInteractions(emailService);
        verifyNoInteractions(userClient);
        verifyNoInteractions(activeUserService);
        verifyNoInteractions(jwtService);
    }

    // ==========================================
    // VERIFY OTP TEST CASES
    // ==========================================

    /**
     * Test Case 7: Xác thực OTP thành công -> Tài khoản được lưu vào database và tạo profile ở user-service.
     */
    @Test
    @DisplayName("TC26: OTP đăng ký được xác nhận và tạo tài khoản")
    void verifyOtp_validRequest_accountSavedToDb() throws Exception {
        // Arrange
        String email = "verify_success@enjoy.edu.vn";
        String otp = "123456";
        VerifyOtpRequest request = VerifyOtpRequest.builder()
                .email(email)
                .otp(otp)
                .build();

        PendingRegistrationDto pendingDto = PendingRegistrationDto.builder()
                .email(email)
                .passwordHash("hashed_secret_pwd")
                .username("SuccessUser")
                .birthday(LocalDate.of(2000, 1, 1))
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.LOCAL)
                .build();

        Account mockSavedAccount = Account.builder()
                .id(10L)
                .email(email)
                .passwordHash(pendingDto.getPasswordHash())
                .role(pendingDto.getRole())
                .provider(pendingDto.getProvider())
                .isEnabled(true)
                .build();

        when(otpService.getPendingRegistration(email)).thenReturn(pendingDto);
        when(accountRepository.save(any(Account.class))).thenReturn(mockSavedAccount);
        when(userClient.createUserProfile(any(UserCreateRequest.class)))
                .thenReturn(UserCreateResponse.builder().id(100L).build());

        ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
        ArgumentCaptor<UserCreateRequest> userCreateReqCaptor = ArgumentCaptor.forClass(UserCreateRequest.class);

        registrationApi().perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Assert
        verify(otpService, times(1)).getPendingRegistration(email);
        verify(accountRepository, times(1)).save(accountCaptor.capture());
        verify(userClient, times(1)).createUserProfile(userCreateReqCaptor.capture());
        verify(otpService, times(1)).clearRegistrationData(email);

        Account savedAccount = accountCaptor.getValue();
        assertThat(savedAccount.getEmail()).isEqualTo(email);
        assertThat(savedAccount.getPasswordHash()).isEqualTo("hashed_secret_pwd");
        assertThat(savedAccount.getRole()).isEqualTo(UserRole.ROLE_PARENT);
        assertThat(savedAccount.getProvider()).isEqualTo(AuthProvider.LOCAL);
        assertThat(savedAccount.getIsEnabled()).isTrue();

        UserCreateRequest createdUserReq = userCreateReqCaptor.getValue();
        assertThat(createdUserReq.getAccountId()).isEqualTo(10L);
        assertThat(createdUserReq.getEmail()).isEqualTo(email);
        assertThat(createdUserReq.getUsername()).isEqualTo("SuccessUser");
        assertThat(createdUserReq.getRole()).isEqualTo(UserRole.ROLE_PARENT);
    }

    /**
     * Test Case 8: Xác thực OTP thất bại khi thông tin đăng ký chờ đã hết hạn hoặc không tìm thấy, ném ResponseStatusException 400 BAD_REQUEST.
     */
    @Test
    @DisplayName("TC27: Xác nhận OTP bị từ chối khi đăng ký tạm hết hạn")
    void verifyOtp_pendingDataExpiredOrNotFound_throwsBadRequest400() throws Exception {
        // Arrange
        String email = "expired@enjoy.edu.vn";
        VerifyOtpRequest request = VerifyOtpRequest.builder()
                .email(email)
                .otp("123456")
                .build();

        when(otpService.getPendingRegistration(email)).thenReturn(null);

        registrationApi().perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Yêu cầu đăng ký đã hết hạn (quá 5 phút). Vui lòng đăng ký lại."));

        verify(otpService, times(1)).getPendingRegistration(email);
        verifyNoInteractions(accountRepository);
        verifyNoInteractions(userClient);
    }

    /**
     * Test Case 9: Gọi user-service qua OpenFeign thất bại/ném Exception -> Account vẫn được lưu thành công vào auth_db và dọn dẹp Redis.
     */
    @Test
    @DisplayName("TC28: Lỗi User Service không ngăn tạo tài khoản sau xác nhận OTP")
    void verifyOtp_userClientThrowsException_accountStillSavedInDb() throws Exception {
        // Arrange
        String email = "feign_error@enjoy.edu.vn";
        VerifyOtpRequest request = VerifyOtpRequest.builder()
                .email(email)
                .otp("123456")
                .build();

        PendingRegistrationDto pendingDto = PendingRegistrationDto.builder()
                .email(email)
                .passwordHash("hashed_pwd_feign")
                .username("FeignUser")
                .birthday(LocalDate.of(2005, 10, 10))
                .role(UserRole.ROLE_CHILDREN)
                .provider(AuthProvider.LOCAL)
                .build();

        Account mockSavedAccount = Account.builder()
                .id(20L)
                .email(email)
                .passwordHash(pendingDto.getPasswordHash())
                .role(pendingDto.getRole())
                .provider(pendingDto.getProvider())
                .isEnabled(true)
                .build();

        when(otpService.getPendingRegistration(email)).thenReturn(pendingDto);
        when(accountRepository.save(any(Account.class))).thenReturn(mockSavedAccount);
        when(userClient.createUserProfile(any(UserCreateRequest.class)))
                .thenThrow(new RuntimeException("Connection refused to user-service"));

        registrationApi().perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Assert
        verify(accountRepository, times(1)).save(any(Account.class));
        verify(userClient, times(1)).createUserProfile(any(UserCreateRequest.class));
        verify(otpService, times(1)).clearRegistrationData(email);
    }

    // ==========================================
    // RESEND OTP TEST CASES
    // ==========================================

    /**
     * Test Case 10: Gửi lại mã OTP khi dữ liệu đăng ký tạm còn tồn tại -> Sinh mã OTP mới và gửi email thành công.
     */
    @Test
    @DisplayName("TC29: Gửi lại OTP khi thông tin đăng ký còn hiệu lực")
    void resendOtp_pendingDataExists_generatesNewOtpAndSendsEmail() throws Exception {
        // Arrange
        String email = "resend_user@enjoy.edu.vn";
        ResendOtpRequest request = ResendOtpRequest.builder()
                .email(email)
                .build();

        PendingRegistrationDto pendingDto = PendingRegistrationDto.builder()
                .email(email)
                .passwordHash("hashed_resend_pwd")
                .username("ResendUser")
                .birthday(LocalDate.of(1998, 8, 18))
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.LOCAL)
                .build();

        String newOtp = "789012";
        when(otpService.getPendingRegistration(email)).thenReturn(pendingDto);
        when(otpService.generateOtp()).thenReturn(newOtp);

        ArgumentCaptor<EmailDetails> emailDetailsCaptor = ArgumentCaptor.forClass(EmailDetails.class);

        registrationApi().perform(post("/api/auth/resend-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Assert
        verify(otpService, times(1)).getPendingRegistration(email);
        verify(otpService, times(1)).generateOtp();
        verify(otpService, times(1)).savePendingRegistration(email, pendingDto, newOtp);
        verify(emailService, times(1)).sendOtpHtmlMail(emailDetailsCaptor.capture());

        EmailDetails sentEmail = emailDetailsCaptor.getValue();
        assertThat(sentEmail.getRecipient()).isEqualTo(email);
        assertThat(sentEmail.getMsgBody()).isEqualTo(newOtp);
        assertThat(sentEmail.getSubject()).contains("Mã xác thực OTP mới");
    }

    /**
     * Test Case 11: Gửi lại mã OTP khi dữ liệu đăng ký tạm không tìm thấy hoặc hết hạn -> Ném ResponseStatusException 400 BAD_REQUEST.
     */
    @Test
    @DisplayName("TC30: Không gửi lại OTP khi đăng ký tạm không tồn tại hoặc hết hạn")
    void resendOtp_pendingDataNotFound_throwsBadRequest400() throws Exception {
        // Arrange
        String email = "not_found@enjoy.edu.vn";
        ResendOtpRequest request = ResendOtpRequest.builder()
                .email(email)
                .build();

        when(otpService.getPendingRegistration(email)).thenReturn(null);

        registrationApi().perform(post("/api/auth/resend-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Yêu cầu đăng ký không tồn tại hoặc đã quá 15 phút. Vui lòng đăng ký lại."));

        verify(otpService, times(1)).getPendingRegistration(email);
        verify(otpService, never()).generateOtp();
        verify(otpService, never()).savePendingRegistration(any(), any(), any());
        verify(emailService, never()).sendOtpHtmlMail(any());
    }
}
