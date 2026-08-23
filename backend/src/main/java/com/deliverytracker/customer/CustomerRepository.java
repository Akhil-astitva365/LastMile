package com.deliverytracker.customer;

import com.deliverytracker.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerProfile, Long> {
    Optional<CustomerProfile> findByUserId(Long userId);
    Optional<CustomerProfile> findByUserEmail(String email);
    Optional<CustomerProfile> findByUser(User user);
}
