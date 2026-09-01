package com.example.apigateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {
    // Danh sách các API công khai (Public Whitelist)
    public static final List<String> openApiEndpoints = List.of(
            "/api/auth/login",
            "/api/auth/login-by-google",
            "/api/auth/register",
            "/api/auth/verify-otp",
            "/api/auth/resend-otp",
            "/api/auth/refresh",
            "/api/user"
    );

    // Bộ lọc: nếu request KHÔNG nằm trong whitelist thì là route cần bảo mật (sẽ giải mã JWT và gắn X-User-Id)
    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().equals(uri) 
                            || request.getURI().getPath().startsWith("/api/user/public")
                            || request.getURI().getPath().startsWith("/api/v1/speech")
                            || request.getURI().getPath().startsWith("/api/v1/object"));
}
