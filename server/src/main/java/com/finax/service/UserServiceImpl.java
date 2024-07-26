package com.finax.service;

import com.finax.entity.Currency;
import com.finax.entity.User;
import com.finax.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService {
    
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AccountService accountService;
    private final FileService fileService;
    
    @Autowired
    public UserServiceImpl(PasswordEncoder passwordEncoder, UserRepository userRepository, AccountService accountService, FileService fileService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.accountService = accountService;
        this.fileService = fileService;
    }
    
    public User createUser(String email, String username, String password, String fullName) {
        if(userRepository.existsByEmail(email) || userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
        }
        User user = userRepository.save(new User(email, username, passwordEncoder.encode(password), fullName));
        for(Currency currency : Currency.values()) {
            accountService.createAccount(user, currency);
        }
        return user;
    }
    
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
    
    @PreAuthorize("#id == principal.id")
    public User updateUser(Long id, String fullName) {
        User updatedUser = getUser(id);
        updatedUser.setFullName(fullName);
        return userRepository.save(updatedUser);
    }
    
    @PreAuthorize("#user.id == principal.id")
    @Transactional(rollbackFor = Exception.class)
    public User uploadProfilePicture(User user, MultipartFile multipartFile) {
        if(user.getProfilePictureUrl() != null) {
            fileService.deleteFile(user.getProfilePictureUrl());
            user.setProfilePictureUrl(null);
        }
        
        if(multipartFile != null) {
            user.setProfilePictureUrl(fileService.uploadFile(multipartFile));
            return userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The image is null.");
        }
    }
}
