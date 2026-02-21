package com.opus.dto;

public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer quantityAvailable;
    private String categoryName;

    public ProductResponse() {}

    public ProductResponse(Long id,
                           String name,
                           String description,
                           Double price,
                           Integer quantityAvailable,
                           String categoryName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantityAvailable = quantityAvailable;
        this.categoryName = categoryName;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}