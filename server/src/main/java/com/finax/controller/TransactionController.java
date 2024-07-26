package com.finax.controller;

import com.finax.dto.TransactionDTO;
import com.finax.dto.TransactionFilterDTO;
import com.finax.dto.request.DepositRequest;
import com.finax.dto.request.TransferRequest;
import com.finax.entity.Account;
import com.finax.entity.User;
import com.finax.security.UserDetailsImpl;
import com.finax.service.AccountService;
import com.finax.service.TransactionService;
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
@RequestMapping("/transaction")
public class TransactionController {
    
    private final TransactionService transactionService;
    private final AccountService accountService;
    private final UserService userService;
    
    @Autowired
    public TransactionController(TransactionService transactionService, AccountService accountService, UserService userService) {
        this.transactionService = transactionService;
        this.accountService = accountService;
        this.userService = userService;
    }
    
    @PostMapping("/deposit/{accountNumber}")
    public ResponseEntity<TransactionDTO> deposit(
            @PathVariable Long accountNumber,
            @Valid @RequestBody DepositRequest request) {
        Account account = accountService.getAccountByAccountNumber(accountNumber);
        TransactionDTO transaction = transactionService.deposit(account, request.getAmount(), request.getCurrency());
        return ResponseEntity.ok(transaction);
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<TransactionDTO> transfer(@Valid @RequestBody TransferRequest request) {
        Account fromAccount = accountService.getAccountByAccountNumber(request.getFromAccountNumber());
        Account toAccount = accountService.getAccountByAccountNumber(request.getToAccountNumber());
        TransactionDTO transaction = transactionService.transfer(fromAccount, toAccount, request.getAmount(), request.getCurrency(), request.getReason());
        return ResponseEntity.ok(transaction);
    }
    
    @GetMapping("/history")
    public ResponseEntity<Page<TransactionDTO>> getHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(size = 10, sort = "transactionDate", direction = Sort.Direction.DESC) Pageable pageable,
            @Valid @ModelAttribute TransactionFilterDTO request) {
        User user = userService.getUser(userDetails.getId());
        Page<TransactionDTO> transactions = transactionService.history(user, pageable, request.getStartDate(),
                request.getEndDate(), request.getCurrencies(), request.getTransactionTypes());
        return ResponseEntity.ok(transactions);
    }
}
