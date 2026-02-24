package com.opus.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplyCouponRequest {

	@NotBlank
	private String couponCode;

	public ApplyCouponRequest() {
	}

	public String getCouponCode() {
		return couponCode;
	}

	public void setCouponCode(String couponCode) {
		this.couponCode = couponCode;
	}
}