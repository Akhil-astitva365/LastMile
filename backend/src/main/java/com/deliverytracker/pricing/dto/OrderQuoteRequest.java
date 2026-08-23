package com.deliverytracker.pricing.dto;

import com.deliverytracker.pricing.OrderType;
import com.deliverytracker.pricing.PaymentType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderQuoteRequest {
    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotBlank(message = "Drop address is required")
    private String dropAddress;

    @NotNull(message = "Length is required")
    @Min(value = 1, message = "Length must be greater than 0")
    private Double length;

    @NotNull(message = "Breadth is required")
    @Min(value = 1, message = "Breadth must be greater than 0")
    private Double breadth;

    @NotNull(message = "Height is required")
    @Min(value = 1, message = "Height must be greater than 0")
    private Double height;

    @NotNull(message = "Actual weight is required")
    @Min(value = 0, message = "Weight cannot be negative")
    private Double actualWeight;

    @NotNull(message = "Order type is required")
    private OrderType orderType;

    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;

    public OrderQuoteRequest() {}

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDropAddress() { return dropAddress; }
    public void setDropAddress(String dropAddress) { this.dropAddress = dropAddress; }

    public Double getLength() { return length; }
    public void setLength(Double length) { this.length = length; }

    public Double getBreadth() { return breadth; }
    public void setBreadth(Double breadth) { this.breadth = breadth; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getActualWeight() { return actualWeight; }
    public void setActualWeight(Double actualWeight) { this.actualWeight = actualWeight; }

    public OrderType getOrderType() { return orderType; }
    public void setOrderType(OrderType orderType) { this.orderType = orderType; }

    public PaymentType getPaymentType() { return paymentType; }
    public void setPaymentType(PaymentType paymentType) { this.paymentType = paymentType; }
}
