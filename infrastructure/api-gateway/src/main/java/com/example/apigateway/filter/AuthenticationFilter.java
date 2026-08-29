package com.example.apigateway.filter;

import com.example.apigateway.config.JwtUtil;
import com.example.apigateway.config.RouteValidator;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;


import java.nio.charset.StandardCharsets;


@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter {

    private final JwtUtil jwtUtil;
    private final RouteValidator validator;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // 1. Kiểm tra xem Request này có cần bảo mật không (Whitelist check)
        if (validator.isSecured.test(request)) {

            // 2. Lấy Token từ Header
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            // 3. Nếu không có Token mà vào route bảo mật -> Chặn ngay (Trả về 401)
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return unauthorizedResponse(exchange, "Thiếu Access Token");
            }

            try {
                String token = authHeader.substring(7);
                // 4. Giải mã lấy userId và sessionId
                Claims claims = jwtUtil.extractAllClaims(token);
                Long userId = claims.get("userId", Long.class);
                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);
//              String sessionId = claims.get(""); quản lý thiết bị

                // 5. đưa x-Header vào Headers để gửi xuống các service con
                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                        .header("X-User-Id", String.valueOf(userId))
                        .header("X-User-Email", email)
                        .header("X-User-Role", role)
                        .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());

            } catch (Exception e) {
                System.out.println("Lỗi xác thực Token: " + e.getMessage());
                return unauthorizedResponse(exchange, "Token không hợp lệ hoặc đã hết hạn");
            }
        }

        // Nếu là route công khai (Login/Register) thì cho qua luôn
//        chain là chuỗi filter, vẫn còn nhiều filter ở phía sau, nó sẽ ngầm  chuyển cái request ở filter cuối
        return chain.filter(exchange);
    }

    /**
     * Trả về response 401 kèm body JSON cho Frontend dễ dàng bắt lỗi
     */
    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String body = "{\"status\":401,\"message\":\"" + message + "\"}";
        DataBuffer buffer = response.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }
}