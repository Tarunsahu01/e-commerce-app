package com.opus.dto;

public class CheckoutItem {

	private String productName;
	private Integer quantity;
	private Double price;
	private Double subtotal;

	public CheckoutItem() {
	}

	public String getProductName() {
		return productName;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public Double getPrice() {
		return price;
	}

	public Double getSubtotal() {
		return subtotal;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public void setSubtotal(Double subtotal) {
		this.subtotal = subtotal;
	}
}