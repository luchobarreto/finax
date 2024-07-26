package com.finax.mapper;

import com.finax.dto.AccountDTO;
import com.finax.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);
    
    @Mapping(source = "user.id", target = "userId")
    AccountDTO accountToAccountDTO(Account account);
    
    List<AccountDTO> accountsToAccountDTOs(List<Account> accounts);
}