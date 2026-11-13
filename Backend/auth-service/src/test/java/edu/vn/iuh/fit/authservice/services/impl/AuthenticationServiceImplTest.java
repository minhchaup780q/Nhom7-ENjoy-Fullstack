package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.client.UserClient;
import edu.vn.iuh.fit.authservice.dto.request.LoginRequest;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserAuthResponse;
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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceImplTest {

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
}

