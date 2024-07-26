package com.finax.dto;

import com.finax.entity.Currency;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeDTO {
    private Long id;
    private Currency fromCurrency;
    private Currency toCurrency;
    private BigDecimal amount;
    private BigDecimal exchangeRate;
    private BigDecimal fee;
    private BigDecimal totalAmount;
    private LocalDateTime exchangeTime;
    private Long fromAccountNumber;
    private Long toAccountNumber;
}
