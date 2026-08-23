package com.deliverytracker.notification;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private Long customerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationChannel channel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationEventType eventType;

    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    private LocalDateTime sentAt;
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(Long id, Long orderId, Long customerId, NotificationChannel channel, NotificationEventType eventType, String recipient, String message, NotificationStatus status, LocalDateTime sentAt, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.customerId = customerId;
        this.channel = channel;
        this.eventType = eventType;
        this.recipient = recipient;
        this.message = message;
        this.status = status;
        this.sentAt = sentAt;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = NotificationStatus.SENT;
        if (sentAt == null) sentAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public NotificationChannel getChannel() { return channel; }
    public void setChannel(NotificationChannel channel) { this.channel = channel; }

    public NotificationEventType getEventType() { return eventType; }
    public void setEventType(NotificationEventType eventType) { this.eventType = eventType; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationStatus getStatus() { return status; }
    public void setStatus(NotificationStatus status) { this.status = status; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationBuilder builder() { return new NotificationBuilder(); }

    public static class NotificationBuilder {
        private Long id;
        private Long orderId;
        private Long customerId;
        private NotificationChannel channel;
        private NotificationEventType eventType;
        private String recipient;
        private String message;
        private NotificationStatus status;
        private LocalDateTime sentAt;
        private LocalDateTime createdAt;

        public NotificationBuilder id(Long id) { this.id = id; return this; }
        public NotificationBuilder orderId(Long orderId) { this.orderId = orderId; return this; }
        public NotificationBuilder customerId(Long customerId) { this.customerId = customerId; return this; }
        public NotificationBuilder channel(NotificationChannel channel) { this.channel = channel; return this; }
        public NotificationBuilder eventType(NotificationEventType eventType) { this.eventType = eventType; return this; }
        public NotificationBuilder recipient(String recipient) { this.recipient = recipient; return this; }
        public NotificationBuilder message(String message) { this.message = message; return this; }
        public NotificationBuilder status(NotificationStatus status) { this.status = status; return this; }
        public NotificationBuilder sentAt(LocalDateTime sentAt) { this.sentAt = sentAt; return this; }
        public NotificationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Notification build() {
            return new Notification(id, orderId, customerId, channel, eventType, recipient, message, status, sentAt, createdAt);
        }
    }
}
