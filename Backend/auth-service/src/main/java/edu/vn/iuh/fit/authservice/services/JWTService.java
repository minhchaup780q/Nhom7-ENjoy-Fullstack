package edu.vn.iuh.fit.authservice.services;

import com.nimbusds.jwt.JWTClaimsSet;

public interface JWTService {
    String generateRefreshToken(Long userId, String email, String role);
    String generateAccessToken(Long userId, String email, String role);
    JWTClaimsSet verifyToken(String token);
}

