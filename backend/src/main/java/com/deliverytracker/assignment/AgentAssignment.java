package com.deliverytracker.assignment;

import com.deliverytracker.agent.DeliveryAgent;
import com.deliverytracker.order.Order;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class AgentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agent_id", nullable = false)
    private DeliveryAgent agent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentType assignmentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status;

    private LocalDateTime assignedAt;
    private LocalDateTime unassignedAt;

    public AgentAssignment() {}

    public AgentAssignment(Long id, Order order, DeliveryAgent agent, AssignmentType assignmentType, AssignmentStatus status, LocalDateTime assignedAt, LocalDateTime unassignedAt) {
        this.id = id;
        this.order = order;
        this.agent = agent;
        this.assignmentType = assignmentType;
        this.status = status;
        this.assignedAt = assignedAt;
        this.unassignedAt = unassignedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (assignedAt == null) assignedAt = LocalDateTime.now();
        if (status == null) status = AssignmentStatus.ACTIVE;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public DeliveryAgent getAgent() { return agent; }
    public void setAgent(DeliveryAgent agent) { this.agent = agent; }

    public AssignmentType getAssignmentType() { return assignmentType; }
    public void setAssignmentType(AssignmentType assignmentType) { this.assignmentType = assignmentType; }

    public AssignmentStatus getStatus() { return status; }
    public void setStatus(AssignmentStatus status) { this.status = status; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getUnassignedAt() { return unassignedAt; }
    public void setUnassignedAt(LocalDateTime unassignedAt) { this.unassignedAt = unassignedAt; }

    public static AgentAssignmentBuilder builder() { return new AgentAssignmentBuilder(); }

    public static class AgentAssignmentBuilder {
        private Long id;
        private Order order;
        private DeliveryAgent agent;
        private AssignmentType assignmentType;
        private AssignmentStatus status;
        private LocalDateTime assignedAt;
        private LocalDateTime unassignedAt;

        public AgentAssignmentBuilder id(Long id) { this.id = id; return this; }
        public AgentAssignmentBuilder order(Order order) { this.order = order; return this; }
        public AgentAssignmentBuilder agent(DeliveryAgent agent) { this.agent = agent; return this; }
        public AgentAssignmentBuilder assignmentType(AssignmentType assignmentType) { this.assignmentType = assignmentType; return this; }
        public AgentAssignmentBuilder status(AssignmentStatus status) { this.status = status; return this; }
        public AgentAssignmentBuilder assignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; return this; }
        public AgentAssignmentBuilder unassignedAt(LocalDateTime unassignedAt) { this.unassignedAt = unassignedAt; return this; }

        public AgentAssignment build() {
            return new AgentAssignment(id, order, agent, assignmentType, status, assignedAt, unassignedAt);
        }
    }
}
