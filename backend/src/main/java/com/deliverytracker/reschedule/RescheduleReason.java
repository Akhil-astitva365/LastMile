package com.deliverytracker.reschedule;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum RescheduleReason {
    CUSTOMER_UNAVAILABLE,
    WRONG_ADDRESS,
    ADDRESS_NOT_FOUND,
    CUSTOMER_REFUSED,
    DAMAGED_PACKAGE,
    WEATHER_ISSUE,
    VEHICLE_ISSUE,
    OTHER;

    @JsonCreator
    public static RescheduleReason fromString(String value) {
        if (value == null || value.isBlank()) {
            return OTHER;
        }
        String normalized = value.trim().toUpperCase().replace(" ", "_").replace("/", "_");
        for (RescheduleReason reason : RescheduleReason.values()) {
            if (reason.name().equalsIgnoreCase(normalized) || reason.name().equalsIgnoreCase(value.trim())) {
                return reason;
            }
        }
        if (normalized.contains("ADDRESS") || normalized.contains("INCORRECT") || normalized.contains("WRONG")) {
            return WRONG_ADDRESS;
        }
        if (normalized.contains("UNAVAILABLE") || normalized.contains("DELAY") || normalized.contains("CUSTOMER")) {
            return CUSTOMER_UNAVAILABLE;
        }
        if (normalized.contains("WEATHER")) {
            return WEATHER_ISSUE;
        }
        return OTHER;
    }
}
