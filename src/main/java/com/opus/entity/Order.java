package com.opus.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalAmount;

    private String paymentStatus; // PENDING, SUCCESS, FAILED

    @Column(unique = true)
    private String stripeSessionId;

    @ManyToOne
    private User user;

    @ManyToOne
    private Coupon coupon;

    private LocalDateTime createdAt;

    private Boolean orderConfirmationEmailSent = false;
    
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

	public Order(Long id, Double totalAmount, String paymentStatus, String stripeSessionId, User user, Coupon coupon,
			LocalDateTime createdAt) {
		super();
		this.id = id;
		this.totalAmount = totalAmount;
		this.paymentStatus = paymentStatus;
		this.stripeSessionId = stripeSessionId;
		this.user = user;
		this.coupon = coupon;
		this.createdAt = createdAt;
	}

	public Order() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getStripeSessionId() {
		return stripeSessionId;
	}

	public void setStripeSessionId(String stripeSessionId) {
		this.stripeSessionId = stripeSessionId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Coupon getCoupon() {
		return coupon;
	}

	public void setCoupon(Coupon coupon) {
		this.coupon = coupon;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
	public Boolean getOrderConfirmationEmailSent() {
		return orderConfirmationEmailSent;
	}
	
	public void setOrderConfirmationEmailSent(Boolean orderConfirmationEmailSent) {
		this.orderConfirmationEmailSent = orderConfirmationEmailSent;
	}

	public List<OrderItem> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItem> orderItems) {
		this.orderItems = orderItems;
	}
    
    

}