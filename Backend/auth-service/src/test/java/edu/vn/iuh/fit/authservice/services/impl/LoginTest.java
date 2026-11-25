package edu.vn.iuh.fit.authservice.services.impl;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.vn.iuh.fit.authservice.controllers.AuthenController;
import edu.vn.iuh.fit.authservice.client.UserClient;
import edu.vn.iuh.fit.authservice.dto.request.ChangePasswordRequest;
import edu.vn.iuh.fit.authservice.dto.request.GoogleAuthRequest;
import edu.vn.iuh.fit.authservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.authservice.entities.Account;
import edu.vn.iuh.fit.authservice.entities.enums.AuthProvider;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import edu.vn.iuh.fit.authservice.exceptions.GlobalExceptionHandler;
import edu.vn.iuh.fit.authservice.repositories.AccountRepository;
import edu.vn.iuh.fit.authservice.repositories.DailyActiveStatsRepository;
import edu.vn.iuh.fit.authservice.repositories.DailyActiveUserRepository;
import edu.vn.iuh.fit.authservice.services.ActiveUserService;
import edu.vn.iuh.fit.authservice.services.EmailService;
import edu.vn.iuh.fit.authservice.services.JWTService;
import edu.vn.iuh.fit.authservice.services.OtpService;
import edu.vn.iuh.fit.authservice.services.impl.ActiveUserServiceImpl;
import edu.vn.iuh.fit.authservice.services.impl.AuthenticationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("Login Feature Tests")
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
    private final ObjectMapper objectMapper = new ObjectMapper();

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

    private MockMvc loginApi(JWTService tokenService, ActiveUserService activityService) {
        AuthenticationServiceImpl apiService = new AuthenticationServiceImpl(
                accountRepository, userClient, passwordEncoder, tokenService, otpService, emailService, activityService);
        return MockMvcBuilders.standaloneSetup(
                        new AuthenController(apiService, tokenService, emailService, activityService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder googleLoginRequest(
            String email, String name, String googleId, LocalDate birthday) throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("email", email);
        if (name != null) {
            request.put("name", name);
        }
        if (googleId != null) {
            request.put("googleId", googleId);
        }
        if (birthday != null) {
            request.put("birthday", birthday.toString());
        }
        return post("/api/auth/login-by-google")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request));
    }

    private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder changePasswordRequest(
            Long userId, String currentPassword, String newPassword) throws Exception {
        Map<String, Object> request = new HashMap<>();
        if (currentPassword != null) {
            request.put("currentPassword", currentPassword);
        }
        request.put("newPassword", newPassword);
        request.put("confirmPassword", newPassword);
        return post("/api/auth/change-password")
                .header("X-User-Id", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request));
    }

    private void useGoogleAccountAndProfileStores(
            Map<String, Account> accounts, Map<String, UserCreateRequest> profiles) {
        AtomicLong generatedIds = new AtomicLong(50);
        when(accountRepository.findByEmail(any())).thenAnswer(invocation ->
                Optional.ofNullable(accounts.get(invocation.getArgument(0))));
        lenient().when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
            Account account = invocation.getArgument(0);
            if (account.getId() == null) {
                account.setId(generatedIds.incrementAndGet());
            }
            accounts.put(account.getEmail(), account);
            return account;
        });
        lenient().when(userClient.createUserProfile(any(UserCreateRequest.class))).thenAnswer(invocation -> {
            UserCreateRequest profile = invocation.getArgument(0);
            profiles.put(profile.getEmail(), profile);
            return UserCreateResponse.builder()
                    .id(generatedIds.incrementAndGet())
                    .accountId(profile.getAccountId())
                    .email(profile.getEmail())
                    .username(profile.getUsername())
                    .birthday(profile.getBirthday())
                    .role(profile.getRole().name())
                    .build();
        });
        when(userClient.getUserByEmail(any())).thenAnswer(invocation -> {
            UserCreateRequest profile = profiles.get(invocation.getArgument(0));
            if (profile == null) {
                return null;
            }
            return UserAuthResponse.builder()
                    .id(profile.getAccountId())
                    .email(profile.getEmail())
                    .username(profile.getUsername())
                    .role(profile.getRole().name())
                    .build();
        });
    }

    /**
     * Test Case 1: Đăng nhập thành công với email và mật khẩu hợp lệ trả về LoginResponse chứa token đầy đủ.
     */
    @Test
    @DisplayName("TC01: Đăng nhập hợp lệ trả token và hồ sơ người dùng")
    void login_validEmailAndPassword_returnsLoginResponseWithTokens() throws Exception {
        // Arrange
        JWTServiceImpl tokenGenerator = createJwtService();
        MockMvc api = loginApi(tokenGenerator, activeUserService);
        UserAuthResponse mockUserAuth = UserAuthResponse.builder()
                .id(100L)
                .email("user@enjoy.edu.vn")
                .username("TestUser")
                .role("ROLE_PARENT")
                .build();

        when(accountRepository.findByEmail("user@enjoy.edu.vn")).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(userClient.getUserByEmail("user@enjoy.edu.vn")).thenReturn(mockUserAuth);

        MvcResult result = api.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "user@enjoy.edu.vn", "password", rawPassword))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasPassword").value(true))
                .andExpect(jsonPath("$.user.id").value(1L))
                .andExpect(jsonPath("$.user.email").value("user@enjoy.edu.vn"))
                .andExpect(jsonPath("$.user.username").value("TestUser"))
                .andExpect(jsonPath("$.user.role").value("ROLE_PARENT"))
                .andReturn();

        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsByteArray());
        JWTClaimsSet accessClaims = tokenGenerator.verifyToken(response.path("accessToken").asText());
        JWTClaimsSet refreshClaims = tokenGenerator.verifyToken(response.path("refreshToken").asText());
        assertThat(accessClaims.getLongClaim("userId")).isEqualTo(1L);
        assertThat(accessClaims.getStringClaim("email")).isEqualTo("user@enjoy.edu.vn");
        assertThat(refreshClaims.getLongClaim("userId")).isEqualTo(1L);
        assertThat(refreshClaims.getStringClaim("role")).isEqualTo("ROLE_PARENT");
    }

    /**
     * Test Case 4: Đăng nhập vẫn thành công khi UserClient gặp sự cố/ném Exception, username trả về null nhưng không crash login.
     */
    @Test
    @DisplayName("TC02: User Service lỗi nhưng đăng nhập vẫn thành công")
    void login_userClientThrowsException_usernameIsNullButResponseSucceeds() throws Exception {
        // Arrange
        JWTServiceImpl tokenGenerator = createJwtService();
        MockMvc api = loginApi(tokenGenerator, activeUserService);
        when(accountRepository.findByEmail("user@enjoy.edu.vn")).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(userClient.getUserByEmail("user@enjoy.edu.vn")).thenThrow(new RuntimeException("Feign communication timeout"));

        MvcResult result = api.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "user@enjoy.edu.vn", "password", rawPassword))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").doesNotExist())
                .andReturn();
        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsByteArray());
        assertThat(tokenGenerator.verifyToken(response.path("accessToken").asText()).getStringClaim("email"))
                .isEqualTo("user@enjoy.edu.vn");
        assertThat(tokenGenerator.verifyToken(response.path("refreshToken").asText()).getStringClaim("role"))
                .isEqualTo("ROLE_PARENT");
    }

    /**
     * Test Case 5: Đăng nhập thất bại khi email chưa được đăng ký trong hệ thống, ném ResponseStatusException 404 NOT_FOUND.
     */
    @Test
    @DisplayName("TC03: Email chưa đăng ký trả về HTTP 404")
    void login_emailNotRegistered_throwsResponseStatusException404() throws Exception {
        // Arrange
        String unregisteredEmail = "notfound@enjoy.edu.vn";
        MockMvc api = loginApi(createJwtService(), activeUserService);

        when(accountRepository.findByEmail(unregisteredEmail)).thenReturn(Optional.empty());

        api.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", unregisteredEmail, "password", "SomePassword@123"))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Email chưa được đăng ký!"));
    }

    /**
     * Test Case 6: Đăng nhập thất bại khi mật khẩu không chính xác, ném ResponseStatusException 401 UNAUTHORIZED.
     */
    @Test
    @DisplayName("TC04: Mật khẩu sai trả về HTTP 401")
    void login_wrongPassword_throwsResponseStatusException401() throws Exception {
        // Arrange
        String incorrectPassword = "WrongPassword@999";
        MockMvc api = loginApi(createJwtService(), activeUserService);

        when(accountRepository.findByEmail("user@enjoy.edu.vn")).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(incorrectPassword, encodedPassword)).thenReturn(false);

        api.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "user@enjoy.edu.vn", "password", incorrectPassword))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email hoặc mật khẩu không chính xác"));
    }

    /**
     * Verifies the externally visible DAU result after an administrator signs in.
     */
    @Test
    @DisplayName("TC05: Admin đăng nhập thành công nhưng không làm tăng DAU")
    void login_roleAdmin_doesNotIncreaseDau() throws Exception {
        // Arrange
        Account adminAccount = Account.builder()
                .id(99L)
                .email("admin@enjoy.edu.vn")
                .passwordHash("admin_hashed_pwd")
                .provider(AuthProvider.LOCAL)
                .role(UserRole.ROLE_ADMIN)
                .build();
        when(accountRepository.findByEmail("admin@enjoy.edu.vn")).thenReturn(Optional.of(adminAccount));
        when(passwordEncoder.matches("Admin@123", "admin_hashed_pwd")).thenReturn(true);
        JWTServiceImpl tokenGenerator = createJwtService();

        StringRedisTemplate redisTemplate = mock(StringRedisTemplate.class);
        @SuppressWarnings("unchecked")
        SetOperations<String, String> redisSets = mock(SetOperations.class);
        DailyActiveUserRepository activeUserRepository = mock(DailyActiveUserRepository.class);
        DailyActiveStatsRepository activeStatsRepository = mock(DailyActiveStatsRepository.class);
        when(redisTemplate.opsForSet()).thenReturn(redisSets);
        when(redisSets.members(anyString())).thenReturn(Set.of());
        when(activeUserRepository.findDistinctAccountIdsBetween(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(java.util.List.of());

        ActiveUserServiceImpl activeService = new ActiveUserServiceImpl(
                redisTemplate, activeUserRepository, activeStatsRepository, accountRepository);
        MockMvc adminMvc = loginApi(tokenGenerator, activeService);

        adminMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "admin@enjoy.edu.vn", "password", "Admin@123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.id").value(99L))
                .andExpect(jsonPath("$.user.email").value("admin@enjoy.edu.vn"))
                .andExpect(jsonPath("$.user.role").value("ROLE_ADMIN"));

        adminMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .get("/api/auth/internal/active-stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dau").value(0));
    }

    /**
     * Test Case 8: Tài khoản không có mật khẩu (tài khoản bên thứ 3) -> trường hasPassword trả về false.
     */
    @Test
    @DisplayName("TC06: Đăng nhập OAuth không cần mật khẩu và trả hasPassword=false")
    void googleAuth_passwordlessAccount_hasPasswordFieldIsFalse() throws Exception {
        // Arrange
        Account noPasswordAccount = Account.builder()
                .id(8L)
                .email("oauth_user@enjoy.edu.vn")
                .passwordHash(null)
                .provider(AuthProvider.GOOGLE)
                .role(UserRole.ROLE_PARENT)
                .build();
        MockMvc api = loginApi(createJwtService(), activeUserService);

        when(accountRepository.findByEmail("oauth_user@enjoy.edu.vn")).thenReturn(Optional.of(noPasswordAccount));

        api.perform(googleLoginRequest("oauth_user@enjoy.edu.vn", "OAuth User", "google-oauth-id", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasPassword").value(false))
                .andExpect(jsonPath("$.user.email").value("oauth_user@enjoy.edu.vn"));
    }

    // ==========================================
    // GOOGLE AUTH TEST CASES
    // ==========================================

    /**
     * Test Case 7: Tài khoản đã tồn tại trong DB -> Trả về tokens thành công mà không tạo mới Account hay UserProfile.
     */
    @Test
    @DisplayName("TC07: Đăng nhập Google với tài khoản hiện hữu không tạo trùng tài khoản")
    void googleAuth_existingAccount_returnsTokensWithoutCreatingNew() throws Exception {
        // Arrange
        String email = "existing_google@enjoy.edu.vn";
        Account existingAccount = Account.builder()
                .id(50L)
                .email(email)
                .role(UserRole.ROLE_PARENT)
                .provider(AuthProvider.GOOGLE)
                .passwordHash(null)
                .build();
        Map<String, Account> accounts = new HashMap<>();
        accounts.put(email, existingAccount);
        Map<String, UserCreateRequest> profiles = new HashMap<>();
        profiles.put(email, UserCreateRequest.builder()
                .accountId(50L)
                .email(email)
                .username("GoogleUser")
                .role(UserRole.ROLE_PARENT)
                .build());
        JWTServiceImpl tokenGenerator = createJwtService();
        MockMvc api = loginApi(tokenGenerator, activeUserService);
        useGoogleAccountAndProfileStores(accounts, profiles);

        MvcResult result = api.perform(googleLoginRequest(
                        email, "Google User", "google-123456", LocalDate.of(1995, 1, 1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasPassword").value(false))
                .andExpect(jsonPath("$.user.email").value(email))
                .andExpect(jsonPath("$.user.username").value("GoogleUser"))
                .andExpect(jsonPath("$.user.role").value("ROLE_PARENT"))
                .andReturn();
        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsByteArray());
        assertThat(tokenGenerator.verifyToken(response.path("accessToken").asText()).getLongClaim("userId"))
                .isEqualTo(50L);
        assertThat(tokenGenerator.verifyToken(response.path("refreshToken").asText())
                .getStringClaim("email")).isEqualTo(email);
        assertThat(accounts).containsOnlyKeys(email);
        assertThat(profiles).containsOnlyKeys(email);
    }

    /**
     * Test Case 8: Tài khoản mới có ngày sinh hợp lệ (> 16 tuổi) -> Tự động tạo Account và UserProfile với ROLE_PARENT.
     */
    @Test
    @DisplayName("TC08: Tài khoản Google mới trên 16 tuổi được tạo với vai trò phụ huynh")
    void googleAuth_newAccountWithBirthday_createsAccountAndUserProfile() throws Exception {
        // Arrange
        String email = "new_google@enjoy.edu.vn";
        LocalDate birthday = LocalDate.now().minusYears(20);
        Map<String, Account> accounts = new HashMap<>();
        Map<String, UserCreateRequest> profiles = new HashMap<>();
        JWTServiceImpl tokenGenerator = createJwtService();
        MockMvc api = loginApi(tokenGenerator, activeUserService);
        useGoogleAccountAndProfileStores(accounts, profiles);

        MvcResult result = api.perform(googleLoginRequest(email, "New Google User", "google-999", birthday))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value(email))
                .andExpect(jsonPath("$.user.username").value("New Google User"))
                .andExpect(jsonPath("$.user.role").value("ROLE_PARENT"))
                .andExpect(jsonPath("$.hasPassword").value(false))
                .andReturn();
        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsByteArray());
        assertThat(tokenGenerator.verifyToken(response.path("accessToken").asText()).getStringClaim("role"))
                .isEqualTo("ROLE_PARENT");
        Account createdAccount = accounts.get(email);
        UserCreateRequest createdProfile = profiles.get(email);
        assertThat(createdAccount.getProvider()).isEqualTo(AuthProvider.GOOGLE);
        assertThat(createdAccount.getPasswordHash()).isNull();
        assertThat(createdAccount.getRole()).isEqualTo(UserRole.ROLE_PARENT);
        assertThat(createdProfile.getAccountId()).isEqualTo(createdAccount.getId());
        assertThat(createdProfile.getUsername()).isEqualTo("New Google User");
        assertThat(createdProfile.getBirthday()).isEqualTo(birthday);
        assertThat(createdProfile.getRole()).isEqualTo(UserRole.ROLE_PARENT);
    }

    /**
     * Test Case 9: Tài khoản mới có độ tuổi dưới 16 (<= 16 tuổi) -> Tự động xác định vai trò ROLE_CHILDREN.
     */
    @Test
    @DisplayName("TC09: Tài khoản Google mới 12 tuổi được phân vai trò trẻ em")
    void googleAuth_newAccountAgeUnder16_roleIsChildren() throws Exception {
        // Arrange
        String email = "child_google@enjoy.edu.vn";
        LocalDate birthday = LocalDate.now().minusYears(12);
        Map<String, Account> accounts = new HashMap<>();
        Map<String, UserCreateRequest> profiles = new HashMap<>();
        JWTServiceImpl tokenGenerator = createJwtService();
        MockMvc api = loginApi(tokenGenerator, activeUserService);
        useGoogleAccountAndProfileStores(accounts, profiles);

        api.perform(googleLoginRequest(email, "Child Google User", null, birthday))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value(email))
                .andExpect(jsonPath("$.user.role").value("ROLE_CHILDREN"));

        assertThat(accounts.get(email).getRole()).isEqualTo(UserRole.ROLE_CHILDREN);
        assertThat(profiles.get(email).getRole()).isEqualTo(UserRole.ROLE_CHILDREN);
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
    @DisplayName("TC10: Tên Google null thì username lấy tiền tố email")
    void googleAuth_newAccountNullName_usernameFallsBackToEmailPrefix() throws Exception {
        // Arrange
        String email = "john.doe@gmail.com";
        Map<String, Account> accounts = new HashMap<>();
        Map<String, UserCreateRequest> profiles = new HashMap<>();
        MockMvc api = loginApi(createJwtService(), activeUserService);
        useGoogleAccountAndProfileStores(accounts, profiles);

        api.perform(googleLoginRequest(email, null, null, LocalDate.of(1990, 1, 1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value("john.doe"));
        assertThat(profiles.get(email).getUsername()).isEqualTo("john.doe");
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
    @DisplayName("TC11: Đổi mật khẩu thành công với mật khẩu hiện tại hợp lệ")
    void changePassword_localAccountValidCurrentPwd_updatesPasswordHash() throws Exception {
        // Arrange
        String newPassword = "NewPassword@456";
        String newPasswordHash = "$2a$10$newEncryptedPasswordHash";
        JWTServiceImpl tokenGenerator = createJwtService();
        MockMvc api = loginApi(tokenGenerator, activeUserService);
        when(accountRepository.findById(defaultAccount.getId())).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn(newPasswordHash);
        when(accountRepository.save(defaultAccount)).thenReturn(defaultAccount);
        when(accountRepository.findByEmail(defaultAccount.getEmail())).thenReturn(Optional.of(defaultAccount));
        when(passwordEncoder.matches(newPassword, newPasswordHash)).thenReturn(true);

        api.perform(changePasswordRequest(defaultAccount.getId(), rawPassword, newPassword))
                .andExpect(status().isOk());
        api.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", defaultAccount.getEmail(), "password", newPassword))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasPassword").value(true))
                .andExpect(jsonPath("$.user.email").value(defaultAccount.getEmail()));
    }

    /**
     * Verifies that a Google account without a password can set one without a current password.
     */
    @Test
    @DisplayName("TC12: Tài khoản Google chưa có mật khẩu có thể đặt mật khẩu mới")
    void changePassword_googleAccountNoCurrentPwd_setsPasswordDirectly() throws Exception {
        // Arrange
        String newPassword = "GoogleAccount@456";
        String newPasswordHash = "$2a$10$googleAccountPasswordHash";
        Account googleAccount = Account.builder()
                .id(2L)
                .email("google@enjoy.edu.vn")
                .provider(AuthProvider.GOOGLE)
                .role(UserRole.ROLE_PARENT)
                .passwordHash(null)
                .build();
        JWTServiceImpl tokenGenerator = createJwtService();
        MockMvc api = loginApi(tokenGenerator, activeUserService);
        when(accountRepository.findById(googleAccount.getId())).thenReturn(Optional.of(googleAccount));
        when(passwordEncoder.encode(newPassword)).thenReturn(newPasswordHash);
        when(accountRepository.save(googleAccount)).thenReturn(googleAccount);
        when(accountRepository.findByEmail(googleAccount.getEmail())).thenReturn(Optional.of(googleAccount));
        when(passwordEncoder.matches(newPassword, newPasswordHash)).thenReturn(true);

        api.perform(changePasswordRequest(googleAccount.getId(), null, newPassword))
                .andExpect(status().isOk());
        api.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", googleAccount.getEmail(), "password", newPassword))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasPassword").value(true))
                .andExpect(jsonPath("$.user.email").value(googleAccount.getEmail()));
    }

    /**
     * Verifies that a valid refresh token produces a new access token and tracks user activity.
     */
    @Test
    @DisplayName("TC13: Refresh token hợp lệ trả access token mới")
    void refresh_validToken_returnsNewAccessTokenWithSameRefreshToken() throws Exception {
        // Arrange
        JWTServiceImpl tokenGenerator = createJwtService();
        MockMvc api = loginApi(tokenGenerator, activeUserService);
        String refreshToken = tokenGenerator.generateRefreshToken(
                defaultAccount.getId(), defaultAccount.getEmail(), "ROLE_PARENT");
        UserAuthResponse userAuth = UserAuthResponse.builder()
                .id(defaultAccount.getId())
                .email(defaultAccount.getEmail())
                .username("TestUser")
                .role("ROLE_PARENT")
                .build();
        when(accountRepository.findById(defaultAccount.getId())).thenReturn(Optional.of(defaultAccount));
        when(userClient.getUserByEmail(defaultAccount.getEmail())).thenReturn(userAuth);

        MvcResult result = api.perform(post("/api/auth/refresh").header("refreshToken", refreshToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.refreshToken").value(refreshToken))
                .andExpect(jsonPath("$.hasPassword").value(true))
                .andExpect(jsonPath("$.user.username").value("TestUser"))
                .andReturn();
        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsByteArray());
        JWTClaimsSet accessClaims = tokenGenerator.verifyToken(response.path("accessToken").asText());
        assertThat(accessClaims.getLongClaim("userId")).isEqualTo(defaultAccount.getId());
        assertThat(accessClaims.getStringClaim("email")).isEqualTo(defaultAccount.getEmail());
        assertThat(accessClaims.getStringClaim("role")).isEqualTo("ROLE_PARENT");
    }

    /**
     * Verifies that null or blank refresh tokens are rejected with HTTP 400.
     */
    @Test
    @DisplayName("TC14: Refresh token null hoặc rỗng bị từ chối")
    void refresh_nullOrEmptyToken_throwsBadRequest400() throws Exception {
        MockMvc api = loginApi(createJwtService(), activeUserService);

        api.perform(post("/api/auth/refresh"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Refresh Token không được để trống"));
        api.perform(post("/api/auth/refresh").header("refreshToken", ""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Refresh Token không được để trống"));
        api.perform(post("/api/auth/refresh").header("refreshToken", "   "))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Refresh Token không được để trống"));
    }

    /**
     * Verifies that a refresh token with an invalid signature is rejected with HTTP 401.
     */
    @Test
    @DisplayName("TC15: Refresh token giả mạo hoặc sai chữ ký bị từ chối")
    void refresh_invalidSignatureToken_throwsUnauthorized401() throws Exception {
        // Arrange
        MockMvc api = loginApi(createJwtService(), activeUserService);
        Date issuedAt = new Date();
        String forgedRefreshToken = createSignedToken(
                "9876543210987654321098765432109876543210987654321098765432109876",
                issuedAt,
                Date.from(issuedAt.toInstant().plus(1, ChronoUnit.DAYS)));

        api.perform(post("/api/auth/refresh").header("refreshToken", forgedRefreshToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Refresh Token không hợp lệ hoặc đã hết hạn"));
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
