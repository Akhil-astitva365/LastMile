package com.deliverytracker.order;

import com.deliverytracker.customer.CustomerProfile;
import com.deliverytracker.pricing.OrderType;
import com.deliverytracker.pricing.PaymentType;
import com.deliverytracker.zone.Zone;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerProfile customer;

    @Column(nullable = false)
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pickup_zone_id")
    private Zone pickupZone;

    @Column(nullable = false)
    private String dropAddress;
    private Double dropLatitude;
    private Double dropLongitude;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drop_zone_id")
    private Zone dropZone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType paymentType;

    @Column(nullable = false)
    private Double length;
    @Column(nullable = false)
    private Double breadth;
    @Column(nullable = false)
    private Double height;

    @Column(nullable = false)
    private Double actualWeight;
    @Column(nullable = false)
    private Double volumetricWeight;
    @Column(nullable = false)
    private Double billableWeight;

    @Column(nullable = false)
    private BigDecimal baseCharge;
    @Column(nullable = false)
    private BigDecimal codSurcharge;
    @Column(nullable = false)
    private BigDecimal finalCharge;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    private LocalDate deliveryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Order() {}

    public Order(Long id, String orderNumber, CustomerProfile customer, String pickupAddress, Double pickupLatitude, Double pickupLongitude, Zone pickupZone, String dropAddress, Double dropLatitude, Double dropLongitude, Zone dropZone, OrderType orderType, PaymentType paymentType, Double length, Double breadth, Double height, Double actualWeight, Double volumetricWeight, Double billableWeight, BigDecimal baseCharge, BigDecimal codSurcharge, BigDecimal finalCharge, OrderStatus status, LocalDate deliveryDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.customer = customer;
        this.pickupAddress = pickupAddress;
        this.pickupLatitude = pickupLatitude;
        this.pickupLongitude = pickupLongitude;
        this.pickupZone = pickupZone;
        this.dropAddress = dropAddress;
        this.dropLatitude = dropLatitude;
        this.dropLongitude = dropLongitude;
        this.dropZone = dropZone;
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
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = OrderStatus.CREATED;
        if (deliveryDate == null) deliveryDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public CustomerProfile getCustomer() { return customer; }
    public void setCustomer(CustomerProfile customer) { this.customer = customer; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public Double getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; }

    public Double getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; }

    public Zone getPickupZone() { return pickupZone; }
    public void setPickupZone(Zone pickupZone) { this.pickupZone = pickupZone; }

    public String getDropAddress() { return dropAddress; }
    public void setDropAddress(String dropAddress) { this.dropAddress = dropAddress; }

    public Double getDropLatitude() { return dropLatitude; }
    public void setDropLatitude(Double dropLatitude) { this.dropLatitude = dropLatitude; }

    public Double getDropLongitude() { return dropLongitude; }
    public void setDropLongitude(Double dropLongitude) { this.dropLongitude = dropLongitude; }

    public Zone getDropZone() { return dropZone; }
    public void setDropZone(Zone dropZone) { this.dropZone = dropZone; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static OrderBuilder builder() { return new OrderBuilder(); }

    public static class OrderBuilder {
        private Long id;
        private String orderNumber;
        private CustomerProfile customer;
        private String pickupAddress;
        private Double pickupLatitude;
        private Double pickupLongitude;
        private Zone pickupZone;
        private String dropAddress;
        private Double dropLatitude;
        private Double dropLongitude;
        private Zone dropZone;
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
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public OrderBuilder id(Long id) { this.id = id; return this; }
        public OrderBuilder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
        public OrderBuilder customer(CustomerProfile customer) { this.customer = customer; return this; }
        public OrderBuilder pickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; return this; }
        public OrderBuilder pickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; return this; }
        public OrderBuilder pickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; return this; }
        public OrderBuilder pickupZone(Zone pickupZone) { this.pickupZone = pickupZone; return this; }
        public OrderBuilder dropAddress(String dropAddress) { this.dropAddress = dropAddress; return this; }
        public OrderBuilder dropLatitude(Double dropLatitude) { this.dropLatitude = dropLatitude; return this; }
        public OrderBuilder dropLongitude(Double dropLongitude) { this.dropLongitude = dropLongitude; return this; }
        public OrderBuilder dropZone(Zone dropZone) { this.dropZone = dropZone; return this; }
        public OrderBuilder orderType(OrderType orderType) { this.orderType = orderType; return this; }
        public OrderBuilder paymentType(PaymentType paymentType) { this.paymentType = paymentType; return this; }
        public OrderBuilder length(Double length) { this.length = length; return this; }
        public OrderBuilder breadth(Double breadth) { this.breadth = breadth; return this; }
        public OrderBuilder height(Double height) { this.height = height; return this; }
        public OrderBuilder actualWeight(Double actualWeight) { this.actualWeight = actualWeight; return this; }
        public OrderBuilder volumetricWeight(Double volumetricWeight) { this.volumetricWeight = volumetricWeight; return this; }
        public OrderBuilder billableWeight(Double billableWeight) { this.billableWeight = billableWeight; return this; }
        public OrderBuilder baseCharge(BigDecimal baseCharge) { this.baseCharge = baseCharge; return this; }
        public OrderBuilder codSurcharge(BigDecimal codSurcharge) { this.codSurcharge = codSurcharge; return this; }
        public OrderBuilder finalCharge(BigDecimal finalCharge) { this.finalCharge = finalCharge; return this; }
        public OrderBuilder status(OrderStatus status) { this.status = status; return this; }
        public OrderBuilder deliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; return this; }
        public OrderBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public OrderBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Order build() {
            return new Order(id, orderNumber, customer, pickupAddress, pickupLatitude, pickupLongitude, pickupZone, dropAddress, dropLatitude, dropLongitude, dropZone, orderType, paymentType, length, breadth, height, actualWeight, volumetricWeight, billableWeight, baseCharge, codSurcharge, finalCharge, status, deliveryDate, createdAt, updatedAt);
        }
    }
}
