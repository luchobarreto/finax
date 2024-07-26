package com.finax.dto;

import com.finax.entity.Currency;
import com.finax.entity.TransactionType;
import com.finax.validation.ValidTransactionFilter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ValidTransactionFilter
public class TransactionFilterDTO {
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private List<Currency> currencies;
    
    private List<TransactionType> transactionTypes;
}
