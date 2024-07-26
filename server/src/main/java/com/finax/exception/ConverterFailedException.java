package com.finax.exception;

public class ConverterFailedException extends RuntimeException {
    public ConverterFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}