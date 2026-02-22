package com.opus.controller;

import com.opus.entity.Cart;
import com.opus.service.CartService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

	private CartService cartService;

	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public Cart getMyCart() {
		return cartService.getOrCreateCart();
	}
}