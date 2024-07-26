package com.finax.mapper;

import com.finax.dto.TransactionDTO;
import com.finax.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);
    
    @Mapping(source = "senderAccount.accountNumber", target = "senderAccountNumber")
    @Mapping(source = "receiverAccount.accountNumber", target = "receiverAccountNumber")
    @Mapping(source = "senderAccount.user.fullName", target = "senderName")
    @Mapping(source = "receiverAccount.user.fullName", target = "receiverName")
    @Mapping(source = "senderAccount.user.id", target = "senderId")
    @Mapping(source = "receiverAccount.user.id", target = "receiverId")
    @Mapping(source = "senderAccount.user.profilePictureUrl", target = "senderProfilePictureUrl")
    TransactionDTO transactionToTransactionDTO(Transaction transaction);
    
    List<TransactionDTO> transactionsToTransactionDTOs(List<Transaction> transactions);
}
