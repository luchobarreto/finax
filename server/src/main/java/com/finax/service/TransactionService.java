package com.finax.service;

import com.finax.dto.TransactionDTO;
import com.finax.entity.Account;
import com.finax.entity.Currency;
import com.finax.entity.TransactionType;
import com.finax.entity.User;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
    TransactionDTO deposit(Account account, BigDecimal amount, Currency currency);
    TransactionDTO transfer(Account fromAccount, Account toAccount, BigDecimal amount, Currency currency, String reason);
    Page<TransactionDTO> history(User user, Pageable pageable, LocalDateTime startDate, LocalDateTime endDate, List<Currency> currencies, List<TransactionType> transactionTypes);
}
