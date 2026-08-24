package com.deliverytracker.agent;

import com.deliverytracker.agent.dto.LocationUpdateRequest;
import com.deliverytracker.order.OrderService;
import com.deliverytracker.order.dto.OrderResponse;
import com.deliverytracker.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/agent")
@PreAuthorize("hasRole('DELIVERY_AGENT')")
public class AgentController {

    private final AgentRepository agentRepository;
    private final OrderService orderService;

    public AgentController(AgentRepository agentRepository, OrderService orderService) {
        this.agentRepository = agentRepository;
        this.orderService = orderService;
    }

    @GetMapping("/my-deliveries")
    public ResponseEntity<List<OrderResponse>> getMyDeliveries(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.getAgentAssignedOrders(currentUser));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAssignedOrdersAlias(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.getAgentAssignedOrders(currentUser));
    }

    @RequestMapping(value = "/location", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<DeliveryAgent> updateLocation(
            @AuthenticationPrincipal User currentUser,
            @RequestBody LocationUpdateRequest request
    ) {
        DeliveryAgent agent = agentRepository.findByUser(currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Agent profile not found"));

        if (request.getLatitude() != null) agent.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) agent.setLongitude(request.getLongitude());
        if (request.getAvailabilityStatus() != null) agent.setAvailabilityStatus(request.getAvailabilityStatus());

        return ResponseEntity.ok(agentRepository.save(agent));
    }
}
