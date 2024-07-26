package com.finax.repository;

import com.finax.entity.Exchange;
import com.finax.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {
    
    @Query("SELECT e FROM Exchange e WHERE e.fromAccount.user = :user OR e.toAccount.user = :user ORDER BY e.exchangeTime DESC")
    Page<Exchange> findAllByUser(@Param("user") User user, Pageable pageable);
}
