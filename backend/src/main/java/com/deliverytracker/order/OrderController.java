package com.deliverytracker.order;

import com.deliverytracker.order.dto.CreateOrderRequest;
import com.deliverytracker.order.dto.FailOrderRequest;
import com.deliverytracker.order.dto.OrderResponse;
import com.deliverytracker.order.dto.UpdateOrderStatusRequest;
import com.deliverytracker.pricing.PricingEngine;
import com.deliverytracker.pricing.dto.OrderQuoteRequest;
import com.deliverytracker.pricing.dto.OrderQuoteResponse;
import com.deliverytracker.reschedule.dto.RescheduleRequestDTO;
import com.deliverytracker.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;
    private final PricingEngine pricingEngine;

    public OrderController(OrderService orderService, PricingEngine pricingEngine) {
        this.orderService = orderService;
        this.pricingEngine = pricingEngine;
    }

    @PostMapping("/quote")
    public ResponseEntity<OrderQuoteResponse> calculateQuote(@Valid @RequestBody OrderQuoteRequest request) {
        return ResponseEntity.ok(pricingEngine.calculateQuote(request));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(orderService.createOrder(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.getUserOrders(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(orderService.getOrderById(id, currentUser));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request, currentUser));
    }

    @PostMapping("/{id}/fail")
    public ResponseEntity<OrderResponse> markFailed(
            @PathVariable Long id,
            @Valid @RequestBody FailOrderRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(orderService.markOrderFailed(id, request, currentUser));
    }

    @PostMapping("/{id}/reschedule")
    public ResponseEntity<OrderResponse> requestReschedule(
            @PathVariable Long id,
            @Valid @RequestBody RescheduleRequestDTO request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(orderService.requestReschedule(id, request, currentUser));
    }
}
