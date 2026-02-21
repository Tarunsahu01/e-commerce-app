package com.opus.service;

import com.opus.dto.CategoryRequest;
import com.opus.dto.CategoryResponse;
import com.opus.entity.Category;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

	private CategoryRepository categoryRepository;

	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public CategoryResponse createCategory(CategoryRequest request) {

		Category category = new Category();
		category.setName(request.getName());
		category.setDescription(request.getDescription());

		Category saved = categoryRepository.save(category);

		return mapToResponse(saved);
	}

	public List<CategoryResponse> getAllCategories() {

		return categoryRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	public CategoryResponse updateCategory(Long id, CategoryRequest request) {

		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

		category.setName(request.getName());
		category.setDescription(request.getDescription());

		Category updated = categoryRepository.save(category);

		return mapToResponse(updated);
	}

	public void deleteCategory(Long id) {

		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

		categoryRepository.delete(category);
	}

	private CategoryResponse mapToResponse(Category category) {

		CategoryResponse response = new CategoryResponse();

		response.setId(category.getId());
		response.setName(category.getName());
		response.setDescription(category.getDescription());

		return response;
	}
}