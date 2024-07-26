package com.finax.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.WebUtils;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {
    @Value("${finax.app.jwtSecret}")
    private String secret;

    @Value("${finax.app.jwtExpirationMs}")
    private int expirationMs;

    @Value("${finax.app.cookieName}")
    private String cookieName;

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, cookieName);
        if(cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }
    
    public ResponseCookie generateJwtCookie(UserDetailsImpl principal) {
        String jwt = generateCookieFromUsername(principal.getUsername(), principal.getId());
        return ResponseCookie.from(cookieName, jwt)
                .path("/")
                .maxAge(24 * 60 * 60)
                .httpOnly(true)
                .secure(false)
                .sameSite("None")
                .build();
    }
    
    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from(cookieName, null).path("/").maxAge(0).build();
    }
    
    public String getUsernameFromToken(String token) {
        return Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }
    
    public Long getIdFromToken(String token) {
        return Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload().get("id", Long.class);
    }
    
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private String generateCookieFromUsername(String username, Long id) {
        Map<String, Long> claims = new HashMap<>();
        claims.put("id", id);
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + expirationMs))
                .claims(claims)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}
