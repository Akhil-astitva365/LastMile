package com.deliverytracker.zone;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "areas")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    @JsonIgnore
    private Zone zone;

    @Column(nullable = false)
    private String areaName;

    private String pincode;
    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private String status;

    public Area() {}

    public Area(Long id, Zone zone, String areaName, String pincode, Double latitude, Double longitude, String status) {
        this.id = id;
        this.zone = zone;
        this.areaName = areaName;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Zone getZone() { return zone; }
    public void setZone(Zone zone) { this.zone = zone; }

    public String getAreaName() { return areaName; }
    public void setAreaName(String areaName) { this.areaName = areaName; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static AreaBuilder builder() { return new AreaBuilder(); }

    public static class AreaBuilder {
        private Long id;
        private Zone zone;
        private String areaName;
        private String pincode;
        private Double latitude;
        private Double longitude;
        private String status;

        public AreaBuilder id(Long id) { this.id = id; return this; }
        public AreaBuilder zone(Zone zone) { this.zone = zone; return this; }
        public AreaBuilder areaName(String areaName) { this.areaName = areaName; return this; }
        public AreaBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public AreaBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public AreaBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public AreaBuilder status(String status) { this.status = status; return this; }

        public Area build() {
            return new Area(id, zone, areaName, pincode, latitude, longitude, status);
        }
    }
}
