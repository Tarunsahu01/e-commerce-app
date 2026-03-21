package com.opus.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.opus.entity.Category;
import com.opus.entity.Product;
import com.opus.entity.Role;
import com.opus.entity.User;
import com.opus.repo.CategoryRepository;
import com.opus.repo.ProductRepository;
import com.opus.repo.RoleRepository;
import com.opus.repo.UserRepository;
import com.opus.service.ProductService;

@Component
public class DataInitializer implements CommandLineRunner {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	private final RoleRepository roleRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final ProductService productService;

	public DataInitializer(ProductRepository productRepository, CategoryRepository categoryRepository,
			RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder,
			ProductService productService) {
		super();
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.roleRepository = roleRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.productService = productService;
	}

	@Override
	public void run(String... args) {
		seedRoles();
		seedAdminUser();
		seedCategories();
		seedProducts();
	}

	private void seedRoles() {
		if (roleRepository.count() > 0)
			return;
		List<Role> roles = Arrays.asList(createRole("USER"), createRole("ADMIN"));
		roleRepository.saveAll(roles);
	}

	private Role createRole(String name) {
		Role role = new Role();
		role.setName(name);
		return role;
	}

	private void seedAdminUser() {
		if (userRepository.findByEmail("admin@example.com").isPresent())
			return;
		Role adminRole = roleRepository.findByName("ADMIN")
				.orElseThrow(() -> new IllegalStateException("ADMIN role not found"));
		User admin = new User();
		admin.setName("Admin");
		admin.setEmail("admin@example.com");
		admin.setPassword(passwordEncoder.encode("admin123"));
		admin.setRole(adminRole);
		admin.setVerified(true);
		userRepository.save(admin);
	}

	private void seedCategories() {
		if (categoryRepository.count() > 0)
			return;
		List<Category> categories = Arrays.asList(createCategory("Electronics"), createCategory("Bags"),
				createCategory("Shoes"), createCategory("Clothing"), createCategory("Accessories"));
		categoryRepository.saveAll(categories);
	}

	private Category createCategory(String name) {
		Category category = new Category();
		category.setName(name);
		category.setDescription("Category for " + name.toLowerCase());
		return category;
	}

