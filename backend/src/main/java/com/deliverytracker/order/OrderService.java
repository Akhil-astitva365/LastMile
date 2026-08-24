package com.deliverytracker.order;

import com.deliverytracker.agent.AgentRepository;
import com.deliverytracker.agent.DeliveryAgent;
import com.deliverytracker.assignment.AssignmentStatus;
import com.deliverytracker.assignment.AgentAssignment;
import com.deliverytracker.assignment.AssignmentRepository;
import com.deliverytracker.assignment.AssignmentService;
import com.deliverytracker.assignment.AssignmentType;
import com.deliverytracker.customer.CustomerProfile;
import com.deliverytracker.customer.CustomerRepository;
import com.deliverytracker.notification.NotificationEventType;
import com.deliverytracker.notification.NotificationService;
import com.deliverytracker.order.dto.CreateOrderRequest;
import com.deliverytracker.order.dto.FailOrderRequest;
import com.deliverytracker.order.dto.OrderResponse;
import com.deliverytracker.order.dto.UpdateOrderStatusRequest;
import com.deliverytracker.pricing.PricingEngine;
import com.deliverytracker.pricing.dto.OrderQuoteRequest;
import com.deliverytracker.pricing.dto.OrderQuoteResponse;
import com.deliverytracker.reschedule.Reschedule;
import com.deliverytracker.reschedule.RescheduleRepository;
import com.deliverytracker.reschedule.RescheduleStatus;
import com.deliverytracker.reschedule.dto.RescheduleRequestDTO;
import com.deliverytracker.tracking.ActorRole;
import com.deliverytracker.tracking.TrackingService;
import com.deliverytracker.user.Role;
import com.deliverytracker.user.User;
import com.deliverytracker.user.UserRepository;
import com.deliverytracker.zone.GeocodingService;
import com.deliverytracker.zone.LocationCoordinates;
import com.deliverytracker.zone.Zone;
import com.deliverytracker.zone.ZoneDetectionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;
    private final AssignmentRepository assignmentRepository;
    private final RescheduleRepository rescheduleRepository;
    private final UserRepository userRepository;
    private final ZoneDetectionService zoneDetectionService;
    private final GeocodingService geocodingService;
    private final PricingEngine pricingEngine;
    private final AssignmentService assignmentService;
    private final TrackingService trackingService;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository, CustomerRepository customerRepository, AgentRepository agentRepository, AssignmentRepository assignmentRepository, RescheduleRepository rescheduleRepository, UserRepository userRepository, ZoneDetectionService zoneDetectionService, GeocodingService geocodingService, PricingEngine pricingEngine, AssignmentService assignmentService, TrackingService trackingService, NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.agentRepository = agentRepository;
        this.assignmentRepository = assignmentRepository;
        this.rescheduleRepository = rescheduleRepository;
        this.userRepository = userRepository;
        this.zoneDetectionService = zoneDetectionService;
        this.geocodingService = geocodingService;
        this.pricingEngine = pricingEngine;
        this.assignmentService = assignmentService;
        this.trackingService = trackingService;
        this.notificationService = notificationService;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, User currentUser) {
        CustomerProfile customerProfile;
        if (currentUser.getRole() == Role.ADMIN && request.getCustomerUserId() != null) {
            User custUser = userRepository.findById(request.getCustomerUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Customer user not found"));
            customerProfile = customerRepository.findByUser(custUser)
                    .orElseThrow(() -> new IllegalArgumentException("Customer profile not found"));
        } else {
            customerProfile = customerRepository.findByUser(currentUser)
                    .orElseThrow(() -> new IllegalArgumentException("Only registered customers can create orders"));
        }

        Zone pickupZone = zoneDetectionService.detectZoneByAddress(request.getPickupAddress());
        Zone dropZone = zoneDetectionService.detectZoneByAddress(request.getDropAddress());

        // Real PAN-India Location Geocoding Resolution
        LocationCoordinates pickupCoords = geocodingService.geocode(request.getPickupAddress());
        LocationCoordinates dropCoords = geocodingService.geocode(request.getDropAddress());

        OrderQuoteRequest quoteReq = new OrderQuoteRequest();
        quoteReq.setPickupAddress(request.getPickupAddress());
        quoteReq.setDropAddress(request.getDropAddress());
        quoteReq.setLength(request.getLength());
        quoteReq.setBreadth(request.getBreadth());
        quoteReq.setHeight(request.getHeight());
        quoteReq.setActualWeight(request.getActualWeight());
        quoteReq.setOrderType(request.getOrderType());
        quoteReq.setPaymentType(request.getPaymentType());

        OrderQuoteResponse quote = pricingEngine.calculateQuote(quoteReq);

        String orderNum = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = Order.builder()
                .orderNumber(orderNum)
                .customer(customerProfile)
                .pickupAddress(request.getPickupAddress())
                .pickupLatitude(pickupCoords.getLatitude())
                .pickupLongitude(pickupCoords.getLongitude())
                .pickupZone(pickupZone)
                .dropAddress(request.getDropAddress())
                .dropLatitude(dropCoords.getLatitude())
                .dropLongitude(dropCoords.getLongitude())
                .dropZone(dropZone)
                .orderType(request.getOrderType())
                .paymentType(request.getPaymentType())
                .length(request.getLength())
                .breadth(request.getBreadth())
                .height(request.getHeight())
                .actualWeight(request.getActualWeight())
                .volumetricWeight(quote.getVolumetricWeight())
                .billableWeight(quote.getBillableWeight())
                .baseCharge(quote.getBaseCharge())
                .codSurcharge(quote.getCodSurcharge())
                .finalCharge(quote.getFinalCharge())
                .status(OrderStatus.CREATED)
                .build();

        order = orderRepository.save(order);

        trackingService.logEvent(
                order.getId(),
                null,
                OrderStatus.CREATED,
                currentUser.getId(),
                mapRoleToActorRole(currentUser.getRole()),
                pickupCoords.getLatitude(), pickupCoords.getLongitude(),
                "Order created successfully at " + pickupCoords.getPlaceName()
        );

        // Attempt Auto-Assignment
        assignmentService.autoAssignAgent(order);

        // Refresh order
        order = orderRepository.findById(order.getId()).orElse(order);

        notificationService.sendNotification(
                order.getId(),
                customerProfile.getId(),
                currentUser.getEmail(),
                currentUser.getPhone(),
                NotificationEventType.ORDER_CREATED,
                "Your order #" + order.getOrderNumber() + " has been created successfully."
        );

        return mapToResponse(order);
    }

    public List<OrderResponse> getUserOrders(User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return orderRepository.findAll().stream().map(this::mapToResponse).toList();
        } else if (currentUser.getRole() == Role.CUSTOMER) {
            CustomerProfile customer = customerRepository.findByUser(currentUser)
                    .orElseThrow(() -> new IllegalArgumentException("Customer profile not found"));
            return orderRepository.findByCustomer(customer).stream().map(this::mapToResponse).toList();
        } else {
            return getAgentAssignedOrders(currentUser);
        }
    }

    public List<OrderResponse> getAgentAssignedOrders(User currentUser) {
        DeliveryAgent agent = agentRepository.findByUser(currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Agent profile not found"));

        List<AgentAssignment> assignments = assignmentRepository.findByAgentAndStatus(agent, AssignmentStatus.ACTIVE);
        return assignments.stream()
                .map(a -> mapToResponse(a.getOrder()))
                .toList();
    }

    public OrderResponse getOrderById(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new IllegalStateException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        trackingService.logEvent(
                orderId,
                currentStatus,
                newStatus,
                currentUser.getId(),
                mapRoleToActorRole(currentUser.getRole()),
                request.getLatitude(),
                request.getLongitude(),
                request.getRemarks() != null ? request.getRemarks() : "Status updated to " + newStatus
        );

        // If delivered or returned, unassign active agent
        if (newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.RETURNED) {
            assignmentRepository.findByOrderAndStatus(updatedOrder, AssignmentStatus.ACTIVE)
                    .ifPresent(assignment -> {
                        assignment.setStatus(AssignmentStatus.COMPLETED);
                        assignmentRepository.save(assignment);
                    });
        }

        notificationService.sendNotification(
                orderId,
                updatedOrder.getCustomer().getId(),
                updatedOrder.getCustomer().getUser().getEmail(),
                updatedOrder.getCustomer().getUser().getPhone(),
                NotificationEventType.STATUS_UPDATE,
                "Order #" + updatedOrder.getOrderNumber() + " status updated to " + newStatus
        );

        return mapToResponse(updatedOrder);
    }

    @Transactional
    public OrderResponse markOrderFailed(Long orderId, FailOrderRequest request, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        OrderStatus currentStatus = order.getStatus();
        if (!currentStatus.canTransitionTo(OrderStatus.FAILED_DELIVERY)) {
            throw new IllegalStateException("Cannot mark order as failed from status: " + currentStatus);
        }

        order.setStatus(OrderStatus.FAILED_DELIVERY);
        Order updatedOrder = orderRepository.save(order);

        trackingService.logEvent(
                orderId,
                currentStatus,
                OrderStatus.FAILED_DELIVERY,
                currentUser.getId(),
                mapRoleToActorRole(currentUser.getRole()),
                request.getLatitude(),
                request.getLongitude(),
                "Delivery Failed: " + request.getReason() + ". " + (request.getRemarks() != null ? request.getRemarks() : "")
        );

        CustomerProfile customer = updatedOrder.getCustomer();
        notificationService.sendNotification(
                orderId,
                customer.getId(),
                customer.getUser().getEmail(),
                customer.getUser().getPhone(),
                NotificationEventType.FAILED_ATTEMPT,
                "Delivery attempt failed for Order #" + updatedOrder.getOrderNumber() + ". Reason: " + request.getReason()
        );

        return mapToResponse(updatedOrder);
    }

    @Transactional
    public OrderResponse requestReschedule(Long orderId, RescheduleRequestDTO request, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() != OrderStatus.FAILED_DELIVERY && order.getStatus() != OrderStatus.RESCHEDULED) {
            throw new IllegalStateException("Order can only be rescheduled after a failed delivery attempt or when already rescheduled.");
        }

        Reschedule reschedule = Reschedule.builder()
                .orderId(orderId)
                .requestedBy(currentUser.getId())
                .previousDate(order.getDeliveryDate())
                .newDate(request.getNewDeliveryDate())
                .reason(request.getReason())
                .notes(request.getNotes())
                .status(RescheduleStatus.APPROVED)
                .build();

        rescheduleRepository.save(reschedule);

        order.setDeliveryDate(request.getNewDeliveryDate());
        order.setStatus(OrderStatus.RESCHEDULED);
        Order updatedOrder = orderRepository.save(order);

        trackingService.logEvent(
                orderId,
                OrderStatus.FAILED_DELIVERY,
                OrderStatus.RESCHEDULED,
                currentUser.getId(),
                mapRoleToActorRole(currentUser.getRole()),
                null, null,
                "Order rescheduled to " + request.getNewDeliveryDate()
        );

        // Auto re-assign agent for new delivery date
        assignmentService.autoAssignAgent(updatedOrder);

        return mapToResponse(updatedOrder);
    }

    @Transactional
    public OrderResponse manualAssignAgent(Long orderId, Long agentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        DeliveryAgent newAgent = agentRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found"));

        // Deactivate existing assignments
        assignmentRepository.findByOrderAndStatus(order, AssignmentStatus.ACTIVE)
                .ifPresent(active -> {
                    active.setStatus(AssignmentStatus.CANCELLED);
                    assignmentRepository.save(active);
                });

        AgentAssignment newAssignment = AgentAssignment.builder()
                .order(order)
                .agent(newAgent)
                .assignmentType(AssignmentType.MANUAL)
                .status(AssignmentStatus.ACTIVE)
                .build();

        assignmentRepository.save(newAssignment);

        trackingService.logEvent(
                orderId,
                order.getStatus(),
                order.getStatus(),
                newAgent.getUser().getId(),
                ActorRole.SYSTEM,
                newAgent.getLatitude(),
                newAgent.getLongitude(),
                "Manually assigned agent: " + newAgent.getUser().getName()
        );

        return mapToResponse(order);
    }

    public OrderResponse mapToResponse(Order order) {
        AgentAssignment activeAssignment = assignmentRepository.findByOrderAndStatus(order, AssignmentStatus.ACTIVE)
                .orElse(null);

        DeliveryAgent agent = activeAssignment != null ? activeAssignment.getAgent() : null;

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getUser().getName())
                .customerEmail(order.getCustomer().getUser().getEmail())
                .customerPhone(order.getCustomer().getUser().getPhone())
                .pickupAddress(order.getPickupAddress())
                .pickupLatitude(order.getPickupLatitude())
                .pickupLongitude(order.getPickupLongitude())
                .pickupZoneCode(order.getPickupZone() != null ? order.getPickupZone().getZoneCode() : "N/A")
                .pickupZoneName(order.getPickupZone() != null ? order.getPickupZone().getZoneName() : "N/A")
                .dropAddress(order.getDropAddress())
                .dropLatitude(order.getDropLatitude())
                .dropLongitude(order.getDropLongitude())
                .dropZoneCode(order.getDropZone() != null ? order.getDropZone().getZoneCode() : "N/A")
                .dropZoneName(order.getDropZone() != null ? order.getDropZone().getZoneName() : "N/A")
                .orderType(order.getOrderType())
                .paymentType(order.getPaymentType())
                .length(order.getLength())
                .breadth(order.getBreadth())
                .height(order.getHeight())
                .actualWeight(order.getActualWeight())
                .volumetricWeight(order.getVolumetricWeight())
                .billableWeight(order.getBillableWeight())
                .baseCharge(order.getBaseCharge())
                .codSurcharge(order.getCodSurcharge())
                .finalCharge(order.getFinalCharge())
                .status(order.getStatus())
                .deliveryDate(order.getDeliveryDate())
                .assignedAgentId(agent != null ? agent.getId() : null)
                .assignedAgentName(agent != null ? agent.getUser().getName() : null)
                .assignedAgentPhone(agent != null ? agent.getUser().getPhone() : null)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private ActorRole mapRoleToActorRole(Role role) {
        return switch (role) {
            case CUSTOMER -> ActorRole.CUSTOMER;
            case DELIVERY_AGENT -> ActorRole.DELIVERY_AGENT;
            case ADMIN -> ActorRole.ADMIN;
        };
    }
}
