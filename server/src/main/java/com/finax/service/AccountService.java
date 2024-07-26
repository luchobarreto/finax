package com.finax.service;

import com.finax.dto.AccountDTO;
import com.finax.entity.Account;
import com.finax.entity.Currency;
import com.finax.entity.User;

import java.util.List;

public interface AccountService {
    Account createAccount(User user, Currency currency);
    List<AccountDTO> getAccounts(User user);
    AccountDTO getAccount(Long id);
    Account getAccountByAccountNumber(Long accountNumber);
}
