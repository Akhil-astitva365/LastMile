package com.deliverytracker.assignment;

import com.deliverytracker.agent.AgentRepository;
import com.deliverytracker.agent.AvailabilityStatus;
import com.deliverytracker.agent.DeliveryAgent;
import com.deliverytracker.order.Order;
import com.deliverytracker.order.OrderStatus;
import com.deliverytracker.order.OrderRepository;
import com.deliverytracker.tracking.ActorRole;
import com.deliverytracker.tracking.TrackingService;
import com.deliverytracker.zone.Zone;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AgentRepository agentRepository;
    private final AssignmentRepository assignmentRepository;
    private final OrderRepository orderRepository;
    private final TrackingService trackingService;

    public AssignmentService(AgentRepository agentRepository, AssignmentRepository assignmentRepository, OrderRepository orderRepository, TrackingService trackingService) {
        this.agentRepository = agentRepository;
        this.assignmentRepository = assignmentRepository;
        this.orderRepository = orderRepository;
        this.trackingService = trackingService;
    }

    @Transactional
    public Optional<DeliveryAgent> autoAssignAgent(Order order) {
        Zone pickupZone = order.getPickupZone();
        if (pickupZone == null) {
            return Optional.empty();
        }

        List<DeliveryAgent> availableAgents = agentRepository.findByZoneAndAvailabilityStatus(pickupZone, AvailabilityStatus.AVAILABLE);

        if (availableAgents.isEmpty()) {
            return Optional.empty();
        }

        // Find closest agent based on Haversine distance formula
        DeliveryAgent closestAgent = availableAgents.stream()
                .min(Comparator.comparingDouble(agent ->
                        haversineDistance(
                                agent.getLatitude() != null ? agent.getLatitude() : 0.0,
                                agent.getLongitude() != null ? agent.getLongitude() : 0.0,
                                order.getPickupLatitude() != null ? order.getPickupLatitude() : 0.0,
                                order.getPickupLongitude() != null ? order.getPickupLongitude() : 0.0
                        )
                ))
                .orElse(availableAgents.get(0));

        // Create assignment record
        AgentAssignment assignment = AgentAssignment.builder()
                .order(order)
                .agent(closestAgent)
                .assignmentType(AssignmentType.AUTO)
                .status(AssignmentStatus.ACTIVE)
                .build();

        assignmentRepository.save(assignment);

        // Update order status to DISPATCHED
        order.setStatus(OrderStatus.DISPATCHED);
        orderRepository.save(order);

        // Log tracking event
        trackingService.logEvent(
                order.getId(),
                OrderStatus.CREATED,
                OrderStatus.DISPATCHED,
                closestAgent.getUser().getId(),
                ActorRole.SYSTEM,
                closestAgent.getLatitude(),
                closestAgent.getLongitude(),
                "Auto-assigned to nearest delivery agent: " + closestAgent.getUser().getName() + " (" + closestAgent.getEmployeeCode() + ")"
        );

        return Optional.of(closestAgent);
    }

    public double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
