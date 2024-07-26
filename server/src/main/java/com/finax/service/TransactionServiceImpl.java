package com.finax.service;

import com.finax.dto.TransactionDTO;
import com.finax.entity.*;
import com.finax.mapper.TransactionMapper;
import com.finax.repository.AccountRepository;
import com.finax.repository.TransactionRepository;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {
    
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    
    @Autowired
    public TransactionServiceImpl(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }
    
    @PreAuthorize("#account.user.id == principal.id")
    @Transactional(rollbackFor = Exception.class)
    public TransactionDTO deposit(Account account, BigDecimal amount, Currency currency) {
        if(amount.compareTo(new BigDecimal(100000)) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deposit amount exceeds 100000");
        }
        if(account.getCurrency() != currency) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "The currency is not supported for this account.");
        }
        
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
        
        Transaction transaction = transactionRepository.save(new Transaction(amount, currency, TransactionType.DEPOSIT, account, account));
        
        return TransactionMapper.INSTANCE.transactionToTransactionDTO(transaction);
    }
    
    @PreAuthorize("#fromAccountNumber.user.id == principal.id")
    @Transactional(rollbackFor = Exception.class)
    public TransactionDTO transfer(Account fromAccountNumber, Account toAccountNumber, BigDecimal amount, Currency currency, String reason) {
        if(fromAccountNumber.getCurrency() != currency || toAccountNumber.getCurrency() != currency) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "The currency is not supported for this account.");
        }
        if(fromAccountNumber.getBalance().compareTo(amount) < 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have enough funds for this transfer.");
        }
        
        fromAccountNumber.setBalance(fromAccountNumber.getBalance().subtract(amount));
        toAccountNumber.setBalance(toAccountNumber.getBalance().add(amount));
        
        accountRepository.save(fromAccountNumber);
        accountRepository.save(toAccountNumber);
        
        Transaction transaction = transactionRepository.save(new Transaction(amount, currency, TransactionType.TRANSFER, fromAccountNumber, toAccountNumber));
        if(reason != null) {
            transaction.setReason(reason);
        }
        return TransactionMapper.INSTANCE.transactionToTransactionDTO(transaction);
    }
    
    @PreAuthorize("#user.id == principal.id")
    public Page<TransactionDTO> history(User user, Pageable pageable, LocalDateTime startDate, LocalDateTime endDate, List<Currency> currencies, List<TransactionType> transactionTypes) {
        if(startDate == null) {
            startDate = LocalDateTime.of(2024, 1, 1, 0, 0);
        }
        
        if(endDate == null) {
            endDate = LocalDateTime.now();
        }
        
        if(currencies == null || currencies.isEmpty()) {
            currencies = List.of(Currency.USD, Currency.AUD, Currency.CAD, Currency.EUR, Currency.JPY);
        }
        
        if(transactionTypes == null || transactionTypes.isEmpty()) {
            transactionTypes = List.of(TransactionType.DEPOSIT, TransactionType.TRANSFER);
        }
        
        Page<Transaction> page = transactionRepository.findAllByUser(user, startDate, endDate, currencies, transactionTypes, pageable);
        return page.map(TransactionMapper.INSTANCE::transactionToTransactionDTO);
    }
}
