package com.finax.service;

import org.springframework.http.ResponseCookie;

public interface AuthService {
    ResponseCookie getCookie(String email, String password);
    String encodePassword(String password);
    ResponseCookie cleanCookies();
    Long getUserIdBySession();
    void updatePassword(Long id, String password, String newPassword);
}
