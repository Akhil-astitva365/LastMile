package com.deliverytracker.admin;

import com.deliverytracker.agent.AgentRepository;
import com.deliverytracker.agent.DeliveryAgent;
import com.deliverytracker.customer.CustomerProfile;
import com.deliverytracker.customer.CustomerRepository;
import com.deliverytracker.order.Order;
import com.deliverytracker.order.OrderRepository;
import com.deliverytracker.order.OrderService;
import com.deliverytracker.order.dto.OrderResponse;
import com.deliverytracker.user.User;
import com.deliverytracker.user.UserRepository;
import com.deliverytracker.zone.Zone;
import com.deliverytracker.zone.ZoneRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;
    private final OrderRepository orderRepository;
    private final ZoneRepository zoneRepository;
    private final OrderService orderService;

    public AdminController(UserRepository userRepository, CustomerRepository customerRepository, AgentRepository agentRepository, OrderRepository orderRepository, ZoneRepository zoneRepository, OrderService orderService) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.agentRepository = agentRepository;
        this.orderRepository = orderRepository;
        this.zoneRepository = zoneRepository;
        this.orderService = orderService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerProfile>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    @GetMapping("/agents")
    public ResponseEntity<List<DeliveryAgent>> getAllAgents() {
        return ResponseEntity.ok(agentRepository.findAll());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> responses = orders.stream()
                .map(orderService::mapToResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/zones")
    public ResponseEntity<List<Zone>> getAllZones() {
        return ResponseEntity.ok(zoneRepository.findAll());
    }

    @PostMapping("/orders/{orderId}/manual-assign")
    public ResponseEntity<OrderResponse> manualAssignAgent(
            @PathVariable Long orderId,
            @RequestBody Map<String, Long> payload
    ) {
        Long agentId = payload.get("agentId");
        if (agentId == null) {
            throw new IllegalArgumentException("agentId is required");
        }
        return ResponseEntity.ok(orderService.manualAssignAgent(orderId, agentId));
    }
}
