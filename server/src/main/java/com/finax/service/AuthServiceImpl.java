package com.finax.service;

import com.finax.entity.User;
import com.finax.repository.UserRepository;
import com.finax.security.CustomAuthenticationProvider;
import com.finax.security.JwtUtils;
import com.finax.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {
    
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final CustomAuthenticationProvider authenticationProvider;
    private final HttpServletRequest request;
    private final UserRepository userRepository;
    
    @Autowired
    public AuthServiceImpl(PasswordEncoder passwordEncoder, JwtUtils jwtUtils, CustomAuthenticationProvider authenticationProvider, HttpServletRequest request, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationProvider = authenticationProvider;
        this.request = request;
        this.userRepository = userRepository;
    }
    
    public ResponseCookie getCookie(String email, String password) {
        Authentication authentication = authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = getUserDetails(authentication);
        return jwtUtils.generateJwtCookie(userDetails);
    }
    
    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }
    
    public ResponseCookie cleanCookies() {
        return jwtUtils.getCleanJwtCookie();
    }
    
    public Long getUserIdBySession() {
        try {
            return jwtUtils.getIdFromToken(jwtUtils.getJwtFromCookies(request));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user session.");
        }
    }
    
    @PreAuthorize("#id == principal.id")
    public void updatePassword(Long id, String password, String newPassword) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        
        boolean isValid = passwordEncoder.matches(password, user.getPassword());
        
        if (isValid) {
            String encodedPassword = encodePassword(password);
            user.setPassword(encodedPassword);
            userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password.");
        }
    }
    
    private UserDetailsImpl getUserDetails(Authentication authentication) {
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}
