package com.finax.controller;

import com.finax.dto.AccountDTO;
import com.finax.entity.User;
import com.finax.security.UserDetailsImpl;
import com.finax.service.AccountService;
import com.finax.service.AuthService;
import com.finax.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    
    private final AccountService accountService;
    private final UserService userService;
    private final AuthService authService;
    
    @Autowired
    public AccountController(AccountService accountService, UserService userService, AuthService authService) {
        this.accountService = accountService;
        this.userService = userService;
        this.authService = authService;
    }
    
    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAccount() {
        User user = userService.getUser(authService.getUserIdBySession());
        List<AccountDTO> accounts = accountService.getAccounts(user);
        return ResponseEntity.ok(accounts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable long id) {
        System.out.println("User id: " + userDetails.getId());
        AccountDTO account = accountService.getAccount(id);
        return ResponseEntity.ok(account);
    }
}
