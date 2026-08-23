package com.deliverytracker.order;

public enum OrderStatus {
    CREATED,
    ASSIGNED,
    DISPATCHED,
    PICKED_UP,
    IN_TRANSIT,
    OUT_FOR_DELIVERY,
    DELIVERED,
    FAILED,
    FAILED_DELIVERY,
    RESCHEDULED,
    RETURNED;

    public boolean canTransitionTo(OrderStatus nextStatus) {
        if (this == nextStatus) return true;
        return switch (this) {
            case CREATED -> nextStatus == ASSIGNED || nextStatus == DISPATCHED || nextStatus == FAILED || nextStatus == FAILED_DELIVERY;
            case ASSIGNED, DISPATCHED -> nextStatus == PICKED_UP || nextStatus == FAILED || nextStatus == FAILED_DELIVERY;
            case PICKED_UP -> nextStatus == IN_TRANSIT || nextStatus == FAILED || nextStatus == FAILED_DELIVERY;
            case IN_TRANSIT -> nextStatus == OUT_FOR_DELIVERY || nextStatus == FAILED || nextStatus == FAILED_DELIVERY;
            case OUT_FOR_DELIVERY -> nextStatus == DELIVERED || nextStatus == FAILED || nextStatus == FAILED_DELIVERY;
            case FAILED, FAILED_DELIVERY -> nextStatus == RESCHEDULED || nextStatus == RETURNED;
            case RESCHEDULED -> nextStatus == ASSIGNED || nextStatus == DISPATCHED || nextStatus == FAILED || nextStatus == FAILED_DELIVERY;
            case DELIVERED, RETURNED -> false;
        };
    }

    public boolean isValidTransition(OrderStatus nextStatus) {
        return canTransitionTo(nextStatus);
    }
}
