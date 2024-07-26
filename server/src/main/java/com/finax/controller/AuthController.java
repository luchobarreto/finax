package com.finax.controller;

import com.finax.dto.request.SignInRequest;
import com.finax.dto.request.SignUpRequest;
import com.finax.dto.response.MessageResponse;
import com.finax.entity.User;
import com.finax.repository.UserRepository;
import com.finax.service.AuthService;
import com.finax.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    
    @Autowired
    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignInRequest request) {
        ResponseCookie cookie = authService.getCookie(request.getUsername(), request.getPassword());
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest request) {
        userService.createUser(request.getEmail(), request.getUsername(), request.getPassword(), request.getFullName());
        return ResponseEntity.ok().body(new MessageResponse("User registered"));
    }
    
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie cookie = authService.cleanCookies();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }
}
