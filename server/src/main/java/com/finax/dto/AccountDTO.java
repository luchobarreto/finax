package com.finax.dto;

import com.finax.entity.Currency;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountDTO {
    private Long id;
    private Long accountNumber;
    private BigDecimal balance;
    private Currency currency;
    private Long userId;
}