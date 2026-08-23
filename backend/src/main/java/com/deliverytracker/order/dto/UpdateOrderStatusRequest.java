package com.deliverytracker.order.dto;

import com.deliverytracker.order.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateOrderStatusRequest {
    @NotNull(message = "Status is required")
    private OrderStatus status;

    private Double latitude;
    private Double longitude;
    private String remarks;

    public UpdateOrderStatusRequest() {}

    public UpdateOrderStatusRequest(OrderStatus status, Double latitude, Double longitude, String remarks) {
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.remarks = remarks;
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
