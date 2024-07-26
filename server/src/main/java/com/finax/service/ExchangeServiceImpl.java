package com.finax.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finax.dto.ExchangeDTO;
import com.finax.entity.Account;
import com.finax.entity.Currency;
import com.finax.entity.Exchange;
import com.finax.entity.User;
import com.finax.mapper.ExchangeMapper;
import com.finax.repository.AccountRepository;
import com.finax.repository.ExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ExchangeServiceImpl implements ExchangeService {
    
    @Value("${finax.app.exchangeApiUrl}")
    private String exchangeApiUrl;
    
    private final RestTemplate restTemplate;
    private final ExchangeRepository exchangeRepository;
    private final AccountRepository accountRepository;
    
    @Autowired
    public ExchangeServiceImpl(RestTemplate restTemplate, ExchangeRepository exchangeRepository, AccountRepository accountRepository) {
        this.exchangeRepository = exchangeRepository;
        this.accountRepository = accountRepository;
        this.restTemplate = restTemplate;
    }
    
    @PreAuthorize("#fromAccount.user.id == principal.id && #toAccount.user.id == principal.id")
    @Transactional(rollbackFor = Exception.class)
    public ExchangeDTO exchange(Account fromAccount, Account toAccount, Currency fromCurrency, Currency toCurrency, BigDecimal amount) {
        if(fromAccount.getCurrency() != fromCurrency || toAccount.getCurrency() != toCurrency) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Currency does not match");
        }
        if(fromCurrency == toCurrency || fromAccount.getCurrency() == toCurrency || toAccount.getCurrency() == fromCurrency) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot exchange the same currency");
        }
        
        try {
            String requestUrl = exchangeApiUrl + "&from=" + fromCurrency.toString() + "&to=" + toCurrency.toString();
            String response = restTemplate.getForObject(requestUrl, String.class);
            JsonNode jsonNode = new ObjectMapper().readTree(response);
            
            BigDecimal exchangeRate = jsonNode.path("rates").path(toCurrency.toString()).decimalValue();
            
            if(fromAccount.getBalance().compareTo(amount) < 0) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have enough funds for this exchange.");
            }
            
            BigDecimal totalAmount = exchangeRate.multiply(amount).setScale(2, RoundingMode.HALF_UP);
            BigDecimal feePercentage = new BigDecimal(0.05);
            BigDecimal fee = totalAmount.multiply(feePercentage).setScale(2, RoundingMode.HALF_UP);
            totalAmount = totalAmount.subtract(fee);
            
            fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
            toAccount.setBalance(toAccount.getBalance().add(totalAmount));
            
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
            
            Exchange exchange = new Exchange(fromCurrency, toCurrency, amount, totalAmount, exchangeRate, fee, fromAccount, toAccount);
            exchangeRepository.save(exchange);
            
            return ExchangeMapper.INSTANCE.exchangeToExchangeDTO(exchange);
        } catch (RestClientException | JsonProcessingException | ArithmeticException ex) {
            System.out.println(ex.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to perform exchange transaction");
        }
    }
    
    @PreAuthorize("#user.id == principal.id")
    public Page<ExchangeDTO> history(User user, Pageable pageable) {
        Page<Exchange> page = exchangeRepository.findAllByUser(user, pageable);
        return page.map(ExchangeMapper.INSTANCE::exchangeToExchangeDTO);
    }
}
