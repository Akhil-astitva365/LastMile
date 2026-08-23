package com.deliverytracker.reschedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RescheduleRepository extends JpaRepository<Reschedule, Long> {
    List<Reschedule> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
