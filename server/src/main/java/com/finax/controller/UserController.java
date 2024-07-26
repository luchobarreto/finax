package com.finax.controller;

import com.finax.dto.request.UpdateUserRequest;
import com.finax.entity.User;
import com.finax.repository.UserRepository;
import com.finax.security.UserDetailsImpl;
import com.finax.service.UserService;
import jakarta.validation.Valid;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.print.attribute.standard.Media;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<User> getUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userService.getUser(userDetails.getId());
        return ResponseEntity.ok(user);
    }
    
    @PatchMapping
    public ResponseEntity<User> updateUser(@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody UpdateUserRequest request) {
        User user = userService.updateUser(userDetails.getId(), request.getFullName());
        return ResponseEntity.ok(user);
    }
    
    @PostMapping(value = "/profile-picture", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<User> uploadProfilePicture(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestParam("file") MultipartFile file) {
        User user = userService.getUser(userDetails.getId());
        return ResponseEntity.ok(userService.uploadProfilePicture(user, file));
    }
}
