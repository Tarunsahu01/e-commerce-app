package com.opus.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "coupons")
public class Coupon {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String code;

	private Double discountPercentage;

	private LocalDate expiryDate;

	private boolean active = true;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;

	public Coupon() {
	}

	// Getters & Setters

	public Long getId() {
		return id;
	}

	public String getCode() {
		return code;
	}

	public Double getDiscountPercentage() {
		return discountPercentage;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public boolean isActive() {
		return active;
	}

	public Category getCategory() {
		return category;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public void setDiscountPercentage(Double discountPercentage) {
		this.discountPercentage = discountPercentage;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
}