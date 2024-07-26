package com.finax.service;

import com.finax.dto.AccountDTO;
import com.finax.entity.Account;
import com.finax.entity.Currency;
import com.finax.entity.User;
import com.finax.mapper.AccountMapper;
import com.finax.repository.AccountRepository;
import com.finax.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AccountServiceImpl implements AccountService {
    
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public Account createAccount(User user, Currency currency) {
        if(accountRepository.existsByUserAndCurrency(user, currency)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Account with currency: " + currency + " already exists");
        }
        Long accountNumber = generateUniqueAccountNumber();
        Account account = new Account(accountNumber, BigDecimal.ZERO, currency, user);
        return accountRepository.save(account);
    }
    
    public List<AccountDTO> getAccounts(User user) {
        List<Account> accounts = accountRepository.findByUser(user);
        return AccountMapper.INSTANCE.accountsToAccountDTOs(accounts);
    }
    
    @PostAuthorize("returnObject.userId == principal.id")
    public AccountDTO getAccount(Long id) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));
        return AccountMapper.INSTANCE.accountToAccountDTO(account);
    }
    
    public Account getAccountByAccountNumber(Long accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));
    }
    
    private Long generateUniqueAccountNumber() {
        Long accountNumber;
        do {
            accountNumber = generateRandomAccountNumber();
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
    
    private Long generateRandomAccountNumber() {
        UUID uuid = UUID.randomUUID();
        Long number = Math.abs(uuid.getMostSignificantBits());
        return number % 1000000000000000L;
    }
}
