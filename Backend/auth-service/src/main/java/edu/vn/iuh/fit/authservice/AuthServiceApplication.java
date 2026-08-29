package edu.vn.iuh.fit.authservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
        System.out.println("🔐🔐🔐🔐🔐🔐 Auth-Service: http://localhost:8083");
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}
