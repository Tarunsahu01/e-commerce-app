package com.opus.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CouponRequest {

	@NotBlank
	private String code;

	@NotNull
	@Min(1)
	@Max(100)
	private Double discountPercentage;

	@NotNull
	@Future(message = "Expiry date must be future date")
	private LocalDate expiryDate;

	@NotNull
	private Long categoryId;


	public String getCode() {
		return code;
	}

	public Double getDiscountPercentage() {
		return discountPercentage;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public Long getCategoryId() {
		return categoryId;
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

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
}