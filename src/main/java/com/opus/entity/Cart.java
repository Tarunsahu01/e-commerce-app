package com.opus.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "carts")
public class Cart {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "user_id", unique = true)
	private User user;

	private Double totalAmount = 0.0;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	@JsonManagedReference
	@OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CartItem> cartItems;

	public Cart() {
	}

	// Getters & Setters

	public Long getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public List<CartItem> getCartItems() {
		return cartItems;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public void setCartItems(List<CartItem> cartItems) {
		this.cartItems = cartItems;
	}
}