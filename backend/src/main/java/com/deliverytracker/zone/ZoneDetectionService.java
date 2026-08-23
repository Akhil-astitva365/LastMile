package com.deliverytracker.zone;

import com.deliverytracker.zone.AreaRepository;
import com.deliverytracker.zone.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneDetectionService {

    private final ZoneRepository zoneRepository;
    private final AreaRepository areaRepository;

    public ZoneDetectionService(ZoneRepository zoneRepository, AreaRepository areaRepository) {
        this.zoneRepository = zoneRepository;
        this.areaRepository = areaRepository;
    }

    public Zone detectZoneByAddress(String address) {
        if (address == null || address.isBlank()) {
            return getFallbackZone();
        }

        String normalized = address.toLowerCase();

        // 1. Check matching area names
        List<Area> allAreas = areaRepository.findAll();
        for (Area area : allAreas) {
            if (normalized.contains(area.getAreaName().toLowerCase()) ||
                (area.getPincode() != null && normalized.contains(area.getPincode()))) {
                return area.getZone();
            }
        }

        // 2. Check zone names
        List<Zone> allZones = zoneRepository.findAll();
        for (Zone zone : allZones) {
            if (normalized.contains(zone.getZoneName().toLowerCase()) ||
                normalized.contains(zone.getZoneCode().toLowerCase())) {
                return zone;
            }
        }

        // 3. Default fallback
        return getFallbackZone();
    }

    private Zone getFallbackZone() {
        return zoneRepository.findAll().stream().findFirst().orElseGet(() ->
                zoneRepository.save(Zone.builder()
                        .zoneCode("ZONE_DEFAULT")
                        .zoneName("Default Regional Zone")
                        .status("ACTIVE")
                        .build())
        );
    }
}
