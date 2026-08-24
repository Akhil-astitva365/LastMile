package com.deliverytracker.ai;

import com.deliverytracker.agent.DeliveryAgent;
import com.deliverytracker.assignment.AssignmentService;
import com.deliverytracker.customer.CustomerProfile;
import com.deliverytracker.customer.CustomerRepository;
import com.deliverytracker.notification.NotificationEventType;
import com.deliverytracker.notification.NotificationService;
import com.deliverytracker.order.Order;
import com.deliverytracker.order.OrderRepository;
import com.deliverytracker.order.OrderService;
import com.deliverytracker.order.dto.CreateOrderRequest;
import com.deliverytracker.order.dto.OrderResponse;
import com.deliverytracker.pricing.OrderType;
import com.deliverytracker.pricing.PaymentType;
import com.deliverytracker.pricing.PricingEngine;
import com.deliverytracker.tracking.TrackingService;
import com.deliverytracker.user.Role;
import com.deliverytracker.user.User;
import com.deliverytracker.user.UserRepository;
import com.deliverytracker.zone.GeocodingService;
import com.deliverytracker.zone.ZoneDetectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AIAgentService {

    private static final Logger logger = LoggerFactory.getLogger(AIAgentService.class);

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final ZoneDetectionService zoneDetectionService;
    private final GeocodingService geocodingService;
    private final PricingEngine pricingEngine;
    private final AssignmentService assignmentService;
    private final TrackingService trackingService;
    private final NotificationService notificationService;

    public AIAgentService(OrderService orderService, OrderRepository orderRepository, CustomerRepository customerRepository, UserRepository userRepository, ZoneDetectionService zoneDetectionService, GeocodingService geocodingService, PricingEngine pricingEngine, AssignmentService assignmentService, TrackingService trackingService, NotificationService notificationService) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.zoneDetectionService = zoneDetectionService;
        this.geocodingService = geocodingService;
        this.pricingEngine = pricingEngine;
        this.assignmentService = assignmentService;
        this.trackingService = trackingService;
        this.notificationService = notificationService;
    }

    @Transactional
    public AIAgentResponse processPromptAndCreateOrder(AIAgentRequest aiRequest, User currentUser) {
        String prompt = aiRequest != null ? aiRequest.getPrompt() : "";
        logger.info("[AI AGENT MODE] Processing natural language prompt: '{}'", prompt);

        // Resolve Customer User ID if current user is ADMIN or doesn't have a customer profile directly
        Long customerUserId = null;
        if (currentUser.getRole() == Role.ADMIN) {
            CustomerProfile firstCustomer = customerRepository.findAll().stream().findFirst().orElse(null);
            if (firstCustomer != null) {
                customerUserId = firstCustomer.getUser().getId();
            }
        }

        // 1. Natural Language Address & Spec Extraction
        String pickup = extractPickupAddress(prompt);
        String drop = extractDropAddress(prompt);
        if (pickup.equalsIgnoreCase(drop)) {
            drop = "Indore Central Hub, MP 452001";
        }

        double weight = extractWeight(prompt);
        double[] dims = extractDimensions(prompt);
        OrderType orderType = prompt.toLowerCase().contains("b2b") ? OrderType.B2B : OrderType.B2C;
        PaymentType paymentType = prompt.toLowerCase().contains("prepaid") ? PaymentType.PREPAID : PaymentType.COD;

        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerUserId(customerUserId);
        request.setPickupAddress(pickup);
        request.setDropAddress(drop);
        request.setLength(dims[0]);
        request.setBreadth(dims[1]);
        request.setHeight(dims[2]);
        request.setActualWeight(weight);
        request.setOrderType(orderType);
        request.setPaymentType(paymentType);

        // 2. Auto-Calculate Charges & Create Order
        OrderResponse createdOrder = orderService.createOrder(request, currentUser);

        // 3. Intelligently Assign Agent
        Order orderEntity = orderRepository.findById(createdOrder.getId()).orElseThrow();
        DeliveryAgent assignedAgent = assignmentService.autoAssignAgent(orderEntity).orElse(null);

        // 4. Send Multi-Channel Notifications at every step
        notificationService.sendNotification(
                createdOrder.getId(),
                createdOrder.getCustomerId(),
                currentUser.getEmail(),
                currentUser.getPhone(),
                NotificationEventType.ORDER_CREATED,
                "🤖 [AI AGENT] Order #" + createdOrder.getOrderNumber() + " created with auto-calculated fare ₹" + createdOrder.getFinalCharge()
        );

        String agentName = assignedAgent != null ? assignedAgent.getUser().getName() : "Auto-Dispatch Hub";

        String explanation = String.format(
                "🤖 AI Autonomous Dispatch Assistant processed your prompt!\n" +
                "• Order Created: #%s\n" +
                "• Route: %s ➔ %s\n" +
                "• Billable Weight: %.1f kg (Volumetric: %.1f kg)\n" +
                "• Auto-Calculated Charge: ₹%s (%s, %s)\n" +
                "• Intelligent Agent Assigned: %s\n" +
                "• Customer Notification: SMS & Email Triggered for %s",
                createdOrder.getOrderNumber(),
                createdOrder.getPickupAddress(),
                createdOrder.getDropAddress(),
                createdOrder.getBillableWeight(),
                createdOrder.getVolumetricWeight(),
                createdOrder.getFinalCharge(),
                orderType,
                paymentType,
                agentName,
                currentUser.getEmail()
        );

        return new AIAgentResponse(
                explanation,
                createdOrder.getOrderNumber(),
                createdOrder.getPickupAddress(),
                createdOrder.getDropAddress(),
                createdOrder.getBillableWeight(),
                createdOrder.getFinalCharge(),
                agentName,
                "Multi-Channel Email & SMS Triggered"
        );
    }

    private String extractPickupAddress(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return "Bhopal Central Hub, MP 462001";
        }
        String lower = prompt.toLowerCase();
        if (lower.contains("from ")) {
            int start = lower.indexOf("from ") + 5;
            int end = lower.indexOf(" to ", start);
            if (end != -1) {
                return prompt.substring(start, end).trim();
            }
            end = lower.indexOf(" for ", start);
            if (end != -1) {
                return prompt.substring(start, end).trim();
            }
        }
        if (lower.contains("bhopal")) return "VIT Bhopal Campus, Sehore, Bhopal 462001";
        if (lower.contains("delhi")) return "Connaught Place, New Delhi 110001";
        if (lower.contains("bengaluru") || lower.contains("bangalore")) return "MG Road, Bengaluru 560001";
        return "Bhopal Central Hub, MP 462001";
    }

    private String extractDropAddress(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return "Indore Metro Center, MP 452001";
        }
        String lower = prompt.toLowerCase();
        if (lower.contains(" to ")) {
            int start = lower.indexOf(" to ") + 4;
            int end = lower.indexOf(" cod", start);
            if (end == -1) end = lower.indexOf(" prepaid", start);
            if (end == -1) end = lower.indexOf(" for ", start);
            if (end == -1) end = prompt.length();
            return prompt.substring(start, end).trim();
        }
        if (lower.contains("indore")) return "Vijay Nagar, Indore 452001";
        if (lower.contains("mumbai")) return "Bandra West, Mumbai 400050";
        if (lower.contains("chennai")) return "Anna Salai, Chennai 600001";
        return "Indore Metro Center, MP 452001";
    }

    private double extractWeight(String prompt) {
        if (prompt == null) return 5.0;
        Pattern pattern = Pattern.compile("(\\d+(\\.\\d+)?)\\s*kg", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(prompt);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        }
        return 5.0;
    }

    private double[] extractDimensions(String prompt) {
        if (prompt == null) return new double[]{30.0, 20.0, 15.0};
        Pattern pattern = Pattern.compile("(\\d+)\\s*x\\s*(\\d+)\\s*x\\s*(\\d+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(prompt);
        if (matcher.find()) {
            return new double[]{
                    Double.parseDouble(matcher.group(1)),
                    Double.parseDouble(matcher.group(2)),
                    Double.parseDouble(matcher.group(3))
            };
        }
        return new double[]{30.0, 20.0, 15.0};
    }
}
