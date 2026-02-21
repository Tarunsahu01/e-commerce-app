package com.opus.controller;

import com.opus.dto.CategoryRequest;
import com.opus.dto.CategoryResponse;
import com.opus.entity.Category;
import com.opus.service.CategoryService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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