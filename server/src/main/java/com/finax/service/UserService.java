package com.finax.service;

import com.finax.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    User createUser(String email, String username, String password, String fullName);
    User getUser(Long id);
    User updateUser(Long id, String fullName);
    User uploadProfilePicture(User user, MultipartFile multipartFile);
}
