package com.deliverytracker.zone;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    Optional<Zone> findByZoneCode(String zoneCode);
    Optional<Zone> findByZoneNameIgnoreCase(String zoneName);
}
