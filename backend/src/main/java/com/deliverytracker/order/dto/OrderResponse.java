package com.deliverytracker.order.dto;

import com.deliverytracker.order.OrderStatus;
import com.deliverytracker.pricing.OrderType;
import com.deliverytracker.pricing.PaymentType;
import com.deliverytracker.zone.ZoneType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class OrderResponse {
    private Long id;
    private String orderNumber;

    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String pickupZoneCode;
    private String pickupZoneName;

    private String dropAddress;
    private Double dropLatitude;
    private Double dropLongitude;
    private String dropZoneCode;
    private String dropZoneName;

    private ZoneType zoneType;
    private OrderType orderType;
    private PaymentType paymentType;

    private Double length;
    private Double breadth;
    private Double height;
    private Double actualWeight;
    private Double volumetricWeight;
    private Double billableWeight;

    private BigDecimal baseCharge;
    private BigDecimal codSurcharge;
    private BigDecimal finalCharge;

    private OrderStatus status;
    private LocalDate deliveryDate;

    private Long assignedAgentId;
    private String assignedAgentName;
    private String assignedAgentPhone;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {}

    public OrderResponse(Long id, String orderNumber, Long customerId, String customerName, String customerEmail, String customerPhone, String pickupAddress, Double pickupLatitude, Double pickupLongitude, String pickupZoneCode, String pickupZoneName, String dropAddress, Double dropLatitude, Double dropLongitude, String dropZoneCode, String dropZoneName, ZoneType zoneType, OrderType orderType, PaymentType paymentType, Double length, Double breadth, Double height, Double actualWeight, Double volumetricWeight, Double billableWeight, BigDecimal baseCharge, BigDecimal codSurcharge, BigDecimal finalCharge, OrderStatus status, LocalDate deliveryDate, Long assignedAgentId, String assignedAgentName, String assignedAgentPhone, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.pickupAddress = pickupAddress;
        this.pickupLatitude = pickupLatitude;
        this.pickupLongitude = pickupLongitude;
        this.pickupZoneCode = pickupZoneCode;
        this.pickupZoneName = pickupZoneName;
        this.dropAddress = dropAddress;
        this.dropLatitude = dropLatitude;
        this.dropLongitude = dropLongitude;
        this.dropZoneCode = dropZoneCode;
        this.dropZoneName = dropZoneName;
        this.zoneType = zoneType;
        this.orderType = orderType;
        this.paymentType = paymentType;
        this.length = length;
        this.breadth = breadth;
        this.height = height;
        this.actualWeight = actualWeight;
        this.volumetricWeight = volumetricWeight;
        this.billableWeight = billableWeight;
        this.baseCharge = baseCharge;
        this.codSurcharge = codSurcharge;
        this.finalCharge = finalCharge;
        this.status = status;
        this.deliveryDate = deliveryDate;
        this.assignedAgentId = assignedAgentId;
        this.assignedAgentName = assignedAgentName;
        this.assignedAgentPhone = assignedAgentPhone;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public Double getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; }

    public Double getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; }

    public String getPickupZoneCode() { return pickupZoneCode; }
    public void setPickupZoneCode(String pickupZoneCode) { this.pickupZoneCode = pickupZoneCode; }

    public String getPickupZoneName() { return pickupZoneName; }
    public void setPickupZoneName(String pickupZoneName) { this.pickupZoneName = pickupZoneName; }

    public String getDropAddress() { return dropAddress; }
    public void setDropAddress(String dropAddress) { this.dropAddress = dropAddress; }

    public Double getDropLatitude() { return dropLatitude; }
    public void setDropLatitude(Double dropLatitude) { this.dropLatitude = dropLatitude; }

    public Double getDropLongitude() { return dropLongitude; }
    public void setDropLongitude(Double dropLongitude) { this.dropLongitude = dropLongitude; }

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

    public Double getLength() { return length; }
    public void setLength(Double length) { this.length = length; }

    public Double getBreadth() { return breadth; }
    public void setBreadth(Double breadth) { this.breadth = breadth; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double actualWeight) { this.actualWeight = actualWeight; }

    public Double getVolumetricWeight() { return volumetricWeight; }
    public void setVolumetricWeight(Double volumetricWeight) { this.volumetricWeight = volumetricWeight; }

    public Double getBillableWeight() { return billableWeight; }
    public void setBillableWeight(Double billableWeight) { this.billableWeight = billableWeight; }

    public BigDecimal getBaseCharge() { return baseCharge; }
    public void setBaseCharge(BigDecimal baseCharge) { this.baseCharge = baseCharge; }

    public BigDecimal getCodSurcharge() { return codSurcharge; }
    public void setCodSurcharge(BigDecimal codSurcharge) { this.codSurcharge = codSurcharge; }

    public BigDecimal getFinalCharge() { return finalCharge; }
    public void setFinalCharge(BigDecimal finalCharge) { this.finalCharge = finalCharge; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public Long getAssignedAgentId() { return assignedAgentId; }
    public void setAssignedAgentId(Long assignedAgentId) { this.assignedAgentId = assignedAgentId; }

    public String getAssignedAgentName() { return assignedAgentName; }
    public void setAssignedAgentName(String assignedAgentName) { this.assignedAgentName = assignedAgentName; }

    public String getAssignedAgentPhone() { return assignedAgentPhone; }
    public void setAssignedAgentPhone(String assignedAgentPhone) { this.assignedAgentPhone = assignedAgentPhone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static OrderResponseBuilder builder() { return new OrderResponseBuilder(); }

    public static class OrderResponseBuilder {
        private Long id;
        private String orderNumber;
        private Long customerId;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String pickupAddress;
        private Double pickupLatitude;
        private Double pickupLongitude;
        private String pickupZoneCode;
        private String pickupZoneName;
        private String dropAddress;
        private Double dropLatitude;
        private Double dropLongitude;
        private String dropZoneCode;
        private String dropZoneName;
        private ZoneType zoneType;
        private OrderType orderType;
        private PaymentType paymentType;
        private Double length;
        private Double breadth;
        private Double height;
        private Double actualWeight;
        private Double volumetricWeight;
        private Double billableWeight;
        private BigDecimal baseCharge;
        private BigDecimal codSurcharge;
        private BigDecimal finalCharge;
        private OrderStatus status;
        private LocalDate deliveryDate;
        private Long assignedAgentId;
        private String assignedAgentName;
        private String assignedAgentPhone;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public OrderResponseBuilder id(Long id) { this.id = id; return this; }
        public OrderResponseBuilder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
        public OrderResponseBuilder customerId(Long customerId) { this.customerId = customerId; return this; }
        public OrderResponseBuilder customerName(String customerName) { this.customerName = customerName; return this; }
        public OrderResponseBuilder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public OrderResponseBuilder customerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public OrderResponseBuilder pickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; return this; }
        public OrderResponseBuilder pickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; return this; }
        public OrderResponseBuilder pickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; return this; }
        public OrderResponseBuilder pickupZoneCode(String pickupZoneCode) { this.pickupZoneCode = pickupZoneCode; return this; }
        public OrderResponseBuilder pickupZoneName(String pickupZoneName) { this.pickupZoneName = pickupZoneName; return this; }
        public OrderResponseBuilder dropAddress(String dropAddress) { this.dropAddress = dropAddress; return this; }
        public OrderResponseBuilder dropLatitude(Double dropLatitude) { this.dropLatitude = dropLatitude; return this; }
        public OrderResponseBuilder dropLongitude(Double dropLongitude) { this.dropLongitude = dropLongitude; return this; }
        public OrderResponseBuilder dropZoneCode(String dropZoneCode) { this.dropZoneCode = dropZoneCode; return this; }
        public OrderResponseBuilder dropZoneName(String dropZoneName) { this.dropZoneName = dropZoneName; return this; }
        public OrderResponseBuilder zoneType(ZoneType zoneType) { this.zoneType = zoneType; return this; }
        public OrderResponseBuilder orderType(OrderType orderType) { this.orderType = orderType; return this; }
        public OrderResponseBuilder paymentType(PaymentType paymentType) { this.paymentType = paymentType; return this; }
        public OrderResponseBuilder length(Double length) { this.length = length; return this; }
        public OrderResponseBuilder breadth(Double breadth) { this.breadth = breadth; return this; }
        public OrderResponseBuilder height(Double height) { this.height = height; return this; }
        public OrderResponseBuilder actualWeight(Double actualWeight) { this.actualWeight = actualWeight; return this; }
        public OrderResponseBuilder volumetricWeight(Double volumetricWeight) { this.volumetricWeight = volumetricWeight; return this; }
        public OrderResponseBuilder billableWeight(Double billableWeight) { this.billableWeight = billableWeight; return this; }
        public OrderResponseBuilder baseCharge(BigDecimal baseCharge) { this.baseCharge = baseCharge; return this; }
        public OrderResponseBuilder codSurcharge(BigDecimal codSurcharge) { this.codSurcharge = codSurcharge; return this; }
        public OrderResponseBuilder finalCharge(BigDecimal finalCharge) { this.finalCharge = finalCharge; return this; }
        public OrderResponseBuilder status(OrderStatus status) { this.status = status; return this; }
        public OrderResponseBuilder deliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; return this; }
        public OrderResponseBuilder assignedAgentId(Long assignedAgentId) { this.assignedAgentId = assignedAgentId; return this; }
        public OrderResponseBuilder assignedAgentName(String assignedAgentName) { this.assignedAgentName = assignedAgentName; return this; }
        public OrderResponseBuilder assignedAgentPhone(String assignedAgentPhone) { this.assignedAgentPhone = assignedAgentPhone; return this; }
        public OrderResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public OrderResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public OrderResponse build() {
            return new OrderResponse(id, orderNumber, customerId, customerName, customerEmail, customerPhone, pickupAddress, pickupLatitude, pickupLongitude, pickupZoneCode, pickupZoneName, dropAddress, dropLatitude, dropLongitude, dropZoneCode, dropZoneName, zoneType, orderType, paymentType, length, breadth, height, actualWeight, volumetricWeight, billableWeight, baseCharge, codSurcharge, finalCharge, status, deliveryDate, assignedAgentId, assignedAgentName, assignedAgentPhone, createdAt, updatedAt);
        }
    }
}
