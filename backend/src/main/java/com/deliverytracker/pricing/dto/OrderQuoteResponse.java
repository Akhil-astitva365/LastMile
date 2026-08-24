package com.deliverytracker.pricing.dto;

import com.deliverytracker.pricing.OrderType;
import com.deliverytracker.pricing.PaymentType;
import com.deliverytracker.zone.ZoneType;

import java.math.BigDecimal;

public class OrderQuoteResponse {
    private Double actualWeight;
    private Double volumetricWeight;
    private Double billableWeight;
    private Double distanceKm;

    private String pickupZoneCode;
    private String pickupZoneName;
    private String dropZoneCode;
    private String dropZoneName;
    private ZoneType zoneType;

    private OrderType orderType;
    private PaymentType paymentType;

    private BigDecimal baseCharge;
    private BigDecimal codSurcharge;
    private BigDecimal finalCharge;

    public OrderQuoteResponse() {}

    public OrderQuoteResponse(Double actualWeight, Double volumetricWeight, Double billableWeight, Double distanceKm, String pickupZoneCode, String pickupZoneName, String dropZoneCode, String dropZoneName, ZoneType zoneType, OrderType orderType, PaymentType paymentType, BigDecimal baseCharge, BigDecimal codSurcharge, BigDecimal finalCharge) {
        this.actualWeight = actualWeight;
        this.volumetricWeight = volumetricWeight;
        this.billableWeight = billableWeight;
        this.distanceKm = distanceKm;
        this.pickupZoneCode = pickupZoneCode;
        this.pickupZoneName = pickupZoneName;
        this.dropZoneCode = dropZoneCode;
        this.dropZoneName = dropZoneName;
        this.zoneType = zoneType;
        this.orderType = orderType;
        this.paymentType = paymentType;
        this.baseCharge = baseCharge;
        this.codSurcharge = codSurcharge;
        this.finalCharge = finalCharge;
    }

    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double actualWeight) { this.actualWeight = actualWeight; }

    public Double getVolumetricWeight() { return volumetricWeight; }
    public void setVolumetricWeight(Double volumetricWeight) { this.volumetricWeight = volumetricWeight; }

    public Double getBillableWeight() { return billableWeight; }
    public void setBillableWeight(Double billableWeight) { this.billableWeight = billableWeight; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public String getPickupZoneCode() { return pickupZoneCode; }
    public void setPickupZoneCode(String pickupZoneCode) { this.pickupZoneCode = pickupZoneCode; }

    public String getPickupZoneName() { return pickupZoneName; }
    public void setPickupZoneName(String pickupZoneName) { this.pickupZoneName = pickupZoneName; }

    public String getDropZoneCode() { return dropZoneCode; }
    public void setDropZoneCode(String dropZoneCode) { this.dropZoneCode = dropZoneCode; }

    public String getDropZoneName() { return dropZoneName; }
    public void setDropZoneName(String dropZoneName) { this.dropZoneName = dropZoneName; }

    public ZoneType getZoneType() { return zoneType; }
    public void setZoneType(ZoneType zoneType) { this.zoneType = zoneType; }

    public OrderType getOrderType() { return orderType; }
    public void setOrderType(OrderType orderType) { this.orderType = orderType; }

    public PaymentType getPaymentType() { return paymentType; }
    public void setPaymentType(PaymentType paymentType) { this.paymentType = paymentType; }

    public BigDecimal getBaseCharge() { return baseCharge; }
    public void setBaseCharge(BigDecimal baseCharge) { this.baseCharge = baseCharge; }

    public BigDecimal getCodSurcharge() { return codSurcharge; }
    public void setCodSurcharge(BigDecimal codSurcharge) { this.codSurcharge = codSurcharge; }

    public BigDecimal getFinalCharge() { return finalCharge; }
    public void setFinalCharge(BigDecimal finalCharge) { this.finalCharge = finalCharge; }

    public static OrderQuoteResponseBuilder builder() { return new OrderQuoteResponseBuilder(); }

    public static class OrderQuoteResponseBuilder {
        private Double actualWeight;
        private Double volumetricWeight;
        private Double billableWeight;
        private Double distanceKm;
        private String pickupZoneCode;
        private String pickupZoneName;
        private String dropZoneCode;
        private String dropZoneName;
        private ZoneType zoneType;
        private OrderType orderType;
        private PaymentType paymentType;
        private BigDecimal baseCharge;
        private BigDecimal codSurcharge;
        private BigDecimal finalCharge;

        public OrderQuoteResponseBuilder actualWeight(Double actualWeight) { this.actualWeight = actualWeight; return this; }
        public OrderQuoteResponseBuilder volumetricWeight(Double volumetricWeight) { this.volumetricWeight = volumetricWeight; return this; }
        public OrderQuoteResponseBuilder billableWeight(Double billableWeight) { this.billableWeight = billableWeight; return this; }
        public OrderQuoteResponseBuilder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public OrderQuoteResponseBuilder pickupZoneCode(String pickupZoneCode) { this.pickupZoneCode = pickupZoneCode; return this; }
        public OrderQuoteResponseBuilder pickupZoneName(String pickupZoneName) { this.pickupZoneName = pickupZoneName; return this; }
        public OrderQuoteResponseBuilder dropZoneCode(String dropZoneCode) { this.dropZoneCode = dropZoneCode; return this; }
        public OrderQuoteResponseBuilder dropZoneName(String dropZoneName) { this.dropZoneName = dropZoneName; return this; }
        public OrderQuoteResponseBuilder zoneType(ZoneType zoneType) { this.zoneType = zoneType; return this; }
        public OrderQuoteResponseBuilder orderType(OrderType orderType) { this.orderType = orderType; return this; }
        public OrderQuoteResponseBuilder paymentType(PaymentType paymentType) { this.paymentType = paymentType; return this; }
        public OrderQuoteResponseBuilder baseCharge(BigDecimal baseCharge) { this.baseCharge = baseCharge; return this; }
        public OrderQuoteResponseBuilder codSurcharge(BigDecimal codSurcharge) { this.codSurcharge = codSurcharge; return this; }
        public OrderQuoteResponseBuilder finalCharge(BigDecimal finalCharge) { this.finalCharge = finalCharge; return this; }

        public OrderQuoteResponse build() {
            return new OrderQuoteResponse(actualWeight, volumetricWeight, billableWeight, distanceKm, pickupZoneCode, pickupZoneName, dropZoneCode, dropZoneName, zoneType, orderType, paymentType, baseCharge, codSurcharge, finalCharge);
        }
    }
}
