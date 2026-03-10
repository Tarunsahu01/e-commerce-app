package com.opus.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.opus.dto.StripeResponse;
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
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.LineItem;
import com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData;
import com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData.ProductData;

@Service
public class PaymentCheckoutService {
	
	@Value("${stripe.secretKey}")
	private String secretKey;
	
	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CartItemRepository cartItemRepository;
	
	@Autowired
	private OrderItemRepository orderItemRepository;


	public StripeResponse checkout() {
		
		String email = SecurityUtil.getCurrentUsername();
		
		User user = userRepository.findByEmail(email).orElseThrow(
					() -> new ResourceNotFoundException("User not found")
				);
		
		Cart cart = cartRepository.findByUser(user).orElseThrow(
					() -> new RuntimeException("Cart not found")
				);

		if (cart.getCartItems().isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}

		Double totalAmount = cart.getTotalAmount();

		Order order = new Order();
		order.setUser(cart.getUser());
		order.setTotalAmount(totalAmount);
		order.setPaymentStatus("PENDING");
		order.setCoupon(cart.getAppliedCoupon());
		order.setCreatedAt(LocalDateTime.now());

		order = orderRepository.save(order);
		
		List<CartItem> cartItemList = cartItemRepository.findByCart(cart);
		
		List<OrderItem> orderItemList = new ArrayList<>();
		
		for(CartItem item : cartItemList) {
			OrderItem orderItem = new OrderItem(item.getQuantity(),
								item.getPriceAtTime(), order, item.getProduct() 
					);
			orderItemList.add(orderItem);
		}
		orderItemRepository.saveAll(orderItemList);
		

		Stripe.apiKey = secretKey;

		ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData.builder()
				.setName("Order ID#" + order.getId()).build();

		PriceData priceData = SessionCreateParams.LineItem.PriceData.builder().setCurrency("INR")
				.setUnitAmount((long) (totalAmount * 100)).setProductData(productData).build();

		LineItem lineItem = SessionCreateParams.LineItem.builder().setQuantity(1L).setPriceData(priceData).build();

		SessionCreateParams params = SessionCreateParams.builder().setMode(SessionCreateParams.Mode.PAYMENT)
				.setSuccessUrl("http://localhost:3000/payment-success")
				.setCancelUrl("http://localhost:3000/payment-cancel").addLineItem(lineItem).build();

		Session session = null;

		try {
			session = Session.create(params);
		} catch (StripeException e) {
			throw new RuntimeException(e.getMessage());
		}

		order.setStripeSessionId(session.getId());
		orderRepository.save(order);

		return new StripeResponse("SUCCESS", "Payment session created", session.getId(), session.getUrl());
	}
	
	public String paymentSuccess(Map<String,String> req) {
		String sessionId = req.get("sessionId");

	    Order order = orderRepository.findByStripeSessionId(sessionId);

	    order.setPaymentStatus("SUCCESS");

	    orderRepository.save(order);
	    
	    return "Payment success updated";
	}
	
	public String paymentCancel(Map<String,String> req) {
		String sessionId = req.get("sessionId");

	    Order order = orderRepository.findByStripeSessionId(sessionId);

	    order.setPaymentStatus("FAILED");

	    orderRepository.save(order);

	    return "Payment cancelled";
	}
}
