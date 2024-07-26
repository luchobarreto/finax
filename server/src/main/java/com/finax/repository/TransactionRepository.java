package com.finax.repository;

import com.finax.entity.Currency;
import com.finax.entity.Transaction;
import com.finax.entity.TransactionType;
import com.finax.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    @Query("SELECT t FROM Transaction t " +
            "WHERE (t.receiverAccount.user = :user OR t.senderAccount.user = :user) " +
            "AND t.transactionDate >= :startDate " +
            "AND t.transactionDate <= :endDate " +
            "AND t.currency IN :currencies " +
            "AND t.transactionType IN :transactionTypes " +
            "ORDER BY t.transactionDate DESC")
    Page<Transaction> findAllByUser(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("currencies") List<Currency> currencies,
            @Param("transactionTypes") List<TransactionType> transactionTypes,
            Pageable pageable
    );
}
