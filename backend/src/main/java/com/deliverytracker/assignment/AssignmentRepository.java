package com.deliverytracker.assignment;

import com.deliverytracker.agent.DeliveryAgent;
import com.deliverytracker.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<AgentAssignment, Long> {
    Optional<AgentAssignment> findByOrderIdAndStatus(Long orderId, AssignmentStatus status);
    Optional<AgentAssignment> findByOrderAndStatus(Order order, AssignmentStatus status);
    List<AgentAssignment> findByAgentIdAndStatus(Long agentId, AssignmentStatus status);
    List<AgentAssignment> findByAgentAndStatus(DeliveryAgent agent, AssignmentStatus status);
    List<AgentAssignment> findByOrderId(Long orderId);
}
