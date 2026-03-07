package com.opus.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.opus.dto.CategoryRequest;
import com.opus.dto.CategoryResponse;
import com.opus.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	private final CategoryService categoryService;

	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@PostMapping
	public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {

		return categoryService.createCategory(request);
	}

	@GetMapping
	public List<CategoryResponse> getAllCategories() {
		return categoryService.getAllCategories();
	}

	@PutMapping("/{id}")
	public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {

		return categoryService.updateCategory(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCategory(@PathVariable Long id) {

		categoryService.deleteCategory(id);

		return ResponseEntity.ok("Category deleted successfully");
	}
}