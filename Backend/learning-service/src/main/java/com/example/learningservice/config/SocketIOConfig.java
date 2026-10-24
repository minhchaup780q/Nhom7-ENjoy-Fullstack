package com.example.learningservice.config;

import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class SocketIOConfig {

    @Value("${socketio.host:0.0.0.0}")
    private String host;

    @Value("${socketio.port:9092}")
    private Integer port;

    private SocketIOServer server;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname(host);
        config.setPort(port);
        config.setOrigin("*"); // Hỗ trợ CORS cho Web và Mobile kết nối

        // Tùy chỉnh buffer và timeout cho kết nối realtime mượt mà
        config.setUpgradeTimeout(10000);
        config.setPingTimeout(60000);
        config.setPingInterval(25000);

        server = new SocketIOServer(config);

        // Đăng ký sự kiện Client kết nối
        server.addConnectListener(client -> {
            String clientIp = client.getRemoteAddress().toString();
            log.info("Client Socket.IO đã kết nối: sessionId={}, address={}", client.getSessionId(), clientIp);
        });

        // Đăng ký sự kiện Client ngắt kết nối
        server.addDisconnectListener(client -> {
            log.info("Client Socket.IO đã ngắt kết nối: sessionId={}", client.getSessionId());
        });

        try {
            server.start();
            log.info(">>> Netty Socket.IO Server đã khởi động thành công trên cổng {}:{} <<<", host, port);
        } catch (Exception e) {
            log.error("Không thể khởi động Netty Socket.IO Server: {}", e.getMessage(), e);
        }

        return server;
    }

    @PreDestroy
    public void stopServer() {
        if (server != null) {
            log.info("Đang dừng Netty Socket.IO Server...");
            server.stop();
        }
    }
}
