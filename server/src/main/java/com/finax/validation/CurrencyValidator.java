package com.finax.validation;

import com.finax.entity.Currency;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.List;

public class CurrencyValidator implements ConstraintValidator<ValidCurrency, Currency> {
    
    List<Currency> currencies;
    
    @Override
    public void initialize(ValidCurrency constraintAnnotation) {
        currencies = Arrays.asList(Currency.values());
    }
    
    @Override
    public boolean isValid(Currency currency, ConstraintValidatorContext constraintValidatorContext) {
        if(currency == null) return true;
        return currencies.contains(currency);
    }
}
