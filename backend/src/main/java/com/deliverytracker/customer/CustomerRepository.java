package com.deliverytracker.customer;

import com.deliverytracker.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerProfile, Long> {
    Optional<CustomerProfile> findByUserId(Long userId);
    Optional<CustomerProfile> findByUserEmail(String email);
    List<CustomerProfile> findAllByUser(User user);
    List<CustomerProfile> findAllByUserId(Long userId);

    default Optional<CustomerProfile> findByUser(User user) {
        List<CustomerProfile> list = findAllByUser(user);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }
}
