package com.deliverytracker.zone;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "zones")
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String zoneCode;

    @Column(nullable = false)
    private String zoneName;

    @Column(nullable = false)
    private String status;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Area> areas = new ArrayList<>();

    private LocalDateTime createdAt;

    public Zone() {}

    public Zone(Long id, String zoneCode, String zoneName, String status, List<Area> areas, LocalDateTime createdAt) {
        this.id = id;
        this.zoneCode = zoneCode;
        this.zoneName = zoneName;
        this.status = status;
        if (areas != null) this.areas = areas;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "ACTIVE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getZoneCode() { return zoneCode; }
    public void setZoneCode(String zoneCode) { this.zoneCode = zoneCode; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Area> getAreas() { return areas; }
    public void setAreas(List<Area> areas) { this.areas = areas; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ZoneBuilder builder() { return new ZoneBuilder(); }

    public static class ZoneBuilder {
        private Long id;
        private String zoneCode;
        private String zoneName;
        private String status;
        private List<Area> areas = new ArrayList<>();
        private LocalDateTime createdAt;

        public ZoneBuilder id(Long id) { this.id = id; return this; }
        public ZoneBuilder zoneCode(String zoneCode) { this.zoneCode = zoneCode; return this; }
        public ZoneBuilder zoneName(String zoneName) { this.zoneName = zoneName; return this; }
        public ZoneBuilder status(String status) { this.status = status; return this; }
        public ZoneBuilder areas(List<Area> areas) { this.areas = areas; return this; }
        public ZoneBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Zone build() {
            return new Zone(id, zoneCode, zoneName, status, areas, createdAt);
        }
    }
}
