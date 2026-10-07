package com.example.news_summarizer.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    private final String SECRET_KEY = "u1m+5zDQvVmO1ZryDzjRtK2R3G2EyjLQH5xWQg4sHzY=";

    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // SecretKey 객체 넣기
                .compact();
    }
    public Long getUserIdFromToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            String userIdStr = claims.getBody().getSubject();
            return Long.parseLong(userIdStr);
        } catch (JwtException | IllegalArgumentException e) {
            // 토큰이 유효하지 않을 경우 예외 처리
            return null;
        }
    }
}

