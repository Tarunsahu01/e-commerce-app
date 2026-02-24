package com.opus.dto;

import java.time.LocalDate;

public class CouponResponse {

	private Long id;
	private String code;
	private Double discountPercentage;
	private LocalDate expiryDate;
	private boolean active;
	private String categoryName;

	public CouponResponse() {
	}


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

	public String getCategoryName() {
		return categoryName;
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

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
}