package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.request.LoginRequest;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.authservice.services.AuthenticationService;
import edu.vn.iuh.fit.authservice.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final RestTemplate restTemplate;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;


    @Override
    public LoginResponse login(LoginRequest request) {
        String url = "http://localhost:8083/api/user/internal/by-email?email=" + request.getEmail();
        UserAuthResponse user;

        try {
            user = restTemplate.getForObject(url, UserAuthResponse.class);
            System.out.println("--> Kết quả nhận về từ user-service: " + user);
        } catch (HttpClientErrorException e) {
            System.err.println("--> Lỗi HTTP khi gọi user-service: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Lỗi gọi user-service: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("--> Không thể kết nối tới user-service (Port 8083): " + e.getMessage());
            throw new RuntimeException("Không thể kết nối tới User Service");
        }

        if (user == null) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        // 2. So khớp mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        // 3. Trả về Token
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
