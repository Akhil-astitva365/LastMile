package com.deliverytracker.pricing;

import com.deliverytracker.zone.ZoneType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RateCardRepository extends JpaRepository<RateCard, Long> {

    @Query("SELECT r FROM RateCard r WHERE r.orderType = :orderType AND r.zoneType = :zoneType " +
           "AND r.active = true AND :weight >= r.minWeight AND :weight <= r.maxWeight")
    Optional<RateCard> findApplicableRateCard(
            @Param("orderType") OrderType orderType,
            @Param("zoneType") ZoneType zoneType,
            @Param("weight") Double weight
    );

    List<RateCard> findByOrderTypeAndZoneTypeAndActiveTrue(OrderType orderType, ZoneType zoneType);

    List<RateCard> findByActiveTrue();
}
