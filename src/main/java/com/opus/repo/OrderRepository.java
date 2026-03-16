package com.opus.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opus.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

	Order findByStripeSessionId(String sessionId);
}