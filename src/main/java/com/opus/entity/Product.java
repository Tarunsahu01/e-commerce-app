package com.opus.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	private String description;

	@Column(nullable = false)
	private Double price;

	@Column(name = "quantity_available")
	private Integer quantityAvailable;

	@ManyToOne
	@JoinColumn(name = "category_id", nullable = false)
	@JsonBackReference
	private Category category;

	// Default Constructor
	public Product() {
	}

	// Parameterized Constructor
	public Product(Long id, String name, String description, Double price, Integer quantityAvailable,
			Category category) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.quantityAvailable = quantityAvailable;
		this.category = category;
	}

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getQuantityAvailable() {
		return quantityAvailable;
	}

	public void setQuantityAvailable(Integer quantityAvailable) {
		this.quantityAvailable = quantityAvailable;
	}

	public Category getCategory() {
		return category;
	}

	public String getCategoryName() {
		return category != null ? category.getName() : null;
	}

	/** Exposes category id for API responses (e.g. cart) so coupons can be fetched by category. */
	public Long getCategoryId() {
		return category != null ? category.getId() : null;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
}