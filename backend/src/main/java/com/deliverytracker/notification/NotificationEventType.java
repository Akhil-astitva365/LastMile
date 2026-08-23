package com.deliverytracker.notification;

public enum NotificationEventType {
    ORDER_CREATED,
    AGENT_ASSIGNED,
    PICKED_UP,
    IN_TRANSIT,
    OUT_FOR_DELIVERY,
    DELIVERED,
    FAILED,
    FAILED_ATTEMPT,
    STATUS_UPDATE,
    RESCHEDULED
}
