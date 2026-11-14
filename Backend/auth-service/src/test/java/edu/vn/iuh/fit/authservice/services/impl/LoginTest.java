package edu.vn.iuh.fit.authservice.services.impl;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import edu.vn.iuh.fit.authservice.client.UserClient;
import edu.vn.iuh.fit.authservice.dto.request.ChangePasswordRequest;
import edu.vn.iuh.fit.authservice.dto.request.GoogleAuthRequest;
import edu.vn.iuh.fit.authservice.dto.request.LoginRequest;
import edu.vn.iuh.fit.authservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.authservice.entities.Account;
import edu.vn.iuh.fit.authservice.entities.enums.AuthProvider;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import edu.vn.iuh.fit.authservice.repositories.AccountRepository;
import edu.vn.iuh.fit.authservice.services.ActiveUserService;
import edu.vn.iuh.fit.authservice.services.EmailService;
import edu.vn.iuh.fit.authservice.services.JWTService;
import edu.vn.iuh.fit.authservice.services.OtpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Login Feature Unit Tests")
class LoginTest {

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

    private Account defaultAccount;
    private final String rawPassword = "ValidPassword@123";
    private final String encodedPassword = "$2a$10$encryptedPasswordHashSample";
    private static final String JWT_TEST_SECRET =
            "0123456789012345678901234567890123456789012345678901234567890123";

    @BeforeEach
    void setUp() {
        defaultAccount = Account.builder()
                .id(1L)
                .email("user@enjoy.edu.vn")
                .passwordHash(encodedPassword)
                .provider(AuthProvider.LOCAL)
                .role(UserRole.ROLE_PARENT)
                .isEnabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private LoginRequest createLoginRequest(String email, String password) {
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "email", email);
        ReflectionTestUtils.setField(request, "password", password);
        return request;
    }

