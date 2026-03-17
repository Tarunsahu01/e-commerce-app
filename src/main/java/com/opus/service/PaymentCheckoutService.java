package com.opus.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opus.dto.StripeResponse;
import com.opus.entity.Cart;
import com.opus.entity.CartItem;
import com.opus.entity.Order;
import com.opus.entity.OrderItem;
import com.opus.entity.Product;
import com.opus.entity.User;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CartItemRepository;
import com.opus.repo.CartRepository;
import com.opus.repo.OrderItemRepository;
import com.opus.repo.OrderRepository;
import com.opus.repo.ProductRepository;
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
	
	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private EmailService emailService;


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
		
		List<CartItem> cartItemList = cartItemRepository.findByCart(cart);
		if (cartItemList == null || cartItemList.isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}
		
		// Stock validation before payment session creation
		for (CartItem item : cartItemList) {
			Product p = item.getProduct();
			int available = p.getQuantityAvailable() == null ? 0 : p.getQuantityAvailable();
			int requested = item.getQuantity() == null ? 0 : item.getQuantity();
			if (requested <= 0) {
				throw new RuntimeException("Invalid quantity in cart for product: " + (p != null ? p.getName() : "unknown"));
			}
			if (requested > available) {
				throw new RuntimeException("Insufficient stock for product: " + p.getName());
			}
		}
		

		Stripe.apiKey = secretKey;

		ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData.builder()
				.setName("Cart Checkout").build();

		PriceData priceData = SessionCreateParams.LineItem.PriceData.builder().setCurrency("INR")
				.setUnitAmount((long) (totalAmount * 100)).setProductData(productData).build();

		LineItem lineItem = SessionCreateParams.LineItem.builder().setQuantity(1L).setPriceData(priceData).build();

		SessionCreateParams params = SessionCreateParams.builder().setMode(SessionCreateParams.Mode.PAYMENT)
				.setSuccessUrl("http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}")
				.setCancelUrl("http://localhost:3000/payment-cancel?session_id={CHECKOUT_SESSION_ID}")
				.addLineItem(lineItem).build();

		Session session = null;

		try {
			session = Session.create(params);
		} catch (StripeException e) {
			throw new RuntimeException(e.getMessage());
		}

		return new StripeResponse("SUCCESS", "Payment session created", session.getId(), session.getUrl());
	}
	
	@Transactional
	public String paymentSuccess(Map<String,String> req) {
		String sessionId = req.get("sessionId");
		if (sessionId == null || sessionId.isBlank()) {
			throw new RuntimeException("Missing sessionId");
		}

		// Idempotency: if already created for this session, just return
		Order existing = orderRepository.findByStripeSessionId(sessionId);
		if (existing != null) {
			if (!"SUCCESS".equals(existing.getPaymentStatus())) {
				existing.setPaymentStatus("SUCCESS");
				orderRepository.save(existing);
			}

			// Ensure order email is sent only once
			boolean sent = existing.getOrderConfirmationEmailSent() != null && existing.getOrderConfirmationEmailSent();
			if (!sent) {
				try {
					String email = SecurityUtil.getCurrentUsername();
					User user = userRepository.findByEmail(email)
							.orElseThrow(() -> new ResourceNotFoundException("User not found"));
					existing.setOrderConfirmationEmailSent(true);
					orderRepository.save(existing);
					emailService.sendOrderConfirmation(user.getEmail(), existing, existing.getOrderItems());
				} catch (Exception ignored) {
				}
			}
			return "Payment success updated";
		}

		String email = SecurityUtil.getCurrentUsername();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Cart cart = cartRepository.findByUser(user)
				.orElseThrow(() -> new RuntimeException("Cart not found"));

		List<CartItem> cartItemList = cartItemRepository.findByCart(cart);
		if (cartItemList == null || cartItemList.isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}

		// Stock validation before any write
		for (CartItem item : cartItemList) {
			Product p = item.getProduct();
			int available = p.getQuantityAvailable() == null ? 0 : p.getQuantityAvailable();
			int requested = item.getQuantity() == null ? 0 : item.getQuantity();
			if (requested <= 0) {
				throw new RuntimeException("Invalid quantity in cart for product: " + (p != null ? p.getName() : "unknown"));
			}
			if (requested > available) {
				throw new RuntimeException("Insufficient stock for product: " + p.getName());
			}
		}

		Order order = new Order();
		order.setUser(cart.getUser());
		order.setTotalAmount(cart.getTotalAmount());
		order.setPaymentStatus("SUCCESS");
		order.setStripeSessionId(sessionId);
		order.setCoupon(cart.getAppliedCoupon());
		order.setCreatedAt(LocalDateTime.now());
		order.setOrderConfirmationEmailSent(false);
		try {
			order = orderRepository.save(order);
		} catch (DataIntegrityViolationException dup) {
			// Another request created the order concurrently for same stripeSessionId.
			Order created = orderRepository.findByStripeSessionId(sessionId);
			if (created != null) {
				return "Payment success updated";
			}
			throw dup;
		}

		List<OrderItem> orderItemList = new ArrayList<>();
		for (CartItem item : cartItemList) {
			OrderItem orderItem = new OrderItem(item.getQuantity(), item.getPriceAtTime(), order, item.getProduct());
			orderItemList.add(orderItem);
		}
		orderItemRepository.saveAll(orderItemList);

		// Reduce stock in DB
		for (CartItem item : cartItemList) {
			Product p = item.getProduct();
			int available = p.getQuantityAvailable() == null ? 0 : p.getQuantityAvailable();
			int requested = item.getQuantity() == null ? 0 : item.getQuantity();
			int next = available - requested;
			if (next < 0) {
				throw new RuntimeException("Insufficient stock for product: " + p.getName());
			}
			p.setQuantityAvailable(next);
			productRepository.save(p);
		}

		// Clear cart items (do NOT delete cart)
		cartItemRepository.deleteByCart(cart);
		cart.setAppliedCoupon(null);
		cart.setTotalAmount(0.0);
		cart.setUpdatedAt(LocalDateTime.now());
		cartRepository.save(cart);
		
		// Send order confirmation email (do not fail checkout if email fails)
		try {
			emailService.sendOrderConfirmation(user.getEmail(), order, orderItemList);
			order.setOrderConfirmationEmailSent(true);
			orderRepository.save(order);
		} catch (Exception ignored) {
		}

		return "Payment success updated";
	}
	
	public String paymentCancel(Map<String,String> req) {
		String sessionId = req.get("sessionId");
		if (sessionId == null || sessionId.isBlank()) {
			return "Payment cancelled";
		}
		Order order = orderRepository.findByStripeSessionId(sessionId);
		if (order != null) {
			order.setPaymentStatus("FAILED");
			orderRepository.save(order);
		}
		return "Payment cancelled";
	}
}