	private void seedProducts() {
		if (productRepository.count() > 0)
			return;

		createProductsForCategory("Electronics", new Object[][] { { "iPhone 14", 70000.0,
				"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100628/products/v9fqwwdynmxzl60desjk.jpg" },
				{ "Samsung Galaxy S23", 65000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100631/products/ventiti7aargwtytrmry.jpg" },
				{ "MacBook Air", 95000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100632/products/p7d6tqtdxznm5qs4ab9c.jpg" },
				{ "Dell Inspiron", 55000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100634/products/fgdngh0gqnsqz28vbkzn.jpg" },
				{ "Sony Headphones", 9000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100636/products/y8878h5pq8rcoa5owm4f.jpg" },
				{ "LG Monitor", 12000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100638/products/dycsrkeuonrcczyi5fq2.jpg" },
				{ "iPad Mini", 45000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100639/products/ejz9gdirycpykhcxwm45.jpg" },
				{ "JBL Speaker", 5000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100642/products/qar4yexwwjnxuow0tdxv.jpg" },
				{ "Canon DSLR", 60000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100643/products/uucqnufjjlg4wt2fbz19.jpg" },
				{ "Smart Watch", 8000.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100645/products/rp3nde8hgsovajqxpv5g.jpg" } });

		// Bags
		createProductsForCategory("Bags", new Object[][] { { "American Tourister Backpack", 1999.0,
				"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100647/products/j6eio3vz1i5vvxbkk7di.jpg" },
				{ "Wildcraft Travel Bag", 2499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100648/products/dusceujd2tw8i7fbw4vz.jpg" },
				{ "Laptop Sleeve", 899.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100651/products/by8yuuooxucjt3ju4mpc.jpg" },
				{ "Gym Bag", 1499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100653/products/ll2q65swf4yvkvzxvwoh.jpg" },
				{ "Leather Office Bag", 3999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100655/products/qumxqzyjeevpqny1cuqu.jpg" },
				{ "School Backpack", 1299.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100659/products/gnd5cw0gvq0hr7ymcii4.jpg" },
				{ "Hiking Backpack", 3499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100662/products/vvfsp95lbxn6kkbhokzc.jpg" },
				{ "Side Sling Bag", 999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100664/products/vurrntohtp5p3rwqinym.jpg" },
				{ "Duffel Bag", 1799.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100666/products/bu5rb15yf1dv14bj6gjk.jpg" },
				{ "Cabin Trolley", 4999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100668/products/y19lgay9qbkvkhywekhx.jpg" } });

		// Shoes
		createProductsForCategory("Shoes", new Object[][] { { "Nike Air Max", 6999.0,
				"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100670/products/e6fvk57pgppofbqzppys.jpg" },
				{ "Adidas Ultraboost", 8999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100671/products/y11goxwxksqsy5jv1s8j.jpg" },
				{ "Puma Running Shoes", 4999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100673/products/x5djmuzs2z3ikrdroz4d.jpg" },
				{ "Woodland Boots", 5999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100675/products/jd1d9e7k2tawa5pd4bi2.jpg" },
				{ "Formal Leather Shoes", 3999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100676/products/jarxewjvsf48eebp92ev.jpg" },
				{ "Casual Sneakers", 2999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100678/products/mlhtekgicwvyfsbyucbw.jpg" },
				{ "Sports Trainers", 3499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100680/products/crysy2rffui1cqbybfnn.jpg" },
				{ "Slippers", 999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100681/products/hotge8rbzyldagaejatp.jpg" },
				{ "Sandals", 1499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100684/products/vynnzp53cocoritmfcpo.jpg" },
				{ "Basketball Shoes", 7499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100685/products/fxqr9zmc0ivsxr77nstu.jpg" } });

		// Clothing
		createProductsForCategory("Clothing", new Object[][] { { "T-Shirt", 799.0,
				"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100687/products/itmdurhhln5w5thiaha2.jpg" },
				{ "Jeans", 1999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100689/products/mlvm8oezconh0qlb3xce.jpg" },
				{ "Hoodie", 2499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100691/products/hdcqwgvakdvsiz8k3mgp.jpg" },
				{ "Jacket", 3499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100693/products/xugba1j9t9kafwik2lay.jpg" },
				{ "Shirt", 1499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100695/products/zmme6s41pikzll2i2nzx.jpg" },
				{ "Shorts", 999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100697/products/xy0n6hlra7d2jrnegxh5.jpg" },
				{ "Track Pants", 1599.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100699/products/x8zfrx5oigi3aendyu9d.jpg" },
				{ "Sweater", 2299.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100701/products/ztfiepft77l0ecshd9kw.jpg" },
				{ "Kurta", 1299.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100702/products/c2swyx6m1vnwmsdsip21.jpg" },
				{ "Blazer", 4999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100705/products/mg0yiikmub8jnnoyekic.jpg" } });

		// Accessories
		createProductsForCategory("Accessories", new Object[][] { { "Sunglasses", 1999.0,
				"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100706/products/vowjxavviqmfhbadoyyv.jpg" },
				{ "Wallet", 999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100708/products/dpims2yqpsj8two8uyjq.jpg" },
				{ "Belt", 799.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100710/products/hvidzo3xzx1fpsuvyxpv.jpg" },
				{ "Cap", 499.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100712/products/buqr7dxgdy6ifih6urlm.jpg" },
				{ "Watch", 2999.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100715/products/g1gwdq8zrncnvbngcjok.jpg" },
				{ "Bracelet", 599.0,
						"https://res.cloudinary.com/dfbiwzvf9/image/upload/v1774100717/products/ki7pq1ml5nckghm7zqv6.jpg" } });

		System.out.println("Seeded 50 products with images.");
	}

	private void createProductsForCategory(String categoryName, Object[][] products) {
		Category category = categoryRepository.findByName(categoryName)
				.orElseThrow(() -> new IllegalStateException("Category not found: " + categoryName));

		for (Object[] data : products) {
			String name = (String) data[0];
			Double price = (Double) data[1];
			String cloudUrl = (String) data[2];

			Product product = new Product();
			product.setName(name);
			product.setDescription("High quality " + name);
			product.setPrice(price);
			product.setQuantityAvailable(100);
			product.setCategory(category);
			product.setImageUrl(cloudUrl);

			productRepository.save(product);
		}
	}
}