package com.opus.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opus.entity.Cart;
import com.opus.entity.CartItem;
import com.opus.entity.Order;
import com.opus.entity.OrderItem;
import com.opus.entity.User;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CartItemRepository;
import com.opus.repo.CartRepository;
import com.opus.repo.OrderItemRepository;
import com.opus.repo.OrderRepository;
import com.opus.repo.UserRepository;
import com.opus.security.SecurityUtil;

@Service
public class OrderService {

	private final UserRepository userRepository;
	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;

	public OrderService(
			UserRepository userRepository,
			CartRepository cartRepository,
			CartItemRepository cartItemRepository,
			OrderRepository orderRepository,
			OrderItemRepository orderItemRepository
	) {
		this.userRepository = userRepository;
		this.cartRepository = cartRepository;
		this.cartItemRepository = cartItemRepository;
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
	}

	/**
	 * Creates an Order snapshot from the user's current cart.
	 * Does NOT delete/clear the cart (per requirement).
	 */
	public Order createOrderFromCart(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Cart cart = cartRepository.findByUser(user)
				.orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

		List<CartItem> cartItems = cartItemRepository.findByCart(cart);
		if (cartItems == null || cartItems.isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}

		Double totalAmount = cart.getTotalAmount();

		Order order = new Order();
		order.setUser(user);
		order.setTotalAmount(totalAmount);
		order.setPaymentStatus("PENDING");
		order.setCoupon(cart.getAppliedCoupon());
		order.setCreatedAt(LocalDateTime.now());

		order = orderRepository.save(order);

		List<OrderItem> orderItems = new ArrayList<>();
		for (CartItem item : cartItems) {
			OrderItem orderItem = new OrderItem(
					item.getQuantity(),
					item.getPriceAtTime(),
					order,
					item.getProduct()
			);
			orderItems.add(orderItem);
		}

		orderItemRepository.saveAll(orderItems);
		order.setOrderItems(orderItems);

		return order;
	}
	
	@Transactional(readOnly = true)
	public List<Order> getMyOrders() {
		String email = SecurityUtil.getCurrentUsername();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return orderRepository.findMyOrdersWithItems(user);
	}
}

