package com.opus.dto;

import java.util.List;

public class CheckoutResponse {

	private List<CheckoutItem> items;
	private String appliedCoupon;
	private Double totalAmount;

	public CheckoutResponse() {
	}

	public List<CheckoutItem> getItems() {
		return items;
	}

	public String getAppliedCoupon() {
		return appliedCoupon;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setItems(List<CheckoutItem> items) {
		this.items = items;
	}

	public void setAppliedCoupon(String appliedCoupon) {
		this.appliedCoupon = appliedCoupon;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}
}