package edu.vn.iuh.fit.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(UserServiceApplication.class, args);
        System.out.println("👽👽👽👽👽👽👽 User-Service: http://localhost:8083");
    }

}
