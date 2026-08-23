package com.deliverytracker.pricing;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cod_surcharges")
public class CodSurcharge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private OrderType orderType;

    @Column(nullable = false)
    private String surchargeType;

    @Column(nullable = false)
    private BigDecimal surchargeValue;

    @Column(nullable = false)
    private Boolean active;

    public CodSurcharge() {}

    public CodSurcharge(Long id, OrderType orderType, String surchargeType, BigDecimal surchargeValue, Boolean active) {
        this.id = id;
        this.orderType = orderType;
        this.surchargeType = surchargeType;
        this.surchargeValue = surchargeValue;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OrderType getOrderType() { return orderType; }
    public void setOrderType(OrderType orderType) { this.orderType = orderType; }

    public String getSurchargeType() { return surchargeType; }
    public void setSurchargeType(String surchargeType) { this.surchargeType = surchargeType; }

    public BigDecimal getSurchargeValue() { return surchargeValue; }
    public void setSurchargeValue(BigDecimal surchargeValue) { this.surchargeValue = surchargeValue; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public static CodSurchargeBuilder builder() { return new CodSurchargeBuilder(); }

    public static class CodSurchargeBuilder {
        private Long id;
        private OrderType orderType;
        private String surchargeType;
        private BigDecimal surchargeValue;
        private Boolean active;

        public CodSurchargeBuilder id(Long id) { this.id = id; return this; }
        public CodSurchargeBuilder orderType(OrderType orderType) { this.orderType = orderType; return this; }
        public CodSurchargeBuilder surchargeType(String surchargeType) { this.surchargeType = surchargeType; return this; }
        public CodSurchargeBuilder surchargeValue(BigDecimal surchargeValue) { this.surchargeValue = surchargeValue; return this; }
        public CodSurchargeBuilder active(Boolean active) { this.active = active; return this; }

        public CodSurcharge build() {
            return new CodSurcharge(id, orderType, surchargeType, surchargeValue, active);
        }
    }
}
