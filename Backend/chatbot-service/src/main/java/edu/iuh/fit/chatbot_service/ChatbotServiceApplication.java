package edu.iuh.fit.chatbot_service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.event.EventListener;

@Slf4j
@SpringBootApplication
@EnableDiscoveryClient
public class ChatbotServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatbotServiceApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("==================================================================================");
        log.info("🚀 [CHATBOT-SERVICE] KHỞI ĐỘNG THÀNH CÔNG TRÊN CỔNG 8085!");
        log.info("🌐 [EUREKA CLIENT] Đang kết nối và đồng bộ với Eureka Server (http://localhost:8761/eureka/)...");
        log.info("🤖 [AI ASSISTANT] Sẵn sàng nhận yêu cầu phân tích lỗi và giải thích bài tập!");
        log.info("==================================================================================");
    }
}