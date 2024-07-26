package com.finax.service;

import com.finax.dto.ExchangeDTO;
import com.finax.entity.Account;
import com.finax.entity.Currency;
import com.finax.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ExchangeService {
    ExchangeDTO exchange(Account fromAccount, Account toAccount, Currency fromCurrency, Currency toCurrency, BigDecimal amount);
    Page<ExchangeDTO> history(User user, Pageable pageable);
}
