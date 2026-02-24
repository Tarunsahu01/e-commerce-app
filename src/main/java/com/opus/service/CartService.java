package com.opus.service;

import com.opus.dto.AddToCartRequest;
import com.opus.dto.UpdateCartRequest;
import com.opus.entity.Cart;
import com.opus.entity.CartItem;
import com.opus.entity.Coupon;
import com.opus.entity.Product;
import com.opus.entity.User;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CartItemRepository;
import com.opus.repo.CartRepository;
import com.opus.repo.CouponRepository;
import com.opus.repo.ProductRepository;
import com.opus.repo.UserRepository;
import com.opus.security.SecurityUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CartService {

	private CartRepository cartRepository;
	private UserRepository userRepository;
	private ProductRepository productRepository;
	private CartItemRepository cartItemRepository;
	private CouponRepository couponRepository;

	public CartService(CartRepository cartRepository, UserRepository userRepository,
			ProductRepository productRepository, CartItemRepository cartItemRepository,
			CouponRepository couponRepository) {
		this.cartRepository = cartRepository;
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.cartItemRepository = cartItemRepository;
		this.couponRepository = couponRepository;
	}

	public Cart getOrCreateCart() {

		String email = SecurityUtil.getCurrentUsername();

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return cartRepository.findByUser(user).orElseGet(() -> {

			Cart newCart = new Cart();
			newCart.setUser(user);
			newCart.setTotalAmount(0.0);
			newCart.setCreatedAt(LocalDateTime.now());
			newCart.setUpdatedAt(LocalDateTime.now());

			return cartRepository.save(newCart);
		});
	}

	public Cart addProductToCart(AddToCartRequest request) {

		Cart cart = getOrCreateCart();

		Product product = productRepository.findById(request.getProductId())
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		CartItem existingItem = cart.getCartItems().stream()
				.filter(item -> item.getProduct().getId().equals(product.getId())).findFirst().orElse(null);

		if (existingItem != null) {

			int newQuantity = existingItem.getQuantity() + request.getQuantity();

			if (newQuantity > product.getQuantityAvailable()) {

				throw new RuntimeException("Not enough stock available");
			}

			existingItem.setQuantity(newQuantity);

		} else {

			if (request.getQuantity() > product.getQuantityAvailable()) {

				throw new RuntimeException("Not enough stock available");
			}

			CartItem cartItem = new CartItem();
			cartItem.setCart(cart);
			cartItem.setProduct(product);
			cartItem.setQuantity(request.getQuantity());
			cartItem.setPriceAtTime(product.getPrice());

			cart.getCartItems().add(cartItem);
		}

		updateCartTotal(cart);

		return cartRepository.save(cart);
	}

	public Cart updateCartItem(UpdateCartRequest request) {

		Cart cart = getOrCreateCart();

		CartItem cartItem = cart.getCartItems().stream()
				.filter(item -> item.getProduct().getId().equals(request.getProductId())).findFirst()
				.orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

		Product product = cartItem.getProduct();

		if (request.getQuantity() > product.getQuantityAvailable()) {

			throw new RuntimeException("Requested quantity exceeds stock");
		}

		if (request.getQuantity() == 0) {

			cart.getCartItems().remove(cartItem);

		} else {

			cartItem.setQuantity(request.getQuantity());
		}

		updateCartTotal(cart);

		return cartRepository.save(cart);
	}

	private void updateCartTotal(Cart cart) {

		double total = 0.0;

		Coupon coupon = cart.getAppliedCoupon();

		for (CartItem item : cart.getCartItems()) {

			double itemTotal = item.getPriceAtTime() * item.getQuantity();

			if (coupon != null && item.getProduct().getCategory().getId().equals(coupon.getCategory().getId())) {

				double discount = itemTotal * coupon.getDiscountPercentage() / 100;

				itemTotal -= discount;
			}

			total += itemTotal;
		}

		cart.setTotalAmount(total);
		cart.setUpdatedAt(java.time.LocalDateTime.now());
	}

	public Cart removeItemFromCart(Long productId) {

		Cart cart = getOrCreateCart();

		CartItem cartItem = cart.getCartItems().stream().filter(item -> item.getProduct().getId().equals(productId))
				.findFirst().orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

		cart.getCartItems().remove(cartItem);

		updateCartTotal(cart);

		return cartRepository.save(cart);
	}

	public Cart applyCoupon(String couponCode) {

		Cart cart = getOrCreateCart();

		Coupon coupon = couponRepository.findByCode(couponCode)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code"));

		// Active check
		if (!coupon.isActive()) {
			throw new RuntimeException("Coupon is inactive");
		}

		// Expiry check
		if (coupon.getExpiryDate().isBefore(java.time.LocalDate.now())) {

			throw new RuntimeException("Coupon expired");
		}

		cart.setAppliedCoupon(coupon);

		updateCartTotal(cart);

		return cartRepository.save(cart);
	}
}