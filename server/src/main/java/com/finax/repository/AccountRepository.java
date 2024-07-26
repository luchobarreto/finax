package com.finax.repository;

import com.finax.entity.Account;
import com.finax.entity.Currency;
import com.finax.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    boolean existsByUserAndCurrency(User user, Currency currency);
    boolean existsByAccountNumber(Long accountNumber);
    List<Account> findByUser(User user);
    Optional<Account> findByAccountNumber(Long accountNumber);
}
