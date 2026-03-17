package com.opus.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    private Double priceAtTime;

    @ManyToOne
    private Order order;

    @ManyToOne
    private Product product;

    public OrderItem() {
	}

	public OrderItem(Long id, Integer quantity, Double priceAtTime, Order order, Product product) {
		super();
		this.id = id;
		this.quantity = quantity;
		this.priceAtTime = priceAtTime;
		this.order = order;
		this.product = product;
	}
	
	public OrderItem(Integer quantity, Double priceAtTime, Order order, Product product) {
		super();
		this.quantity = quantity;
		this.priceAtTime = priceAtTime;
		this.order = order;
		this.product = product;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Double getPriceAtTime() {
		return priceAtTime;
	}

	public void setPriceAtTime(Double priceAtTime) {
		this.priceAtTime = priceAtTime;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}
    
    

}