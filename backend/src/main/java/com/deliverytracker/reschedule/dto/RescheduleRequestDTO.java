package com.deliverytracker.reschedule.dto;

import com.deliverytracker.reschedule.RescheduleReason;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class RescheduleRequestDTO {
    @NotNull(message = "New delivery date is required")
    private LocalDate newDeliveryDate;

    private RescheduleReason reason;
    private String notes;

    public RescheduleRequestDTO() {}

    public RescheduleRequestDTO(LocalDate newDeliveryDate, RescheduleReason reason, String notes) {
        this.newDeliveryDate = newDeliveryDate;
        this.reason = reason;
        this.notes = notes;
    }

    public LocalDate getNewDeliveryDate() { return newDeliveryDate; }
    public void setNewDeliveryDate(LocalDate newDeliveryDate) { this.newDeliveryDate = newDeliveryDate; }

    public RescheduleReason getReason() { return reason; }
    public void setReason(RescheduleReason reason) { this.reason = reason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
