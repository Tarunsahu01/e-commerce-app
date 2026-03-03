package com.opus.config;

import com.opus.entity.Category;
import com.opus.entity.Product;
import com.opus.repo.CategoryRepository;
import com.opus.repo.ProductRepository;
import com.opus.repo.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	private final RoleRepository roleRepository;

	public DataInitializer(ProductRepository productRepository, CategoryRepository categoryRepository,
			RoleRepository roleRepository) {
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.roleRepository = roleRepository;
	}

	@Override
	public void run(String... args) {
		seedCategories();
		seedProducts();
	}

	private void seedCategories() {
		if (categoryRepository.count() > 0) {
			return;
		}

		List<Category> categories = Arrays.asList(createCategory("Electronics"), createCategory("Bags"),
				createCategory("Shoes"), createCategory("Clothing"), createCategory("Accessories"));

		categoryRepository.saveAll(categories);

		System.out.println("Seeded " + categories.size() + " categories.");
	}

	private Category createCategory(String name) {
		Category category = new Category();
		category.setName(name);
		category.setDescription("Category for " + name.toLowerCase());
		return category;
	}

	private void seedProducts() {
		if (productRepository.count() > 0) {
			return;
		}

		createProductsForCategory("Electronics", new Object[][] { { "iPhone 14", 70000.0 },
				{ "Samsung Galaxy S23", 65000.0 }, { "MacBook Air", 95000.0 }, { "Dell Inspiron", 55000.0 },
				{ "Sony Headphones", 9000.0 }, { "LG Monitor", 12000.0 }, { "iPad Mini", 45000.0 },
				{ "JBL Speaker", 5000.0 }, { "Canon DSLR", 60000.0 }, { "Smart Watch", 8000.0 } });

		createProductsForCategory("Bags", new Object[][] { { "American Tourister Backpack", 1999.0 },
				{ "Wildcraft Travel Bag", 2499.0 }, { "Laptop Sleeve", 899.0 }, { "Gym Bag", 1499.0 },
				{ "Leather Office Bag", 3999.0 }, { "School Backpack", 1299.0 }, { "Hiking Backpack", 3499.0 },
				{ "Side Sling Bag", 999.0 }, { "Duffel Bag", 1799.0 }, { "Cabin Trolley", 4999.0 } });

		createProductsForCategory("Shoes", new Object[][] { { "Nike Air Max", 6999.0 },
				{ "Adidas Ultraboost", 8999.0 }, { "Puma Running Shoes", 4999.0 }, { "Woodland Boots", 5999.0 },
				{ "Formal Leather Shoes", 3999.0 }, { "Casual Sneakers", 2999.0 }, { "Sports Trainers", 3499.0 },
				{ "Slippers", 999.0 }, { "Sandals", 1499.0 }, { "Basketball Shoes", 7499.0 } });

		createProductsForCategory("Clothing", new Object[][] { { "T-Shirt", 799.0 }, { "Jeans", 1999.0 },
				{ "Hoodie", 2499.0 }, { "Jacket", 3499.0 }, { "Shirt", 1499.0 }, { "Shorts", 999.0 },
				{ "Track Pants", 1599.0 }, { "Sweater", 2299.0 }, { "Kurta", 1299.0 }, { "Blazer", 4999.0 } });

		createProductsForCategory("Accessories", new Object[][] { { "Sunglasses", 1999.0 }, { "Wallet", 999.0 },
				{ "Belt", 799.0 }, { "Cap", 499.0 }, { "Watch", 2999.0 }, { "Bracelet", 599.0 }, { "Scarf", 699.0 },
				{ "Gloves", 899.0 }, { "Ring", 1499.0 }, { "Backpack Keychain", 299.0 } });

		System.out.println("Seeded 50 products.");
	}

	private void createProductsForCategory(String categoryName, Object[][] products) {
		Category category = categoryRepository.findByName(categoryName)
				.orElseThrow(() -> new IllegalStateException("Category not found: " + categoryName));

		for (Object[] data : products) {
			String name = (String) data[0];
			Double price = (Double) data[1];

			Product product = new Product();
			product.setName(name);
			product.setDescription("High quality " + name);
			product.setPrice(price);
			product.setQuantityAvailable(100);
			product.setCategory(category);

			productRepository.save(product);
		}
	}
}

