package com.deliverytracker.zone;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    Optional<Area> findByAreaNameIgnoreCase(String areaName);
    Optional<Area> findByPincode(String pincode);
    List<Area> findByZoneId(Long zoneId);
}
