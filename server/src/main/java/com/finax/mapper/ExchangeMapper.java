package com.finax.mapper;

import com.finax.dto.ExchangeDTO;
import com.finax.entity.Exchange;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExchangeMapper {
    ExchangeMapper INSTANCE = Mappers.getMapper(ExchangeMapper.class);
    
    @Mapping(source = "fromAccount.accountNumber", target = "fromAccountNumber")
    @Mapping(source = "toAccount.accountNumber", target = "toAccountNumber")
    ExchangeDTO exchangeToExchangeDTO(Exchange exchange);
    
    List<Exchange> exchangesToExchangeDTOs(List<Exchange> exchanges);
}
