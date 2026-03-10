package com.opus.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opus.entity.Cart;
import com.opus.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	
	List<CartItem> findByCart(Cart cart);
}