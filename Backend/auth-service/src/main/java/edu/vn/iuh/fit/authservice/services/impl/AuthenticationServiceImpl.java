package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.client.UserClient;
import edu.vn.iuh.fit.authservice.dto.request.*;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.authservice.entities.Account;
import edu.vn.iuh.fit.authservice.entities.enums.AuthProvider;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import edu.vn.iuh.fit.authservice.repositories.AccountRepository;
import edu.vn.iuh.fit.authservice.services.AuthenticationService;
import edu.vn.iuh.fit.authservice.services.EmailService;
import edu.vn.iuh.fit.authservice.services.JWTService;
import edu.vn.iuh.fit.authservice.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AccountRepository accountRepository;
    private final UserClient userClient; // OpenFeign Client: đây là chỗ gọi qua user-service
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final OtpService otpService;
    private final EmailService emailService;

    @Override
    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail();
        String rawPassword = request.getPassword();

        // 1. Tìm Account trong auth_db
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email chưa được đăng ký!"));

        if (!passwordEncoder.matches(rawPassword, account.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác");
        }

        // Generate JWT Access and Refresh Tokens
        String accessToken = jwtService.generateAccessToken(account.getId(), account.getEmail(), account.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(account.getId(), account.getEmail(), account.getRole().name());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .hasPassword(account.getPasswordHash() != null && !account.getPasswordHash().isEmpty())
                .build();
    }

    @Override
    public void register(RegisterRequest request) {
        String email = request.getEmail();

        // 1. Check if account already exists
        if (accountRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email này đã được đăng ký!");
        }

        // 2. Calculate age and determine role (<= 16 -> ROLE_CHILDREN, > 16 -> ROLE_PARENT)
        UserRole roleEnum = UserRole.ROLE_PARENT;
        if (request.getBirthday() != null) {
            int age = Period.between(request.getBirthday(), LocalDate.now()).getYears();
            if (age <= 16) {
                roleEnum = UserRole.ROLE_CHILDREN;
            }
        }

        // 3. Hash password and store draft registration in Redis with 5m TTL
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        PendingRegistrationDto pendingDto = PendingRegistrationDto.builder()
                .email(email)
                .passwordHash(hashedPassword)
                .username(request.getUsername())
                .birthday(request.getBirthday())
                .role(roleEnum)
                .provider(AuthProvider.LOCAL)
                .build();

        String otpCode = otpService.generateOtp();
        otpService.savePendingRegistration(email, pendingDto, otpCode);

        // 4. Send HTML OTP email
        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(email)
                .subject("Mã xác thực OTP của bạn - Hệ thống ENjoy")
                .msgBody(otpCode)
                .build();

        String mailResult = emailService.sendOtpHtmlMail(emailDetails);
        System.out.println("📧 Mail sending result for " + email + ": " + mailResult);
    }

    @Override
    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail();
        String otpInput = request.getOtp();

        // 1. Validate OTP
        if (!otpService.validateOtp(email, otpInput)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã OTP không chính xác hoặc đã hết hạn!");
        }

        // 2. Get pending registration data from Redis
        PendingRegistrationDto pendingDto = otpService.getPendingRegistration(email);
        if (pendingDto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yêu cầu đăng ký đã hết hạn (quá 5 phút). Vui lòng đăng ký lại.");
        }

        // 3. Save Account in auth_db
        LocalDateTime now = LocalDateTime.now();
        Account account = Account.builder()
                .email(email)
                .passwordHash(pendingDto.getPasswordHash())
                .role(pendingDto.getRole())
                .provider(pendingDto.getProvider())
                .isEnabled(true)
                .createdAt(now)
                .updatedAt(now)
                .build();
        account = accountRepository.save(account);

        // 4. Call OpenFeign Client to create User profile in user-service
        try {
            UserCreateRequest userReq = UserCreateRequest.builder()
                    .accountId(account.getId())
                    .email(account.getEmail())
                    .username(pendingDto.getUsername())
                    .birthday(pendingDto.getBirthday())
                    .role(account.getRole())
                    .build();

            UserCreateResponse userResp = userClient.createUserProfile(userReq);
            System.out.println("✅ User profile created in user-service via OpenFeign: " + userResp.getId());
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Failed to call user-service via OpenFeign: " + e.getMessage());
        }

        // 5. Clean up Redis draft data
        otpService.clearRegistrationData(email);
    }

    @Override
    public void resendOtp(ResendOtpRequest request) {
        String email = request.getEmail();
        PendingRegistrationDto pendingDto = otpService.getPendingRegistration(email);

//        Mỗi thông tin đăng kí lưu tạm trong Redis 15', trong thời gian đó người dùng có thể gửi lại mã OTP 3 lần
        if (pendingDto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yêu cầu đăng ký không tồn tại hoặc đã quá 15 phút. Vui lòng đăng ký lại.");
        }

        String newOtp = otpService.generateOtp();
        otpService.savePendingRegistration(email, pendingDto, newOtp);

        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(email)
                .subject("Mã xác thực OTP mới của bạn - Hệ thống ENjoy")
                .msgBody(newOtp)
                .build();

        emailService.sendOtpHtmlMail(emailDetails);
    }