    /**
     * Test Case 1: Đăng nhập thành công với email và mật khẩu hợp lệ trả về LoginResponse chứa token đầy đủ.
     */
    @Test
    @DisplayName("login: Email và mật khẩu hợp lệ -> Trả về LoginResponse chứa access & refresh token đầy đủ")
    void login_validEmailAndPassword_returnsLoginResponseWithTokens() {
        // Arrange
        LoginRequest request = createLoginRequest("user@enjoy.edu.vn", rawPassword);
        String expectedAccessToken = "mock-access-token-xyz";
        String expectedRefreshToken = "mock-refresh-token-xyz";
        UserAuthResponse mockUserAuth = UserAuthResponse.builder()
                .id(100L)
                .email("user@enjoy.edu.vn")
                .username("TestUser")
                .role("ROLE_PARENT")
                .build();

        when(accountRepository.findByEmail("user@enjoy.edu.vn")).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(jwtService.generateAccessToken(1L, "user@enjoy.edu.vn", "ROLE_PARENT")).thenReturn(expectedAccessToken);
        when(jwtService.generateRefreshToken(1L, "user@enjoy.edu.vn", "ROLE_PARENT")).thenReturn(expectedRefreshToken);
        when(userClient.getUserByEmail("user@enjoy.edu.vn")).thenReturn(mockUserAuth);

        // Act
        LoginResponse response = authenticationService.login(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo(expectedAccessToken);
        assertThat(response.getRefreshToken()).isEqualTo(expectedRefreshToken);
        assertThat(response.getHasPassword()).isTrue();
        assertThat(response.getUser()).isNotNull();
        assertThat(response.getUser().getId()).isEqualTo(1L);
        assertThat(response.getUser().getEmail()).isEqualTo("user@enjoy.edu.vn");
        assertThat(response.getUser().getUsername()).isEqualTo("TestUser");
        assertThat(response.getUser().getRole()).isEqualTo("ROLE_PARENT");

        verify(accountRepository, times(1)).findByEmail("user@enjoy.edu.vn");
        verify(passwordEncoder, times(1)).matches(rawPassword, encodedPassword);
        verify(jwtService, times(1)).generateAccessToken(1L, "user@enjoy.edu.vn", "ROLE_PARENT");
        verify(jwtService, times(1)).generateRefreshToken(1L, "user@enjoy.edu.vn", "ROLE_PARENT");
        verify(userClient, times(1)).getUserByEmail("user@enjoy.edu.vn");
        verify(activeUserService, times(1)).trackActive(1L, "ROLE_PARENT");
    }

    /**
     * Test Case 4: Đăng nhập vẫn thành công khi UserClient gặp sự cố/ném Exception, username trả về null nhưng không crash login.
     */
    @Test
    @DisplayName("login: UserClient ném ngoại lệ -> Đăng nhập vẫn thành công và username mang giá trị null")
    void login_userClientThrowsException_usernameIsNullButResponseSucceeds() {
        // Arrange
        LoginRequest request = createLoginRequest("user@enjoy.edu.vn", rawPassword);

        when(accountRepository.findByEmail("user@enjoy.edu.vn")).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(jwtService.generateAccessToken(1L, "user@enjoy.edu.vn", "ROLE_PARENT")).thenReturn("access_token_123");
        when(jwtService.generateRefreshToken(1L, "user@enjoy.edu.vn", "ROLE_PARENT")).thenReturn("refresh_token_123");
        when(userClient.getUserByEmail("user@enjoy.edu.vn")).thenThrow(new RuntimeException("Feign communication timeout"));

        // Act
        LoginResponse response = authenticationService.login(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access_token_123");
        assertThat(response.getRefreshToken()).isEqualTo("refresh_token_123");
        assertThat(response.getUser()).isNotNull();
        assertThat(response.getUser().getUsername()).isNull();
    }

    /**
     * Test Case 5: Đăng nhập thất bại khi email chưa được đăng ký trong hệ thống, ném ResponseStatusException 404 NOT_FOUND.
     */
    @Test
    @DisplayName("login: Email chưa được đăng ký -> Ném ResponseStatusException 404 NOT_FOUND")
    void login_emailNotRegistered_throwsResponseStatusException404() {
        // Arrange
        String unregisteredEmail = "notfound@enjoy.edu.vn";
        LoginRequest request = createLoginRequest(unregisteredEmail, "SomePassword@123");

        when(accountRepository.findByEmail(unregisteredEmail)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authenticationService.login(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(rse.getReason()).isEqualTo("Email chưa được đăng ký!");
                });

        verify(accountRepository, times(1)).findByEmail(unregisteredEmail);
        verifyNoInteractions(passwordEncoder);
        verifyNoInteractions(jwtService);
        verifyNoInteractions(userClient);
        verifyNoInteractions(activeUserService);
    }

    /**
     * Test Case 6: Đăng nhập thất bại khi mật khẩu không chính xác, ném ResponseStatusException 401 UNAUTHORIZED.
     */
    @Test
    @DisplayName("login: Mật khẩu sai -> Ném ResponseStatusException 401 UNAUTHORIZED")
    void login_wrongPassword_throwsResponseStatusException401() {
        // Arrange
        String incorrectPassword = "WrongPassword@999";
        LoginRequest request = createLoginRequest("user@enjoy.edu.vn", incorrectPassword);

        when(accountRepository.findByEmail("user@enjoy.edu.vn")).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(incorrectPassword, encodedPassword)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authenticationService.login(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                    assertThat(rse.getReason()).isEqualTo("Email hoặc mật khẩu không chính xác");
                });

        verify(accountRepository, times(1)).findByEmail("user@enjoy.edu.vn");
        verify(passwordEncoder, times(1)).matches(incorrectPassword, encodedPassword);
        verifyNoInteractions(jwtService);
        verifyNoInteractions(userClient);
        verifyNoInteractions(activeUserService);
    }

    /**
     * Test Case 7: Đăng nhập với tài khoản ROLE_ADMIN vẫn gọi activeUserService.trackActive để thống kê hoạt động.
     */
    @Test
    @DisplayName("login: Đăng nhập với ROLE_ADMIN -> activeUserService.trackActive vẫn được gọi đầy đủ")
    void login_roleAdmin_trackActiveStillCalled() {
        // Arrange
        Account adminAccount = Account.builder()
                .id(99L)
                .email("admin@enjoy.edu.vn")
                .passwordHash("admin_hashed_pwd")
                .provider(AuthProvider.LOCAL)
                .role(UserRole.ROLE_ADMIN)
                .build();
        LoginRequest request = createLoginRequest("admin@enjoy.edu.vn", "Admin@123");

        when(accountRepository.findByEmail("admin@enjoy.edu.vn")).thenReturn(Optional.of(adminAccount));
        when(passwordEncoder.matches("Admin@123", "admin_hashed_pwd")).thenReturn(true);
        when(jwtService.generateAccessToken(99L, "admin@enjoy.edu.vn", "ROLE_ADMIN")).thenReturn("admin_access_token");
        when(jwtService.generateRefreshToken(99L, "admin@enjoy.edu.vn", "ROLE_ADMIN")).thenReturn("admin_refresh_token");

        // Act
        LoginResponse response = authenticationService.login(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getUser().getRole()).isEqualTo("ROLE_ADMIN");
        verify(activeUserService, times(1)).trackActive(99L, "ROLE_ADMIN");
    }

    /**
     * Test Case 8: Tài khoản không có mật khẩu (tài khoản bên thứ 3) -> trường hasPassword trả về false.
     */
    @Test
    @DisplayName("login: Tài khoản passwordHash null hoặc rỗng -> hasPassword trả về false")
    void login_accountHasNoPassword_hasPasswordFieldIsFalse() {
        // Arrange
        Account noPasswordAccount = Account.builder()
                .id(8L)
                .email("oauth_user@enjoy.edu.vn")
                .passwordHash(null)
                .provider(AuthProvider.GOOGLE)
                .role(UserRole.ROLE_PARENT)
                .build();
        LoginRequest request = createLoginRequest("oauth_user@enjoy.edu.vn", "dummy_pass");

        when(accountRepository.findByEmail("oauth_user@enjoy.edu.vn")).thenReturn(Optional.of(noPasswordAccount));
        when(passwordEncoder.matches("dummy_pass", null)).thenReturn(true);
        when(jwtService.generateAccessToken(8L, "oauth_user@enjoy.edu.vn", "ROLE_PARENT")).thenReturn("jwt_access");
        when(jwtService.generateRefreshToken(8L, "oauth_user@enjoy.edu.vn", "ROLE_PARENT")).thenReturn("jwt_refresh");

        // Act
        LoginResponse response = authenticationService.login(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getHasPassword()).isFalse();
    }

    // ==========================================
    // GOOGLE AUTH TEST CASES
    // ==========================================

    /**
     * Test Case 7: Tài khoản đã tồn tại trong DB -> Trả về tokens thành công mà không tạo mới Account hay UserProfile.
     */
    @Test
    @DisplayName("googleAuth: Tài khoản đã tồn tại -> Trả về tokens mà không tạo mới Account/Profile")
    void googleAuth_existingAccount_returnsTokensWithoutCreatingNew() {
        // Arrange
        String email = "existing_google@enjoy.edu.vn";
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .email(email)
                .name("Google User")
                .googleId("google-123456")
                .birthday(LocalDate.of(1995, 1, 1))
                .build();

        Account existingAccount = Account.builder()
                .id(50L)
                .email(email)
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.GOOGLE)
                .passwordHash(null)
                .build();

        when(accountRepository.findByEmail(email)).thenReturn(Optional.of(existingAccount));
        when(jwtService.generateAccessToken(50L, email, "ROLE_PARENT")).thenReturn("google_access_token");
        when(jwtService.generateRefreshToken(50L, email, "ROLE_PARENT")).thenReturn("google_refresh_token");
        when(userClient.getUserByEmail(email)).thenReturn(UserAuthResponse.builder().username("GoogleUser").build());

        // Act
        LoginResponse response = authenticationService.googleAuth(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("google_access_token");
        assertThat(response.getRefreshToken()).isEqualTo("google_refresh_token");
        assertThat(response.getHasPassword()).isFalse();
        assertThat(response.getUser().getUsername()).isEqualTo("GoogleUser");

        verify(accountRepository, never()).save(any());
        verify(userClient, never()).createUserProfile(any());
        verify(activeUserService, times(1)).trackActive(50L, "ROLE_PARENT");
    }

    /**
     * Test Case 8: Tài khoản mới có ngày sinh hợp lệ (> 16 tuổi) -> Tự động tạo Account và UserProfile với ROLE_PARENT.
     */
    @Test
    @DisplayName("googleAuth: Tài khoản mới có ngày sinh (> 16 tuổi) -> Tạo Account và UserProfile với ROLE_PARENT")
    void googleAuth_newAccountWithBirthday_createsAccountAndUserProfile() {
        // Arrange
        String email = "new_google@enjoy.edu.vn";
        LocalDate birthday = LocalDate.now().minusYears(20);
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .email(email)
                .name("New Google User")
                .googleId("google-999")
                .birthday(birthday)
                .build();

        Account savedAccount = Account.builder()
                .id(51L)
                .email(email)
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.GOOGLE)
                .passwordHash(null)
                .build();

        when(accountRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(accountRepository.save(any(Account.class))).thenReturn(savedAccount);
        when(jwtService.generateAccessToken(51L, email, "ROLE_PARENT")).thenReturn("access_token");
        when(jwtService.generateRefreshToken(51L, email, "ROLE_PARENT")).thenReturn("refresh_token");

        ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
        ArgumentCaptor<UserCreateRequest> userReqCaptor = ArgumentCaptor.forClass(UserCreateRequest.class);

        // Act
        LoginResponse response = authenticationService.googleAuth(request);

        // Assert
        assertThat(response).isNotNull();
        verify(accountRepository, times(1)).save(accountCaptor.capture());
        verify(userClient, times(1)).createUserProfile(userReqCaptor.capture());

        Account capturedAccount = accountCaptor.getValue();
        assertThat(capturedAccount.getEmail()).isEqualTo(email);
        assertThat(capturedAccount.getRole()).isEqualTo(UserRole.ROLE_PARENT);
        assertThat(capturedAccount.getProvider()).isEqualTo(AuthProvider.GOOGLE);
        assertThat(capturedAccount.getPasswordHash()).isNull();

        UserCreateRequest capturedUserReq = userReqCaptor.getValue();
        assertThat(capturedUserReq.getAccountId()).isEqualTo(51L);
        assertThat(capturedUserReq.getEmail()).isEqualTo(email);
        assertThat(capturedUserReq.getUsername()).isEqualTo("New Google User");
        assertThat(capturedUserReq.getBirthday()).isEqualTo(birthday);
        assertThat(capturedUserReq.getRole()).isEqualTo(UserRole.ROLE_PARENT);
    }

    /**
     * Test Case 9: Tài khoản mới có độ tuổi dưới 16 (<= 16 tuổi) -> Tự động xác định vai trò ROLE_CHILDREN.
     */
    @Test
    @DisplayName("googleAuth: Tài khoản mới có độ tuổi <= 16 tuổi -> Vai trò tự động là ROLE_CHILDREN")
    void googleAuth_newAccountAgeUnder16_roleIsChildren() {
        // Arrange
        String email = "child_google@enjoy.edu.vn";
        LocalDate birthday = LocalDate.now().minusYears(12);
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .email(email)
                .name("Child Google User")
                .birthday(birthday)
                .build();

        Account savedAccount = Account.builder()
                .id(52L)
                .email(email)
                .role(UserRole.ROLE_CHILDREN)
                .provider(AuthProvider.GOOGLE)
                .build();

        when(accountRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(accountRepository.save(any(Account.class))).thenReturn(savedAccount);
        when(jwtService.generateAccessToken(52L, email, "ROLE_CHILDREN")).thenReturn("access_token_child");
        when(jwtService.generateRefreshToken(52L, email, "ROLE_CHILDREN")).thenReturn("refresh_token_child");

        ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
        ArgumentCaptor<UserCreateRequest> userReqCaptor = ArgumentCaptor.forClass(UserCreateRequest.class);

        // Act
        LoginResponse response = authenticationService.googleAuth(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getUser().getRole()).isEqualTo("ROLE_CHILDREN");

        verify(accountRepository).save(accountCaptor.capture());
        verify(userClient).createUserProfile(userReqCaptor.capture());
        assertThat(accountCaptor.getValue().getRole()).isEqualTo(UserRole.ROLE_CHILDREN);
        assertThat(userReqCaptor.getValue().getRole()).isEqualTo(UserRole.ROLE_CHILDREN);
    }

    /**
     * Test Case 10: Tài khoản mới không cung cấp ngày sinh (null) -> Mặc định gán vai trò ROLE_PARENT.
     */
    @Test
    @DisplayName("googleAuth: Tài khoản mới không có ngày sinh (null) -> Mặc định là ROLE_PARENT")
    void googleAuth_newAccountNullBirthday_roleIsParent() {
        // Arrange
        String email = "nobday_google@enjoy.edu.vn";
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .email(email)
                .name("No Bday User")
                .birthday(null)
                .build();

        Account savedAccount = Account.builder()
                .id(53L)
                .email(email)
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.GOOGLE)
                .build();

        when(accountRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(accountRepository.save(any(Account.class))).thenReturn(savedAccount);
        when(jwtService.generateAccessToken(53L, email, "ROLE_PARENT")).thenReturn("access_token");
        when(jwtService.generateRefreshToken(53L, email, "ROLE_PARENT")).thenReturn("refresh_token");

        ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);

        // Act
        LoginResponse response = authenticationService.googleAuth(request);

        // Assert
        assertThat(response).isNotNull();
        verify(accountRepository).save(accountCaptor.capture());
        assertThat(accountCaptor.getValue().getRole()).isEqualTo(UserRole.ROLE_PARENT);
    }

    /**
     * Test Case 11: Tài khoản mới name là null -> Username fallback về tiền tố email trước ký tự @.
     */
    @Test
    @DisplayName("googleAuth: Tài khoản mới name là null -> Username lấy tiền tố email")
    void googleAuth_newAccountNullName_usernameFallsBackToEmailPrefix() {
        // Arrange
        String email = "john.doe@gmail.com";
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .email(email)
                .name(null)
                .birthday(LocalDate.of(1990, 1, 1))
                .build();

        Account savedAccount = Account.builder()
                .id(54L)
                .email(email)
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.GOOGLE)
                .build();

        when(accountRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(accountRepository.save(any(Account.class))).thenReturn(savedAccount);
        when(jwtService.generateAccessToken(any(), any(), any())).thenReturn("access_token");
        when(jwtService.generateRefreshToken(any(), any(), any())).thenReturn("refresh_token");

        ArgumentCaptor<UserCreateRequest> userReqCaptor = ArgumentCaptor.forClass(UserCreateRequest.class);

        // Act
        authenticationService.googleAuth(request);

        // Assert
        verify(userClient).createUserProfile(userReqCaptor.capture());
        assertThat(userReqCaptor.getValue().getUsername()).isEqualTo("john.doe");
    }

    /**
     * Test Case 12: UserClient ném ngoại lệ khi tạo profile hoặc lấy thông tin -> googleAuth vẫn thành công.
     */
    @Test
    @DisplayName("googleAuth: UserClient ném lỗi qua OpenFeign -> Đăng nhập Google vẫn thành công")
    void googleAuth_userClientThrowsException_authStillSucceeds() {
        // Arrange
        String email = "feign_error_google@enjoy.edu.vn";
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .email(email)
                .name("Feign Error User")
                .birthday(LocalDate.of(1992, 2, 2))
                .build();

        Account savedAccount = Account.builder()
                .id(55L)
                .email(email)
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.GOOGLE)
                .build();

        when(accountRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(accountRepository.save(any(Account.class))).thenReturn(savedAccount);
        when(userClient.createUserProfile(any())).thenThrow(new RuntimeException("user-service create failed"));
        when(jwtService.generateAccessToken(55L, email, "ROLE_PARENT")).thenReturn("access_tok");
        when(jwtService.generateRefreshToken(55L, email, "ROLE_PARENT")).thenReturn("refresh_tok");
        when(userClient.getUserByEmail(email)).thenThrow(new RuntimeException("user-service get failed"));

        // Act
        LoginResponse response = authenticationService.googleAuth(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access_tok");
        assertThat(response.getRefreshToken()).isEqualTo("refresh_tok");
        assertThat(response.getUser()).isNotNull();
        assertThat(response.getUser().getUsername()).isNull();
        verify(activeUserService, times(1)).trackActive(55L, "ROLE_PARENT");
    }

    /**
     * Verifies that a local account with a valid current password can update its password hash.
     */
    @Test
    @DisplayName("changePassword: Tài khoản local xác thực mật khẩu hiện tại thành công")
    void changePassword_localAccountValidCurrentPwd_updatesPasswordHash() {
        // Arrange
        String newPassword = "NewPassword@456";
        String newPasswordHash = "$2a$10$newEncryptedPasswordHash";
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword(rawPassword)
                .newPassword(newPassword)
                .confirmPassword(newPassword)
                .build();
        when(accountRepository.findById(defaultAccount.getId())).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn(newPasswordHash);
        when(accountRepository.save(defaultAccount)).thenReturn(defaultAccount);

        // Act
        authenticationService.changePassword(defaultAccount.getId(), request);

        // Assert
        assertThat(defaultAccount.getPasswordHash()).isEqualTo(newPasswordHash);
        assertThat(defaultAccount.getUpdatedAt()).isNotNull();
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
        verify(passwordEncoder).encode(newPassword);
        verify(accountRepository).save(defaultAccount);
    }

    /**
     * Verifies that a Google account without a password can set one without a current password.
     */
    @Test
    @DisplayName("changePassword: Tài khoản Google chưa có mật khẩu đặt mật khẩu mới trực tiếp")
    void changePassword_googleAccountNoCurrentPwd_setsPasswordDirectly() {
        // Arrange
        String newPassword = "GoogleAccount@456";
        String newPasswordHash = "$2a$10$googleAccountPasswordHash";
        Account googleAccount = Account.builder()
                .id(2L)
                .email("google@enjoy.edu.vn")
                .provider(AuthProvider.GOOGLE)
                .passwordHash(null)
                .build();
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword(null)
                .newPassword(newPassword)
                .confirmPassword(newPassword)
                .build();
        when(accountRepository.findById(googleAccount.getId())).thenReturn(Optional.of(googleAccount));
        when(passwordEncoder.encode(newPassword)).thenReturn(newPasswordHash);
        when(accountRepository.save(googleAccount)).thenReturn(googleAccount);

        // Act
        authenticationService.changePassword(googleAccount.getId(), request);

        // Assert
        assertThat(googleAccount.getPasswordHash()).isEqualTo(newPasswordHash);
        assertThat(googleAccount.getUpdatedAt()).isNotNull();
        verify(passwordEncoder, never()).matches(any(), any());
        verify(passwordEncoder).encode(newPassword);
        verify(accountRepository).save(googleAccount);
    }

    /**
     * Verifies that a valid refresh token produces a new access token and tracks user activity.
     */
    @Test
    @DisplayName("refresh: Token hợp lệ trả access token mới, giữ refresh token và ghi nhận hoạt động")
    void refresh_validToken_returnsNewAccessTokenWithSameRefreshToken() {
        // Arrange
        String refreshToken = "valid-refresh-token";
        String newAccessToken = "new-access-token";
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .claim("userId", defaultAccount.getId())
                .claim("email", defaultAccount.getEmail())
                .claim("role", "ROLE_PARENT")
                .build();
        UserAuthResponse userAuth = UserAuthResponse.builder()
                .id(defaultAccount.getId())
                .email(defaultAccount.getEmail())
                .username("TestUser")
                .role("ROLE_PARENT")
                .build();
        when(jwtService.verifyToken(refreshToken)).thenReturn(claims);
        when(accountRepository.findById(defaultAccount.getId())).thenReturn(Optional.of(defaultAccount));
        when(userClient.getUserByEmail(defaultAccount.getEmail())).thenReturn(userAuth);
        when(jwtService.generateAccessToken(defaultAccount.getId(), defaultAccount.getEmail(), "ROLE_PARENT"))
                .thenReturn(newAccessToken);

        // Act
        LoginResponse response = authenticationService.refresh(refreshToken);

        // Assert
        assertThat(response.getAccessToken()).isEqualTo(newAccessToken);
        assertThat(response.getRefreshToken()).isEqualTo(refreshToken);
        assertThat(response.getHasPassword()).isTrue();
        assertThat(response.getUser().getUsername()).isEqualTo("TestUser");
        verify(jwtService).verifyToken(refreshToken);
        verify(jwtService).generateAccessToken(defaultAccount.getId(), defaultAccount.getEmail(), "ROLE_PARENT");
        verify(activeUserService).trackActive(defaultAccount.getId(), "ROLE_PARENT");
    }

    /**
     * Verifies that null or blank refresh tokens are rejected with HTTP 400.
     */
    @Test
    @DisplayName("refresh: Token null hoặc rỗng bị từ chối với lỗi 400")
    void refresh_nullOrEmptyToken_throwsBadRequest400() {
        // Arrange
        String[] invalidTokens = {null, "", "   "};

        // Act & Assert
        for (String invalidToken : invalidTokens) {
            assertThatThrownBy(() -> authenticationService.refresh(invalidToken))
                    .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                        assertThat(exception.getReason()).isEqualTo("Refresh Token không được để trống");
                        assertThat(exception.getMessage()).contains("Refresh Token không được để trống");
                    });
        }
        verifyNoInteractions(jwtService, accountRepository, userClient, activeUserService);
    }

