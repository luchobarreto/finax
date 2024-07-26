package com.finax.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Arrays;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum Currency {
    USD, CAD, AUD, EUR, JPY;
    
    public static boolean isValid(Currency currency) {
        return currency != null && Arrays.asList(values()).contains(currency);
    }
}
