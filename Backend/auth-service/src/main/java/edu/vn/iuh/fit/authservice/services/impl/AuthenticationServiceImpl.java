package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.request.LoginRequest;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;
import edu.vn.iuh.fit.authservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.authservice.services.AuthenticationService;
import edu.vn.iuh.fit.authservice.services.JWTService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.HttpStatusCodeException;

import javax.crypto.SecretKey;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final RestTemplate restTemplate;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    @Value("${jwt.signerKey}")
    private String secretKey;


    @Override
    public LoginResponse login(LoginRequest request) {
        String url = "http://localhost:8083/api/user/internal/by-email?email=" + request.getEmail();
        UserAuthResponse user;

        try {
            user = restTemplate.getForObject(url, UserAuthResponse.class);
        } catch (HttpStatusCodeException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email chưa được đăng ký!");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email hoặc mật khẩu không chính xác");
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Hệ thống xác thực tạm thời gián đoạn, vui lòng thử lại sau");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lỗi trong quá trình xác thực thông tin đăng nhập");
        }

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email chưa được đăng ký!");
        }

        // 2. So khớp mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác");
        }

        // 3. Trả về Token
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail(), user.getRole());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
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
        String newAccessToken = jwtService.generateAccessToken(userId, email, role);
        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .build();
    }
}


