package com.finax.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "exchanges")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Exchange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exchange_id", nullable = false, unique = true)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_currency", nullable = false)
    private Currency fromCurrency;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "to_currency", nullable = false)
    private Currency toCurrency;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "exchange_rate", nullable = false)
    private BigDecimal exchangeRate;

    @Column(nullable = false)
    private BigDecimal fee;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "exchange_time", nullable = false)
    private LocalDateTime exchangeTime;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account", nullable = false)
    private Account fromAccount;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account", nullable = false)
    private Account toAccount;
    
    public Exchange(Currency fromCurrency, Currency toCurrency, BigDecimal amount, BigDecimal totalAmount, BigDecimal exchangeRate, BigDecimal fee, Account fromAccount, Account toAccount) {
        this.fromCurrency = fromCurrency;
        this.toCurrency = toCurrency;
        this.amount = amount;
        this.totalAmount = totalAmount;
        this.exchangeRate = exchangeRate;
        this.fee = fee;
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.exchangeTime = LocalDateTime.now();
    }
}
