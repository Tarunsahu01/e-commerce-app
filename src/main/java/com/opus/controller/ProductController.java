package com.opus.controller;

import com.opus.dto.ProductRequest;
import com.opus.dto.ProductResponse;
import com.opus.entity.Product;
import com.opus.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

	private final ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	@PostMapping
	public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {

		return productService.createProduct(request);
	}

	@GetMapping
	public List<Product> getAllProducts() {
		return productService.getAllProducts();
	}

	@GetMapping("/{id}")
	public Product getProductById(@PathVariable Long id) {
		return productService.getProductById(id);
	}

	@PutMapping("/{id}")
	public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {

		return productService.updateProduct(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable Long id) {

		productService.deleteProduct(id);

		return ResponseEntity.ok("Product deleted successfully");
	}
}