package com.finax.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.finax.entity.Currency;
import com.finax.entity.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private Long id;
    private BigDecimal amount;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Currency currency;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private TransactionType transactionType;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime transactionDate;
    private String reason;
    private Long senderAccountNumber;
    private Long receiverAccountNumber;
    
    private String senderName;
    private Long senderId;
    private String senderProfilePictureUrl;
    private String receiverName;
    private Long receiverId;
}
