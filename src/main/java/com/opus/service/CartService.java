package com.opus.service;

import com.opus.dto.AddToCartRequest;
import com.opus.entity.Cart;
import com.opus.entity.CartItem;
import com.opus.entity.Product;
import com.opus.entity.User;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CartItemRepository;
import com.opus.repo.CartRepository;
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

	public CartService(CartRepository cartRepository, UserRepository userRepository,
			ProductRepository productRepository, CartItemRepository cartItemRepository) {

		this.cartRepository = cartRepository;
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.cartItemRepository = cartItemRepository;
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

		// Check if product already exists
		CartItem existingItem = cart.getCartItems().stream()
				.filter(item -> item.getProduct().getId().equals(product.getId())).findFirst().orElse(null);

		if (existingItem != null) {

			existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());

		} else {

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

	private void updateCartTotal(Cart cart) {

		double total = cart.getCartItems().stream().mapToDouble(item -> item.getPriceAtTime() * item.getQuantity())
				.sum();

		cart.setTotalAmount(total);
		cart.setUpdatedAt(java.time.LocalDateTime.now());
	}
}