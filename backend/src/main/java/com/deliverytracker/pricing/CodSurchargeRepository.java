package com.deliverytracker.pricing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodSurchargeRepository extends JpaRepository<CodSurcharge, Long> {
    Optional<CodSurcharge> findByOrderTypeAndActiveTrue(OrderType orderType);
}
