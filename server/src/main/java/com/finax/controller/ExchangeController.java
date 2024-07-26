package com.finax.controller;

import com.finax.dto.ExchangeDTO;
import com.finax.dto.request.ExchangeRequest;
import com.finax.entity.Account;
import com.finax.entity.User;
import com.finax.security.UserDetailsImpl;
import com.finax.service.AccountService;
import com.finax.service.ExchangeService;
import com.finax.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exchange")
public class ExchangeController {
    
    private final ExchangeService exchangeService;
    private final AccountService accountService;
    private final UserService userService;
    
    @Autowired
    public ExchangeController(ExchangeService exchangeService, AccountService accountService, UserService userService) {
        this.exchangeService = exchangeService;
        this.accountService = accountService;
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<ExchangeDTO> exchange(@Valid @RequestBody ExchangeRequest request) {
        Account fromAccount = accountService.getAccountByAccountNumber(request.getFromAccountNumber());
        Account toAccount = accountService.getAccountByAccountNumber(request.getToAccountNumber());
        ExchangeDTO exchange = exchangeService.exchange(fromAccount, toAccount, request.getFromCurrency(), request.getToCurrency(), request.getAmount());
        return ResponseEntity.ok(exchange);
    }
    
    @GetMapping("/history")
    public ResponseEntity<Page<ExchangeDTO>> getHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(size = 10, sort = "exchangeTime", direction = Sort.Direction.DESC) Pageable pageable) {
        User user = userService.getUser(userDetails.getId());
        Page<ExchangeDTO> exchanges = exchangeService.history(user, pageable);
        return ResponseEntity.ok(exchanges);
    }
}
