package com.finax.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "accounts",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"currency", "user_id"}),
                @UniqueConstraint(columnNames = {"is_savings", "user_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id", nullable = false)
    private Long id;
    
    @Column(name = "account_number", nullable = false, unique = true)
    private Long accountNumber;
    
    @Column(nullable = false)
    private BigDecimal balance;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;
    
    public Account(Long accountNumber, BigDecimal balance, Currency currency, User user) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.currency = currency;
        this.user = user;
    }
}