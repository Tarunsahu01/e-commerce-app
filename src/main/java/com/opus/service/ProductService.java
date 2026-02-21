package com.opus.service;

import com.opus.dto.ProductRequest;
import com.opus.dto.ProductResponse;
import com.opus.entity.Category;
import com.opus.entity.Product;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CategoryRepository;
import com.opus.repo.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

	private ProductRepository productRepository;

	private CategoryRepository categoryRepository;

	public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
	}

	public ProductResponse createProduct(ProductRequest request) {

		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Product product = new Product();
		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setQuantityAvailable(request.getQuantityAvailable());
		product.setCategory(category);

		Product savedProduct = productRepository.save(product);

		return mapToResponse(savedProduct);
	}

	private ProductResponse mapToResponse(Product product) {

		ProductResponse response = new ProductResponse();

		response.setId(product.getId());
		response.setName(product.getName());
		response.setDescription(product.getDescription());
		response.setPrice(product.getPrice());
		response.setQuantityAvailable(product.getQuantityAvailable());
		response.setCategoryName(product.getCategory().getName());

		return response;
	}

	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	public Product getProductById(Long id) {

		return productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
	}

	public ProductResponse updateProduct(Long id, ProductRequest request) {

		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setQuantityAvailable(request.getQuantityAvailable());
		product.setCategory(category);

		Product updatedProduct = productRepository.save(product);

		return mapToResponse(updatedProduct);
	}

	public void deleteProduct(Long id) {

		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

		productRepository.delete(product);
	}
}