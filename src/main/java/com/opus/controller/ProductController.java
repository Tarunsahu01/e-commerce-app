package com.opus.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.opus.dto.ProductRequest;
import com.opus.dto.ProductResponse;
import com.opus.entity.Product;
import com.opus.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

	private final ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping(consumes = "multipart/form-data")
	public ProductResponse createProduct(@RequestParam String name, @RequestParam String description,
			@RequestParam Double price, @RequestParam Integer quantityAvailable, @RequestParam Long categoryId,
			@RequestParam(required = false) MultipartFile image) throws IOException {

		String imageUrl = null;

		if (image != null && !image.isEmpty()) {
			imageUrl = productService.uploadImage(image);
		}

		ProductRequest request = new ProductRequest();
		request.setName(name);
		request.setDescription(description);
		request.setPrice(price);
		request.setQuantityAvailable(quantityAvailable);
		request.setCategoryId(categoryId);
		request.setImageUrl(imageUrl);

		return productService.createProduct(request);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping(value = "/{id}", consumes = "multipart/form-data")
	public ProductResponse updateProduct(@PathVariable Long id, @RequestParam String name,
			@RequestParam String description, @RequestParam Double price, @RequestParam Integer quantityAvailable,
			@RequestParam Long categoryId, @RequestParam(required = false) MultipartFile image) throws IOException {

		Product existing = productService.getProductById(id);
		String imageUrl = existing.getImageUrl();

		if (image != null && !image.isEmpty()) {
			if (existing.getImageUrl() != null) {
				productService.deleteImage(existing.getImageUrl());
			}

			imageUrl = productService.uploadImage(image);
		}

		ProductRequest request = new ProductRequest();
		request.setName(name);
		request.setDescription(description);
		request.setPrice(price);
		request.setQuantityAvailable(quantityAvailable);
		request.setCategoryId(categoryId);
		request.setImageUrl(imageUrl);

		return productService.updateProduct(id, request);
	}

	@GetMapping
	public List<Product> getAllProducts() {
		return productService.getAllProducts();
	}

	@GetMapping("/{id}")
	public Product getProductById(@PathVariable Long id) {
		return productService.getProductById(id);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
		Product product = productService.getProductById(id);

		if (product.getImageUrl() != null) {
			productService.deleteImage(product.getImageUrl());
		}

		productService.deleteProduct(id);

		return ResponseEntity.ok("Product deleted successfully");
	}
	
}