//    XEM SAU ⁉️⁉️⁉️⁉️⁉️⁉️⁉️⁉️⁉️⁉️⁉️⁉️ COI CƠ CHẾ GG XÁC THỰC THẾ NÀO
//    CHECK LẠI LOGIC GỌI XÁC THỰC GG DIỄN RA Ở FE RỒI GỬI IDTOKEN ĐẾN BE, HAY CHỈ DIỄN RA TẠI BE????
    @Override
    @Transactional
    public LoginResponse googleAuth(GoogleAuthRequest request) {
        String email = request.getEmail();
        Optional<Account> accountOpt = accountRepository.findByEmail(email);

        Account account;
        boolean requiresBirthday = false;

        if (accountOpt.isPresent()) {
            account = accountOpt.get();
        } else {
            // Auto register user via Google
            UserRole roleEnum = UserRole.ROLE_PARENT;
            if (request.getBirthday() != null) {
                int age = Period.between(request.getBirthday(), LocalDate.now()).getYears();
                if (age <= 16) {
                    roleEnum = UserRole.ROLE_CHILDREN;
                }
            } else {
                requiresBirthday = true;
            }

            LocalDateTime now = LocalDateTime.now();
            account = Account.builder()
                    .email(email)
                    .passwordHash(null)
                    .provider(AuthProvider.GOOGLE)
                    .role(roleEnum)
                    .isEnabled(true)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();

            account = accountRepository.save(account);

            // Call OpenFeign to create profile in user-service
            try {
                UserCreateRequest userReq = UserCreateRequest.builder()
                        .accountId(account.getId())
                        .email(email)
                        .username(request.getName() != null ? request.getName() : email.split("@")[0])
                        .birthday(request.getBirthday())
                        .role(roleEnum)
                        .build();

                userClient.createUserProfile(userReq);
            } catch (Exception e) {
                System.err.println("Warning calling user-service via OpenFeign on Google login: " + e.getMessage());
            }
        }

        String roleStr = account.getRole() != null ? account.getRole().name() : UserRole.ROLE_PARENT.name();
        String accessToken = jwtService.generateAccessToken(account.getId(), account.getEmail(), roleStr);
        String refreshToken = jwtService.generateRefreshToken(account.getId(), account.getEmail(), roleStr);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .hasPassword(account.getPasswordHash() != null && !account.getPasswordHash().isEmpty())
                .build();
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản"));

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới và xác nhận mật khẩu không trùng khớp!");
        }

        // If user already has a password, verify current password
        if (account.getPasswordHash() != null && !account.getPasswordHash().isEmpty()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), account.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không chính xác!");
            }
        }

        account.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);
    }

    @Override
    public LoginResponse refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh Token không được để trống");
        }

        // 1. Kiểm tra chữ ký & hạn sử dụng của RefreshToken
        com.nimbusds.jwt.JWTClaimsSet jwtClaimsSet = jwtService.verifyToken(refreshToken);

        // 2. Lấy thông tin user từ claims của RefreshToken
        Long userId = jwtClaimsSet.getClaim("userId") != null ? ((Number) jwtClaimsSet.getClaim("userId")).longValue() : null;
        String email = (String) jwtClaimsSet.getClaim("email");
        String role = (String) jwtClaimsSet.getClaim("role");

        if (userId == null || email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh Token không chứa thông tin hợp lệ");
        }

        // 3. Tạo newAccessToken mới và trả về LoginResponse
        Account account = accountRepository.findById(userId).orElse(null);
        boolean hasPwd = account != null && account.getPasswordHash() != null && !account.getPasswordHash().isEmpty();

        String newAccessToken = jwtService.generateAccessToken(userId, email, role);
        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .hasPassword(hasPwd)
                .build();
    }
}
