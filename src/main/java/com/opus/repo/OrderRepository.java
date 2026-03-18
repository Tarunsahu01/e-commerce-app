package com.opus.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.opus.entity.Order;
import com.opus.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

	Order findByStripeSessionId(String sessionId);
	
	@Query("""
			select distinct o
			from Order o
			left join fetch o.orderItems oi
			left join fetch oi.product p
			where o.user = :user
			order by o.createdAt desc
			""")
	List<Order> findMyOrdersWithItems(@Param("user") User user);
}