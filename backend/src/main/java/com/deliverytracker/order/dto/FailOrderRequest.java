package com.deliverytracker.order.dto;

import com.deliverytracker.reschedule.RescheduleReason;
import jakarta.validation.constraints.NotNull;

public class FailOrderRequest {
    @NotNull(message = "Failure reason is required")
    private RescheduleReason reason;

    private String remarks;
    private Double latitude;
    private Double longitude;

    public FailOrderRequest() {}

    public FailOrderRequest(RescheduleReason reason, String remarks, Double latitude, Double longitude) {
        this.reason = reason;
        this.remarks = remarks;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public RescheduleReason getReason() { return reason; }
    public void setReason(RescheduleReason reason) { this.reason = reason; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
