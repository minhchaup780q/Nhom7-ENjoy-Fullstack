package edu.vn.iuh.fit.authservice.services.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import edu.vn.iuh.fit.authservice.services.JWTService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JWTServiceImpl implements JWTService {
    @Value("${jwt.signerKey}")
    private String secretKey;

    @Override
    public String generateAccessToken(Long userId, String email, String role){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

//        Thời gian tạo
        Date issueTime = new Date();
//        Thời gian hết hạn
        Date expiredTime = Date.from(issueTime.toInstant().plus(30, ChronoUnit.MINUTES));

        JWTClaimsSet claimsSet =  new JWTClaimsSet.Builder()
                .claim("userId", userId)
                .claim("email", email)
                .claim("role", role)
                .issueTime(issueTime)
                .expirationTime(expiredTime)
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
        return jwsObject.serialize();
    }

    @Override
    public String generateRefreshToken(Long userId, String email, String role){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        Date issueTime = new Date();
        Date expiredTime = Date.from(issueTime.toInstant().plus(30, ChronoUnit.DAYS));
        JWTClaimsSet claimsSet =  new JWTClaimsSet.Builder()
                .claim("userId", userId)
                .claim("email", email)
                .claim("role", role)
                .issueTime(issueTime)
                .expirationTime(expiredTime)
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
        return jwsObject.serialize();
    }

    @Override
    public JWTClaimsSet verifyToken(String token) {
        try {
            JWSVerifier verifier = new MACVerifier(secretKey.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);

            boolean verified = signedJWT.verify(verifier);
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            if (!verified || expirationTime == null || expirationTime.before(new Date())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh Token không hợp lệ hoặc đã hết hạn");
            }

            return signedJWT.getJWTClaimsSet();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh Token không hợp lệ");
        }
    }
}

