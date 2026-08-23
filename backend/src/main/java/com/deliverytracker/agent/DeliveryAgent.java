package com.deliverytracker.agent;

import com.deliverytracker.user.User;
import com.deliverytracker.zone.Zone;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_agents")
public class DeliveryAgent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String employeeCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus availabilityStatus;

    private Double latitude;

    private Double longitude;

    private LocalDateTime lastLocationUpdate;

    private Long currentOrderId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    public DeliveryAgent() {}

    public DeliveryAgent(Long id, User user, String employeeCode, AvailabilityStatus availabilityStatus, Double latitude, Double longitude, LocalDateTime lastLocationUpdate, Long currentOrderId, Zone zone) {
        this.id = id;
        this.user = user;
        this.employeeCode = employeeCode;
        this.availabilityStatus = availabilityStatus;
        this.latitude = latitude;
        this.longitude = longitude;
        this.lastLocationUpdate = lastLocationUpdate;
        this.currentOrderId = currentOrderId;
        this.zone = zone;
    }

    @PrePersist
    protected void onCreate() {
        if (availabilityStatus == null) availabilityStatus = AvailabilityStatus.AVAILABLE;
        lastLocationUpdate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public AvailabilityStatus getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getLastLocationUpdate() { return lastLocationUpdate; }
    public void setLastLocationUpdate(LocalDateTime lastLocationUpdate) { this.lastLocationUpdate = lastLocationUpdate; }

    public Long getCurrentOrderId() { return currentOrderId; }
    public void setCurrentOrderId(Long currentOrderId) { this.currentOrderId = currentOrderId; }

    public Zone getZone() { return zone; }
    public void setZone(Zone zone) { this.zone = zone; }

    public static DeliveryAgentBuilder builder() { return new DeliveryAgentBuilder(); }

    public static class DeliveryAgentBuilder {
        private Long id;
        private User user;
        private String employeeCode;
        private AvailabilityStatus availabilityStatus;
        private Double latitude;
        private Double longitude;
        private LocalDateTime lastLocationUpdate;
        private Long currentOrderId;
        private Zone zone;

        public DeliveryAgentBuilder id(Long id) { this.id = id; return this; }
        public DeliveryAgentBuilder user(User user) { this.user = user; return this; }
        public DeliveryAgentBuilder employeeCode(String employeeCode) { this.employeeCode = employeeCode; return this; }
        public DeliveryAgentBuilder availabilityStatus(AvailabilityStatus availabilityStatus) { this.availabilityStatus = availabilityStatus; return this; }
        public DeliveryAgentBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public DeliveryAgentBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public DeliveryAgentBuilder lastLocationUpdate(LocalDateTime lastLocationUpdate) { this.lastLocationUpdate = lastLocationUpdate; return this; }
        public DeliveryAgentBuilder currentOrderId(Long currentOrderId) { this.currentOrderId = currentOrderId; return this; }
        public DeliveryAgentBuilder zone(Zone zone) { this.zone = zone; return this; }

        public DeliveryAgent build() {
            return new DeliveryAgent(id, user, employeeCode, availabilityStatus, latitude, longitude, lastLocationUpdate, currentOrderId, zone);
        }
    }
}
