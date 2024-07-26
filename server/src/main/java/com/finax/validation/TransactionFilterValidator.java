package com.finax.validation;

import com.finax.dto.TransactionFilterDTO;
import com.finax.entity.Currency;
import com.finax.entity.TransactionType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class TransactionFilterValidator implements ConstraintValidator<ValidTransactionFilter, TransactionFilterDTO> {
    
    private static final List<String> ALLOWED_CURRENCIES = List.of("USD", "EUR", "CAD", "JPY", "AUD");
    private static final List<String> ALLOWED_TRANSACTION_TYPES = List.of("DEPOSIT", "TRANSFER");
    
    @Override
    public boolean isValid(TransactionFilterDTO filter, ConstraintValidatorContext context) {
        if (filter == null) {
            return true;
        }
        
        boolean valid = true;
        
        if (filter.getCurrencies() != null) {
            for (Currency currency : filter.getCurrencies()) {
                if (!ALLOWED_CURRENCIES.contains(currency.name())) {
                    context.buildConstraintViolationWithTemplate("Invalid currency: " + currency.name())
                            .addPropertyNode("currencies")
                            .addConstraintViolation()
                            .disableDefaultConstraintViolation();
                    valid = false;
                }
            }
        }
        
        if (filter.getTransactionTypes() != null) {
            for (TransactionType type : filter.getTransactionTypes()) {
                if (!ALLOWED_TRANSACTION_TYPES.contains(type.name())) {
                    context.buildConstraintViolationWithTemplate("Invalid transaction type: " + type.name())
                            .addPropertyNode("transactionTypes")
                            .addConstraintViolation()
                            .disableDefaultConstraintViolation();
                    valid = false;
                }
            }
        }
        
        if (filter.getStartDate() != null && filter.getEndDate() != null) {
            if (filter.getStartDate().isAfter(filter.getEndDate())) {
                context.buildConstraintViolationWithTemplate("Start date must be before end date")
                        .addPropertyNode("startDate")
                        .addConstraintViolation()
                        .disableDefaultConstraintViolation();
                valid = false;
            }
        }
        
        return valid;
    }
}