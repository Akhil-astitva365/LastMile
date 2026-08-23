package com.deliverytracker.config;

import com.deliverytracker.agent.AgentRepository;
import com.deliverytracker.agent.AvailabilityStatus;
import com.deliverytracker.agent.DeliveryAgent;
import com.deliverytracker.customer.CustomerProfile;
import com.deliverytracker.customer.CustomerRepository;
import com.deliverytracker.order.OrderService;
import com.deliverytracker.order.dto.CreateOrderRequest;
import com.deliverytracker.pricing.*;
import com.deliverytracker.user.Role;
import com.deliverytracker.user.User;
import com.deliverytracker.user.UserRepository;
import com.deliverytracker.zone.Area;
import com.deliverytracker.zone.AreaRepository;
import com.deliverytracker.zone.Zone;
import com.deliverytracker.zone.ZoneRepository;
import com.deliverytracker.zone.ZoneType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;
    private final ZoneRepository zoneRepository;
    private final AreaRepository areaRepository;
    private final RateCardRepository rateCardRepository;
    private final CodSurchargeRepository codSurchargeRepository;
    private final OrderService orderService;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CustomerRepository customerRepository, AgentRepository agentRepository, ZoneRepository zoneRepository, AreaRepository areaRepository, RateCardRepository rateCardRepository, CodSurchargeRepository codSurchargeRepository, OrderService orderService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.agentRepository = agentRepository;
        this.zoneRepository = zoneRepository;
        this.areaRepository = areaRepository;
        this.rateCardRepository = rateCardRepository;
        this.codSurchargeRepository = codSurchargeRepository;
        this.orderService = orderService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already initialized.");
            return;
        }

        log.info("Seeding initial data for Last-Mile Delivery Tracker...");

        // 1. Seed Zones and Areas
        Zone bhopalZone = zoneRepository.save(Zone.builder()
                .zoneCode("ZONE_BHOPAL")
                .zoneName("Bhopal Central Zone")
                .status("ACTIVE")
                .build());

        Zone indoreZone = zoneRepository.save(Zone.builder()
                .zoneCode("ZONE_INDORE")
                .zoneName("Indore Metro Zone")
                .status("ACTIVE")
                .build());

        areaRepository.save(Area.builder().zone(bhopalZone).areaName("Bhopal").pincode("462001").latitude(23.2599).longitude(77.4126).status("ACTIVE").build());
        areaRepository.save(Area.builder().zone(bhopalZone).areaName("Sehore").pincode("466001").latitude(23.2032).longitude(77.0845).status("ACTIVE").build());
        areaRepository.save(Area.builder().zone(bhopalZone).areaName("Ashta").pincode("466116").latitude(23.0189).longitude(76.5492).status("ACTIVE").build());

        areaRepository.save(Area.builder().zone(indoreZone).areaName("Indore").pincode("452001").latitude(22.7196).longitude(75.8577).status("ACTIVE").build());
        areaRepository.save(Area.builder().zone(indoreZone).areaName("Dewas").pincode("455001").latitude(22.9676).longitude(76.0534).status("ACTIVE").build());
        areaRepository.save(Area.builder().zone(indoreZone).areaName("Ujjain").pincode("456001").latitude(23.1765).longitude(75.7885).status("ACTIVE").build());

        // 2. Seed Rate Cards
        // B2C INTRA-ZONE
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2C).zoneType(ZoneType.INTRA_ZONE).minWeight(0.0).maxWeight(1.0).baseCharge(BigDecimal.valueOf(50)).perKgCharge(BigDecimal.valueOf(10)).active(true).build());
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2C).zoneType(ZoneType.INTRA_ZONE).minWeight(1.0).maxWeight(5.0).baseCharge(BigDecimal.valueOf(80)).perKgCharge(BigDecimal.valueOf(12)).active(true).build());
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2C).zoneType(ZoneType.INTRA_ZONE).minWeight(5.0).maxWeight(50.0).baseCharge(BigDecimal.valueOf(120)).perKgCharge(BigDecimal.valueOf(15)).active(true).build());

        // B2C INTER-ZONE
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2C).zoneType(ZoneType.INTER_ZONE).minWeight(0.0).maxWeight(1.0).baseCharge(BigDecimal.valueOf(80)).perKgCharge(BigDecimal.valueOf(15)).active(true).build());
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2C).zoneType(ZoneType.INTER_ZONE).minWeight(1.0).maxWeight(5.0).baseCharge(BigDecimal.valueOf(120)).perKgCharge(BigDecimal.valueOf(15)).active(true).build());
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2C).zoneType(ZoneType.INTER_ZONE).minWeight(5.0).maxWeight(50.0).baseCharge(BigDecimal.valueOf(180)).perKgCharge(BigDecimal.valueOf(15)).active(true).build());

        // B2B INTRA-ZONE
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2B).zoneType(ZoneType.INTRA_ZONE).minWeight(0.0).maxWeight(10.0).baseCharge(BigDecimal.valueOf(150)).perKgCharge(BigDecimal.valueOf(8)).active(true).build());
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2B).zoneType(ZoneType.INTRA_ZONE).minWeight(10.0).maxWeight(100.0).baseCharge(BigDecimal.valueOf(300)).perKgCharge(BigDecimal.valueOf(6)).active(true).build());

        // B2B INTER-ZONE
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2B).zoneType(ZoneType.INTER_ZONE).minWeight(0.0).maxWeight(10.0).baseCharge(BigDecimal.valueOf(250)).perKgCharge(BigDecimal.valueOf(10)).active(true).build());
        rateCardRepository.save(RateCard.builder().orderType(OrderType.B2B).zoneType(ZoneType.INTER_ZONE).minWeight(10.0).maxWeight(100.0).baseCharge(BigDecimal.valueOf(500)).perKgCharge(BigDecimal.valueOf(6)).active(true).build());

        // 3. Seed COD Surcharges
        codSurchargeRepository.save(CodSurcharge.builder().orderType(OrderType.B2C).surchargeType("FIXED").surchargeValue(BigDecimal.valueOf(30)).active(true).build());
        codSurchargeRepository.save(CodSurcharge.builder().orderType(OrderType.B2B).surchargeType("FIXED").surchargeValue(BigDecimal.valueOf(50)).active(true).build());

        // 4. Seed Users (Admin, Customer, Delivery Agents)
        String hashedPwd = passwordEncoder.encode("password");

        // Admin User
        User adminUser = userRepository.save(User.builder()
                .name("System Admin")
                .email("admin@demo.com")
                .password(hashedPwd)
                .phone("+919876543210")
                .role(Role.ADMIN)
                .active(true)
                .build());

        // Customer User
        User customerUser = userRepository.save(User.builder()
                .name("Alex Customer")
                .email("customer@demo.com")
                .password(hashedPwd)
                .phone("+919876543211")
                .role(Role.CUSTOMER)
                .active(true)
                .build());

        CustomerProfile customerProfile = customerRepository.save(CustomerProfile.builder()
                .user(customerUser)
                .companyName("Acme Retail Corp")
                .build());

        // Delivery Agent 1 (Bhopal)
        User agentUser1 = userRepository.save(User.builder()
                .name("John Agent (Bhopal)")
                .email("agent1@demo.com")
                .password(hashedPwd)
                .phone("+919876543212")
                .role(Role.DELIVERY_AGENT)
                .active(true)
                .build());

        agentRepository.save(DeliveryAgent.builder()
                .user(agentUser1)
                .employeeCode("AGT-101")
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .latitude(23.2599)
                .longitude(77.4126)
                .zone(bhopalZone)
                .build());

        // Delivery Agent 2 (Indore)
        User agentUser2 = userRepository.save(User.builder()
                .name("Sarah Agent (Indore)")
                .email("agent2@demo.com")
                .password(hashedPwd)
                .phone("+919876543213")
                .role(Role.DELIVERY_AGENT)
                .active(true)
                .build());

        agentRepository.save(DeliveryAgent.builder()
                .user(agentUser2)
                .employeeCode("AGT-102")
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .latitude(22.7196)
                .longitude(75.8577)
                .zone(indoreZone)
                .build());

        // 5. Seed Sample Orders
        CreateOrderRequest orderReq = new CreateOrderRequest();
        orderReq.setPickupAddress("VIT Bhopal Campus, Sehore, Bhopal 462001");
        orderReq.setDropAddress("Vijay Nagar, Indore 452001");
        orderReq.setLength(50.0);
        orderReq.setBreadth(40.0);
        orderReq.setHeight(30.0);
        orderReq.setActualWeight(8.0);
        orderReq.setOrderType(OrderType.B2C);
        orderReq.setPaymentType(PaymentType.COD);
        orderReq.setCustomerUserId(customerUser.getId());

        orderService.createOrder(orderReq, customerUser);

        log.info("Database seeding completed successfully! Demo accounts ready: admin@demo.com, customer@demo.com, agent1@demo.com");
    }
}
