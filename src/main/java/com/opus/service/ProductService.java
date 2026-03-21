package com.opus.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.opus.dto.ProductRequest;
import com.opus.dto.ProductResponse;
import com.opus.entity.Category;
import com.opus.entity.Product;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CategoryRepository;
import com.opus.repo.ProductRepository;

@Service
public class ProductService {

	private ProductRepository productRepository;
	private CategoryRepository categoryRepository;
	private Cloudinary cloudinary;

	public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
			Cloudinary cloudinary) {
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.cloudinary = cloudinary;
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
		product.setImageUrl(request.getImageUrl()); // always set, even if null

		Product savedProduct = productRepository.save(product);
		return mapToResponse(savedProduct);
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
		product.setImageUrl(request.getImageUrl()); // always set, even if null

		Product updatedProduct = productRepository.save(product);
		return mapToResponse(updatedProduct);
	}

	private ProductResponse mapToResponse(Product product) {
		ProductResponse response = new ProductResponse();
		response.setId(product.getId());
		response.setName(product.getName());
		response.setDescription(product.getDescription());
		response.setPrice(product.getPrice());
		response.setQuantityAvailable(product.getQuantityAvailable());
		response.setCategoryName(product.getCategory().getName());
		response.setImageUrl(product.getImageUrl());
		return response;
	}

	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	public Product getProductById(Long id) {
		return productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
	}

	public void deleteProduct(Long id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
		productRepository.delete(product);
	}

	public String uploadImage(MultipartFile file) throws IOException {
		Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "products"));

		return uploadResult.get("secure_url").toString();
	}

	public void deleteImage(String imageUrl) {
		if (imageUrl == null || !imageUrl.contains("cloudinary"))
			return;

		try {
			String publicIdWithFormat = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
			String publicId = publicIdWithFormat.substring(0, publicIdWithFormat.lastIndexOf("."));

			String fullPublicId = "products/" + publicId;

			cloudinary.uploader().destroy(fullPublicId, ObjectUtils.emptyMap());
		} catch (Exception e) {
			System.out.println("Cloudinary delete failed: " + e.getMessage());
		}
	}

}