package edu.vn.iuh.fit.authservice.services;

public interface JWTService {
    String generateRefreshToken(Long userId, String email);
    String generateAccessToken(Long userId, String email, String role);
}
