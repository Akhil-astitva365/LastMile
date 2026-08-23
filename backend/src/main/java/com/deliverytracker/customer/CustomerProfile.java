package com.deliverytracker.customer;

import com.deliverytracker.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String companyName;

    private LocalDateTime createdAt;

    public CustomerProfile() {}

    public CustomerProfile(Long id, User user, String companyName, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.companyName = companyName;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static CustomerProfileBuilder builder() { return new CustomerProfileBuilder(); }

    public static class CustomerProfileBuilder {
        private Long id;
        private User user;
        private String companyName;
        private LocalDateTime createdAt;

        public CustomerProfileBuilder id(Long id) { this.id = id; return this; }
        public CustomerProfileBuilder user(User user) { this.user = user; return this; }
        public CustomerProfileBuilder companyName(String companyName) { this.companyName = companyName; return this; }
        public CustomerProfileBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CustomerProfile build() {
            return new CustomerProfile(id, user, companyName, createdAt);
        }
    }
}
