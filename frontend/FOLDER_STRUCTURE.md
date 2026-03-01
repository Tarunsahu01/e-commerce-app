# Recommended Folder Structure

```
frontend/src/
├── components/              # Reusable UI components
│   ├── layout/             # App shell
│   │   ├── Layout.jsx       # Navbar + Footer + Outlet
│   │   ├── Navbar.jsx       # Header with auth, cart badge, nav links
│   │   └── Footer.jsx       # Site footer
│   ├── home/               # Homepage-specific sections
│   │   ├── Hero.jsx        # Hero section
│   │   ├── FeaturedProducts.jsx
│   │   └── CategoriesSection.jsx
│   ├── product/
│   │   └── ProductCard.jsx  # Reusable product card
│   └── ProtectedRoute.jsx   # Route guard
├── context/
│   ├── AuthContext.jsx      # JWT auth state
│   └── CartContext.jsx      # Cart state (user-specific)
├── hooks/
│   ├── useProducts.js       # GET /products
│   └── useCategories.js     # GET /categories
├── lib/
│   ├── api.js              # Axios instance + JWT interceptor
│   └── utils.js            # parseJwtPayload, etc.
├── pages/
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Rationale

- **components/** by feature (layout, home, product) — easier to locate and scale
- **context/** — app-wide state; Auth and Cart separated to avoid unnecessary re-renders
- **hooks/** — data-fetching logic; keeps pages thin and testable
- **lib/** — shared utilities and API config
- **pages/** — one component per route; composes smaller components
