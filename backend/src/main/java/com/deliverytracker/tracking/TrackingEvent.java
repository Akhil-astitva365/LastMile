package com.deliverytracker.tracking;

import com.deliverytracker.order.OrderStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracking_events")
public class TrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    private OrderStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus newStatus;

    private Long actorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActorRole actorRole;

    private Double latitude;
    private Double longitude;
    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public TrackingEvent() {}

    public TrackingEvent(Long id, Long orderId, OrderStatus previousStatus, OrderStatus newStatus, Long actorId, ActorRole actorRole, Double latitude, Double longitude, String remarks, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.actorId = actorId;
        this.actorRole = actorRole;
        this.latitude = latitude;
        this.longitude = longitude;
        this.remarks = remarks;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public OrderStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(OrderStatus previousStatus) { this.previousStatus = previousStatus; }

    public OrderStatus getNewStatus() { return newStatus; }
    public void setNewStatus(OrderStatus newStatus) { this.newStatus = newStatus; }

    public Long getActorId() { return actorId; }
    public void setActorId(Long actorId) { this.actorId = actorId; }

    public ActorRole getActorRole() { return actorRole; }
    public void setActorRole(ActorRole actorRole) { this.actorRole = actorRole; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static TrackingEventBuilder builder() { return new TrackingEventBuilder(); }

    public static class TrackingEventBuilder {
        private Long id;
        private Long orderId;
        private OrderStatus previousStatus;
        private OrderStatus newStatus;
        private Long actorId;
        private ActorRole actorRole;
        private Double latitude;
        private Double longitude;
        private String remarks;
        private LocalDateTime createdAt;

        public TrackingEventBuilder id(Long id) { this.id = id; return this; }
        public TrackingEventBuilder orderId(Long orderId) { this.orderId = orderId; return this; }
        public TrackingEventBuilder previousStatus(OrderStatus previousStatus) { this.previousStatus = previousStatus; return this; }
        public TrackingEventBuilder newStatus(OrderStatus newStatus) { this.newStatus = newStatus; return this; }
        public TrackingEventBuilder actorId(Long actorId) { this.actorId = actorId; return this; }
        public TrackingEventBuilder actorRole(ActorRole actorRole) { this.actorRole = actorRole; return this; }
        public TrackingEventBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public TrackingEventBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public TrackingEventBuilder remarks(String remarks) { this.remarks = remarks; return this; }
        public TrackingEventBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TrackingEvent build() {
            return new TrackingEvent(id, orderId, previousStatus, newStatus, actorId, actorRole, latitude, longitude, remarks, createdAt);
        }
    }
}
