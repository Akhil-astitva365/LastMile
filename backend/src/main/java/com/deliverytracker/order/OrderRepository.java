package com.deliverytracker.order;

import com.deliverytracker.customer.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Order> findByCustomer(CustomerProfile customer);
    List<Order> findByCustomerOrderByIdDesc(CustomerProfile customer);
    List<Order> findAllByOrderByIdDesc();
    List<Order> findByStatus(OrderStatus status);
}
