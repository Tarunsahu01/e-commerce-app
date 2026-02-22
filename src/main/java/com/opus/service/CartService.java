package com.opus.service;

import com.opus.entity.Cart;
import com.opus.entity.User;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CartRepository;
import com.opus.repo.UserRepository;
import com.opus.security.SecurityUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CartService {

	private CartRepository cartRepository;
	private UserRepository userRepository;

	public CartService(CartRepository cartRepository, UserRepository userRepository) {
		this.cartRepository = cartRepository;
		this.userRepository = userRepository;
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
}