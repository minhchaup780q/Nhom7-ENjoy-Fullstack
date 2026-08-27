package com.example.apigateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {
    // Danh sách các API không cần kiểm tra Token
    public static final List<String> openApiEndpoints = List.of(
            "/api/auth/login",
            "/api/user/register",
            "/api/user",
            "/api/auth"
    );

    // bộ lọc tách ra thành url public hay private
    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().startsWith(uri));

}
