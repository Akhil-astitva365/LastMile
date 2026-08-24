package com.deliverytracker.agent;

import com.deliverytracker.user.User;
import com.deliverytracker.zone.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<DeliveryAgent, Long> {
    Optional<DeliveryAgent> findByUserId(Long userId);
    Optional<DeliveryAgent> findByUserEmail(String email);
    List<DeliveryAgent> findAllByUser(User user);
    Optional<DeliveryAgent> findByEmployeeCode(String employeeCode);
    List<DeliveryAgent> findByAvailabilityStatus(AvailabilityStatus status);
    List<DeliveryAgent> findByAvailabilityStatusAndZoneId(AvailabilityStatus status, Long zoneId);
    List<DeliveryAgent> findByZoneAndAvailabilityStatus(Zone zone, AvailabilityStatus status);

    default Optional<DeliveryAgent> findByUser(User user) {
        List<DeliveryAgent> list = findAllByUser(user);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }
}
