package edu.vn.iuh.fit.authservice.services.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import edu.vn.iuh.fit.authservice.services.JWTService;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JWTServiceImpl implements JWTService {
    private String secretKey = "4gL4FEITqMycd852i80EhKEgtwltDhL0OCewy5HZQfqd2LAKauACaxkjgBW6JIev";

    public String generateAccessToken(Long userId, String email, String role){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);


        Date issueTime = new Date();
        Date expiredTime = Date.from(issueTime.toInstant().plus(30, ChronoUnit.MINUTES));
        JWTClaimsSet claimsSet =  new JWTClaimsSet.Builder()
                .subject(email)
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

    public String generateRefreshToken(Long userId, String email){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);


        Date issueTime = new Date();
        Date expiredTime = Date.from(issueTime.toInstant().plus(30, ChronoUnit.DAYS));
        JWTClaimsSet claimsSet =  new JWTClaimsSet.Builder()
                .subject(email)
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
}
