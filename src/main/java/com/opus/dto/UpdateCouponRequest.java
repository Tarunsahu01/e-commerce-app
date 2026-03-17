package com.opus.dto;

public class UpdateCouponRequest {

	private Double discountPercentage;
	private Boolean active;

	public Double getDiscountPercentage() {
		return discountPercentage;
	}

	public Boolean getActive() {
		return active;
	}

	public void setDiscountPercentage(Double discountPercentage) {
		this.discountPercentage = discountPercentage;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
}

