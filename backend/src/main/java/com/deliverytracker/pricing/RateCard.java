package com.deliverytracker.pricing;

import com.deliverytracker.zone.ZoneType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rate_cards")
public class RateCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ZoneType zoneType;

    @Column(nullable = false)
    private Double minWeight;

    @Column(nullable = false)
    private Double maxWeight;

    @Column(nullable = false)
    private BigDecimal baseCharge;

    @Column(nullable = false)
    private BigDecimal perKgCharge;

    @Column(nullable = false)
    private Boolean active;

    private LocalDateTime effectiveFrom;
    private LocalDateTime effectiveTo;

    public RateCard() {}

    public RateCard(Long id, OrderType orderType, ZoneType zoneType, Double minWeight, Double maxWeight, BigDecimal baseCharge, BigDecimal perKgCharge, Boolean active, LocalDateTime effectiveFrom, LocalDateTime effectiveTo) {
        this.id = id;
        this.orderType = orderType;
        this.zoneType = zoneType;
        this.minWeight = minWeight;
        this.maxWeight = maxWeight;
        this.baseCharge = baseCharge;
        this.perKgCharge = perKgCharge;
        this.active = active;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
    }

    @PrePersist
    protected void onCreate() {
        if (active == null) active = true;
        if (effectiveFrom == null) effectiveFrom = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OrderType getOrderType() { return orderType; }
    public void setOrderType(OrderType orderType) { this.orderType = orderType; }

    public ZoneType getZoneType() { return zoneType; }
    public void setZoneType(ZoneType zoneType) { this.zoneType = zoneType; }

    public Double getMinWeight() { return minWeight; }
    public void setMinWeight(Double minWeight) { this.minWeight = minWeight; }

    public Double getMaxWeight() { return maxWeight; }
    public void setMaxWeight(Double maxWeight) { this.maxWeight = maxWeight; }

    public BigDecimal getBaseCharge() { return baseCharge; }
    public void setBaseCharge(BigDecimal baseCharge) { this.baseCharge = baseCharge; }

    public BigDecimal getPerKgCharge() { return perKgCharge; }
    public void setPerKgCharge(BigDecimal perKgCharge) { this.perKgCharge = perKgCharge; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDateTime effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDateTime getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDateTime effectiveTo) { this.effectiveTo = effectiveTo; }

    public static RateCardBuilder builder() { return new RateCardBuilder(); }

    public static class RateCardBuilder {
        private Long id;
        private OrderType orderType;
        private ZoneType zoneType;
        private Double minWeight;
        private Double maxWeight;
        private BigDecimal baseCharge;
        private BigDecimal perKgCharge;
        private Boolean active;
        private LocalDateTime effectiveFrom;
        private LocalDateTime effectiveTo;

        public RateCardBuilder id(Long id) { this.id = id; return this; }
        public RateCardBuilder orderType(OrderType orderType) { this.orderType = orderType; return this; }
        public RateCardBuilder zoneType(ZoneType zoneType) { this.zoneType = zoneType; return this; }
        public RateCardBuilder minWeight(Double minWeight) { this.minWeight = minWeight; return this; }
        public RateCardBuilder maxWeight(Double maxWeight) { this.maxWeight = maxWeight; return this; }
        public RateCardBuilder baseCharge(BigDecimal baseCharge) { this.baseCharge = baseCharge; return this; }
        public RateCardBuilder perKgCharge(BigDecimal perKgCharge) { this.perKgCharge = perKgCharge; return this; }
        public RateCardBuilder active(Boolean active) { this.active = active; return this; }
        public RateCardBuilder effectiveFrom(LocalDateTime effectiveFrom) { this.effectiveFrom = effectiveFrom; return this; }
        public RateCardBuilder effectiveTo(LocalDateTime effectiveTo) { this.effectiveTo = effectiveTo; return this; }

        public RateCard build() {
            return new RateCard(id, orderType, zoneType, minWeight, maxWeight, baseCharge, perKgCharge, active, effectiveFrom, effectiveTo);
        }
    }
}
