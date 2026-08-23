package com.deliverytracker.order;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderStatusTransitionTest {

    @Test
    void testValidStatusTransitions() {
        assertTrue(OrderStatus.CREATED.isValidTransition(OrderStatus.ASSIGNED));
        assertTrue(OrderStatus.ASSIGNED.isValidTransition(OrderStatus.PICKED_UP));
        assertTrue(OrderStatus.PICKED_UP.isValidTransition(OrderStatus.IN_TRANSIT));
        assertTrue(OrderStatus.IN_TRANSIT.isValidTransition(OrderStatus.OUT_FOR_DELIVERY));
        assertTrue(OrderStatus.OUT_FOR_DELIVERY.isValidTransition(OrderStatus.DELIVERED));
        assertTrue(OrderStatus.OUT_FOR_DELIVERY.isValidTransition(OrderStatus.FAILED));
        assertTrue(OrderStatus.FAILED.isValidTransition(OrderStatus.RESCHEDULED));
        assertTrue(OrderStatus.RESCHEDULED.isValidTransition(OrderStatus.ASSIGNED));
    }

    @Test
    void testInvalidStatusTransitions() {
        // DELIVERED is terminal, cannot transition back to PICKED_UP or ASSIGNED
        assertFalse(OrderStatus.DELIVERED.isValidTransition(OrderStatus.PICKED_UP));
        assertFalse(OrderStatus.DELIVERED.isValidTransition(OrderStatus.ASSIGNED));

        // Cannot jump directly from CREATED to DELIVERED
        assertFalse(OrderStatus.CREATED.isValidTransition(OrderStatus.DELIVERED));
    }
}
