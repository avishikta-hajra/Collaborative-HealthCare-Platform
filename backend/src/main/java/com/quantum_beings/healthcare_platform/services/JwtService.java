package com.quantum_beings.healthcare_platform.services;


import com.quantum_beings.healthcare_platform.entity.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {
    private final SecretKey accessSecret;
    private final SecretKey refreshSecret;
    private final long accessExpirationMs;
    private final long refreshExpirationMs;


    public JwtService(@Value("${jwt.access.secret}")String accessSecret,
                      @Value("${jwt.refresh.secret}")String refreshSecret,
                      @Value("${jwt.access.expiration-ms}")long accessExpirationMs,
                      @Value("${jwt.refresh.expiration-ms}")long refreshExpirationMs) {
        this.accessSecret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(accessSecret));
        this.refreshSecret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshSecret)) ;
        this.accessExpirationMs = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public String generateAccessToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", account.getRole().name());
        return buildToken(claims, account.getEmail(), accessSecret, accessExpirationMs);
    }

    public String generateRefreshToken(Account account) {
        return buildToken(new HashMap<>(), account.getEmail(), refreshSecret, refreshExpirationMs);
    }

    public String buildToken(Map<String, Object> claims, String subject, SecretKey secret, long expirationMs) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + expirationMs);

        return Jwts.builder().claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(validity)
                .signWith(secret)
                .compact();
    }

    public String extractEmailFromAccessToken(String token) {
        return extractAllClaims(token, accessSecret).getSubject();
    }


    public String extractEmailFromRefreshToken(String token) {
        return extractAllClaims(token, refreshSecret).getSubject();
    }

    private boolean isTokenExpired(String token, SecretKey secret) {
        Claims claims = extractAllClaims(token, secret);
        Date expiration = claims.getExpiration();
        return expiration.before(new Date());
    }

    public boolean isAccessTokenValid(String token, UserDetails userDetails) {
        String email = extractEmailFromAccessToken(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token, accessSecret);
    }

    public boolean isRefreshTokenValid(String token, UserDetails userDetails) {
        String email = extractEmailFromRefreshToken(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token, refreshSecret);
    }

    private Claims extractAllClaims(String token, SecretKey secret) {
        return Jwts.parser()
                .verifyWith(secret)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    public Instant getRefreshTokenExpiryTime() {
        return Instant.now().plusMillis(refreshExpirationMs);
    }

}
