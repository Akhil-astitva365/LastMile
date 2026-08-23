package com.deliverytracker.reschedule;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reschedules")
public class Reschedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    private Long requestedBy;
    private LocalDate previousDate;

    @Column(nullable = false)
    private LocalDate newDate;

    @Enumerated(EnumType.STRING)
    private RescheduleReason reason;

    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RescheduleStatus status;

    private LocalDateTime createdAt;

    public Reschedule() {}

    public Reschedule(Long id, Long orderId, Long requestedBy, LocalDate previousDate, LocalDate newDate, RescheduleReason reason, String notes, RescheduleStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.requestedBy = requestedBy;
        this.previousDate = previousDate;
        this.newDate = newDate;
        this.reason = reason;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = RescheduleStatus.REQUESTED;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getRequestedBy() { return requestedBy; }
    public void setRequestedBy(Long requestedBy) { this.requestedBy = requestedBy; }

    public LocalDate getPreviousDate() { return previousDate; }
    public void setPreviousDate(LocalDate previousDate) { this.previousDate = previousDate; }

    public LocalDate getNewDate() { return newDate; }
    public void setNewDate(LocalDate newDate) { this.newDate = newDate; }

    public RescheduleReason getReason() { return reason; }
    public void setReason(RescheduleReason reason) { this.reason = reason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public RescheduleStatus getStatus() { return status; }
    public void setStatus(RescheduleStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static RescheduleBuilder builder() { return new RescheduleBuilder(); }

    public static class RescheduleBuilder {
        private Long id;
        private Long orderId;
        private Long requestedBy;
        private LocalDate previousDate;
        private LocalDate newDate;
        private RescheduleReason reason;
        private String notes;
        private RescheduleStatus status;
        private LocalDateTime createdAt;

        public RescheduleBuilder id(Long id) { this.id = id; return this; }
        public RescheduleBuilder orderId(Long orderId) { this.orderId = orderId; return this; }
        public RescheduleBuilder requestedBy(Long requestedBy) { this.requestedBy = requestedBy; return this; }
        public RescheduleBuilder previousDate(LocalDate previousDate) { this.previousDate = previousDate; return this; }
        public RescheduleBuilder newDate(LocalDate newDate) { this.newDate = newDate; return this; }
        public RescheduleBuilder reason(RescheduleReason reason) { this.reason = reason; return this; }
        public RescheduleBuilder notes(String notes) { this.notes = notes; return this; }
        public RescheduleBuilder status(RescheduleStatus status) { this.status = status; return this; }
        public RescheduleBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Reschedule build() {
            return new Reschedule(id, orderId, requestedBy, previousDate, newDate, reason, notes, status, createdAt);
        }
    }
}
