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

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ProductRepository productRepository, CategoryRepository categoryRepository,
            RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedRoles();
        seedAdminUser();
        seedCategories();
        seedProducts();
    }

    private void seedRoles() {
        if (roleRepository.count() > 0) return;
        List<Role> roles = Arrays.asList(createRole("USER"), createRole("ADMIN"));
        roleRepository.saveAll(roles);
    }

    private Role createRole(String name) {
        Role role = new Role();
        role.setName(name);
        return role;
    }

    private void seedAdminUser() {
        if (userRepository.findByEmail("admin@example.com").isPresent()) return;
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
        if (categoryRepository.count() > 0) return;
        List<Category> categories = Arrays.asList(
                createCategory("Electronics"),
                createCategory("Bags"),
                createCategory("Shoes"),
                createCategory("Clothing"),
                createCategory("Accessories"));
        categoryRepository.saveAll(categories);
    }

    private Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        category.setDescription("Category for " + name.toLowerCase());
        return category;
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        // Electronics - using direct Unsplash photo IDs (guaranteed to work)
        createProductsForCategory("Electronics", new Object[][] {
            { "iPhone 14",          70000.0, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80" },
            { "Samsung Galaxy S23", 65000.0, "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80" },
            { "MacBook Air",        95000.0, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
            { "Dell Inspiron",      55000.0, "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80" },
            { "Sony Headphones",    9000.0,  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
            { "LG Monitor",         12000.0, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80" },
            { "iPad Mini",          45000.0, "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&q=80" },
            { "JBL Speaker",        5000.0,  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
            { "Canon DSLR",         60000.0, "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
            { "Smart Watch",        8000.0,  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" }
        });

        // Bags
        createProductsForCategory("Bags", new Object[][] {
            { "American Tourister Backpack", 1999.0, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
            { "Wildcraft Travel Bag",        2499.0, "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=400&q=80" },
            { "Laptop Sleeve",               899.0,  "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400&q=80" },
            { "Gym Bag",                     1499.0, "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80" },
            { "Leather Office Bag",          3999.0, "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
            { "School Backpack",             1299.0, "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400&q=80" },
            { "Hiking Backpack",             3499.0, "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=400&q=80" },
            { "Side Sling Bag",              999.0,  "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400&q=80" },
            { "Duffel Bag",                  1799.0, "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&q=80" },
            { "Cabin Trolley",               4999.0, "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&q=80" }
        });

        // Shoes
        createProductsForCategory("Shoes", new Object[][] {
            { "Nike Air Max",         6999.0, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
            { "Adidas Ultraboost",    8999.0, "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80" },
            { "Puma Running Shoes",   4999.0, "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80" },
            { "Woodland Boots",       5999.0, "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80" },
            { "Formal Leather Shoes", 3999.0, "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80" },
            { "Casual Sneakers",      2999.0, "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80" },
            { "Sports Trainers",      3499.0, "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80" },
            { "Slippers",             999.0,  "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80" },
            { "Sandals",              1499.0, "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80" },
            { "Basketball Shoes",     7499.0, "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&q=80" }
        });

        // Clothing
        createProductsForCategory("Clothing", new Object[][] {
            { "T-Shirt",     799.0,  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
            { "Jeans",       1999.0, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80" },
            { "Hoodie",      2499.0, "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80" },
            { "Jacket",      3499.0, "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80" },
            { "Shirt",       1499.0, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" },
            { "Shorts",      999.0,  "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=400&q=80" },
            { "Track Pants", 1599.0, "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80" },
            { "Sweater",     2299.0, "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80" },
            { "Kurta",       1299.0, "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80" },
            { "Blazer",      4999.0, "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80" }
        });

        // Accessories
        createProductsForCategory("Accessories", new Object[][] {
            { "Sunglasses",        1999.0, "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80" },
            { "Wallet",            999.0,  "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80" },
            { "Belt",              799.0,  "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&q=80" },
            { "Cap",               499.0,  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80" },
            { "Watch",             2999.0, "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" },
            { "Bracelet",          599.0,  "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80" },
            { "Scarf",             699.0,  "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80" },
            { "Gloves",            899.0,  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80" },
            { "Ring",              1499.0, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80" },
            { "Backpack Keychain", 299.0,  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" }
        });

        System.out.println("Seeded 50 products with images.");
    }

    private void createProductsForCategory(String categoryName, Object[][] products) {
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new IllegalStateException("Category not found: " + categoryName));

        for (Object[] data : products) {
            String name = (String) data[0];
            Double price = (Double) data[1];
            String imageUrl = (String) data[2];

            Product product = new Product();
            product.setName(name);
            product.setDescription("High quality " + name);
            product.setPrice(price);
            product.setQuantityAvailable(100);
            product.setCategory(category);
            product.setImageUrl(imageUrl);

            productRepository.save(product);
        }
    }
}