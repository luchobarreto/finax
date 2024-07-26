package com.finax.dto.request;

import com.finax.entity.Currency;
import com.finax.validation.ValidCurrency;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferRequest {
    @NotNull(message = "From account number is mandatory")
    private Long fromAccountNumber;

    @NotNull(message = "To account number is mandatory")
    private Long toAccountNumber;

    @NotNull(message = "Currency is mandatory")
    @ValidCurrency
    private Currency currency;

    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String reason;
}
