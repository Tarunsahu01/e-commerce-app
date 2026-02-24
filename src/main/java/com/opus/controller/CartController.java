package com.opus.controller;

import com.opus.dto.AddToCartRequest;
import com.opus.dto.ApplyCouponRequest;
import com.opus.dto.UpdateCartRequest;
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

	@PreAuthorize("hasRole('USER')")
	@PostMapping("/add")
	public Cart addToCart(@RequestBody AddToCartRequest request) {

		return cartService.addProductToCart(request);
	}

	@PreAuthorize("hasRole('USER')")
	@PutMapping("/update")
	public Cart updateCart(@RequestBody UpdateCartRequest request) {

		return cartService.updateCartItem(request);
	}

	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/remove/{productId}")
	public Cart removeItem(@PathVariable Long productId) {

		return cartService.removeItemFromCart(productId);
	}

	@PreAuthorize("hasRole('USER')")
	@PostMapping("/apply-coupon")
	public Cart applyCoupon(@RequestBody ApplyCouponRequest request) {

		return cartService.applyCoupon(request.getCouponCode());
	}
}