    /**
     * Verifies that a refresh token with an invalid signature is rejected with HTTP 401.
     */
    @Test
    @DisplayName("refresh: Token sai chữ ký bị từ chối với lỗi 401")
    void refresh_invalidSignatureToken_throwsUnauthorized401() {
        // Arrange
        String forgedRefreshToken = "forged-refresh-token";
        when(jwtService.verifyToken(forgedRefreshToken))
                .thenThrow(new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Refresh Token không hợp lệ hoặc đã hết hạn"));

        // Act & Assert
        assertThatThrownBy(() -> authenticationService.refresh(forgedRefreshToken))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                    assertThat(exception.getReason()).isEqualTo("Refresh Token không hợp lệ hoặc đã hết hạn");
                    assertThat(exception.getMessage()).contains("Refresh Token không hợp lệ hoặc đã hết hạn");
                });
        verify(jwtService).verifyToken(forgedRefreshToken);
        verifyNoInteractions(accountRepository, userClient, activeUserService);
    }

    /**
     * Verifies that a generated access token contains the requested identity claims.
     */
    @Test
    @DisplayName("generateAccessToken: Token chứa đầy đủ userId, email và role")
    void generateAccessToken_validInput_claimsContainUserIdEmailRole() throws Exception {
        // Arrange
        JWTServiceImpl realJwtService = createJwtService();

        // Act
        String accessToken = realJwtService.generateAccessToken(
                defaultAccount.getId(), defaultAccount.getEmail(), "ROLE_PARENT");
        JWTClaimsSet claims = SignedJWT.parse(accessToken).getJWTClaimsSet();

        // Assert
        assertThat(claims.getClaim("userId")).isEqualTo(defaultAccount.getId());
        assertThat(claims.getClaim("email")).isEqualTo(defaultAccount.getEmail());
        assertThat(claims.getClaim("role")).isEqualTo("ROLE_PARENT");
    }

    /**
     * Verifies that generated refresh tokens expire exactly 30 days after issuance.
     */
    @Test
    @DisplayName("generateRefreshToken: Token hết hạn chính xác sau 30 ngày")
    void generateRefreshToken_validInput_tokenExpiresIn30Days() throws Exception {
        // Arrange
        JWTServiceImpl realJwtService = createJwtService();

        // Act
        String refreshToken = realJwtService.generateRefreshToken(
                defaultAccount.getId(), defaultAccount.getEmail(), "ROLE_PARENT");
        JWTClaimsSet claims = SignedJWT.parse(refreshToken).getJWTClaimsSet();

        // Assert
        assertThat(claims.getExpirationTime().getTime() - claims.getIssueTime().getTime())
                .isEqualTo(30L * 24 * 60 * 60 * 1000);
    }

    /**
     * Verifies that a correctly signed, unexpired token returns its claims.
     */
    @Test
    @DisplayName("verifyToken: Giải mã thành công token hợp lệ")
    void verifyToken_validToken_returnsClaims() throws Exception {
        // Arrange
        JWTServiceImpl realJwtService = createJwtService();
        Date issuedAt = new Date();
        String validToken = createSignedToken(
                JWT_TEST_SECRET,
                issuedAt,
                Date.from(issuedAt.toInstant().plus(1, ChronoUnit.DAYS)));

        // Act
        JWTClaimsSet claims = realJwtService.verifyToken(validToken);

        // Assert
        assertThat(claims.getClaim("userId")).isEqualTo(defaultAccount.getId());
        assertThat(claims.getClaim("email")).isEqualTo(defaultAccount.getEmail());
        assertThat(claims.getClaim("role")).isEqualTo("ROLE_PARENT");
    }

    /**
     * Verifies that a correctly signed but expired token is rejected with HTTP 401.
     */
    @Test
    @DisplayName("verifyToken: Token hết hạn bị từ chối với lỗi 401")
    void verifyToken_expiredToken_throwsUnauthorized401() throws Exception {
        // Arrange
        JWTServiceImpl realJwtService = createJwtService();
        Date issuedAt = Date.from(new Date().toInstant().minus(2, ChronoUnit.DAYS));
        String expiredToken = createSignedToken(
                JWT_TEST_SECRET,
                issuedAt,
                Date.from(issuedAt.toInstant().plus(1, ChronoUnit.DAYS)));

        // Act & Assert
        assertThatThrownBy(() -> realJwtService.verifyToken(expiredToken))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                    assertThat(exception.getReason())
                            .isEqualTo("Refresh Token không hợp lệ hoặc đã hết hạn");
                    assertThat(exception.getMessage())
                            .contains("Refresh Token không hợp lệ hoặc đã hết hạn");
                });
    }

    /**
     * Verifies that a token signed with another key is rejected with HTTP 401.
     */
    @Test
    @DisplayName("verifyToken: Token có chữ ký không hợp lệ bị từ chối với lỗi 401")
    void verifyToken_invalidSignature_throwsUnauthorized401() throws Exception {
        // Arrange
        JWTServiceImpl realJwtService = createJwtService();
        Date issuedAt = new Date();
        String tokenWithInvalidSignature = createSignedToken(
                "9876543210987654321098765432109876543210987654321098765432109876",
                issuedAt,
                Date.from(issuedAt.toInstant().plus(1, ChronoUnit.DAYS)));

        // Act & Assert
        assertThatThrownBy(() -> realJwtService.verifyToken(tokenWithInvalidSignature))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                    assertThat(exception.getReason())
                            .isEqualTo("Refresh Token không hợp lệ hoặc đã hết hạn");
                    assertThat(exception.getMessage())
                            .contains("Refresh Token không hợp lệ hoặc đã hết hạn");
                });
    }

    private JWTServiceImpl createJwtService() {
        JWTServiceImpl realJwtService = new JWTServiceImpl();
        ReflectionTestUtils.setField(realJwtService, "secretKey", JWT_TEST_SECRET);
        return realJwtService;
    }

    private String createSignedToken(String signingKey, Date issuedAt, Date expirationTime) throws Exception {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .claim("userId", defaultAccount.getId())
                .claim("email", defaultAccount.getEmail())
                .claim("role", "ROLE_PARENT")
                .issueTime(issuedAt)
                .expirationTime(expirationTime)
                .build();
        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS512), claims);
        signedJWT.sign(new MACSigner(signingKey));
        return signedJWT.serialize();
    }

}
