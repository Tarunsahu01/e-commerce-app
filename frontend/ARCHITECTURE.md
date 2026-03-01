# Frontend Architecture

## Folder Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── layout/           # App shell (Navbar, Footer, Layout)
│   ├── home/             # Homepage sections (Hero, FeaturedProducts, CategoriesSection)
│   └── product/          # Product-related (ProductCard)
├── context/              # React Context providers (Auth, Cart)
├── hooks/                # Custom hooks for data fetching (useProducts, useCategories)
├── lib/                  # Utilities (api instance, utils)
├── pages/                # Route-level components
├── App.jsx
├── main.jsx
└── index.css
```

## JWT Integration with Backend

1. **Login**: `POST /auth/login` returns `{ token: "JWT" }` or plain string. AuthContext stores token in localStorage and decodes payload for `user.email` (from JWT `sub` claim).

2. **Protected requests**: Axios interceptor in `lib/api.js` attaches `Authorization: Bearer <token>` to every request when token exists.

3. **401 handling**: Response interceptor clears token and dispatches `auth:logout`. AuthContext listens and updates state; user is redirected to login when hitting protected routes.

4. **Token persistence**: Stored in localStorage; rehydrated on app load. No refresh token in current API.

## State Architecture

| Context    | Purpose                    | Consumers                    |
|-----------|----------------------------|------------------------------|
| AuthContext | JWT, user, login/logout   | Navbar, ProtectedRoute, Login/Register |
| CartContext | Cart state, add/update/remove | Navbar (badge), ProductCard, CartPage |

Cart depends on Auth (user must be logged in). CartProvider is inside AuthProvider.

## Protected Routes

`ProtectedRoute` wraps routes that require auth. Uses `useAuth().isAuthenticated`. Optional `roles` prop for ADMIN-only routes. Redirects to `/login` with `state.from` for post-login redirect.

## Layout

`Layout` uses React Router's `Outlet` to render child route content between Navbar and Footer. All main pages use Layout; no duplication of header/footer.

## Custom Hooks

- `useProducts()`: Fetches GET /products, returns `{ products, loading, error, refetch }`
- `useCategories()`: Fetches GET /categories, returns `{ categories, loading, error, refetch }`

Hooks keep components thin; data logic is centralized and reusable.

## API Base URL

- Dev: Uses Vite proxy `/api` → `http://localhost:8080/api`
- Prod: Set `VITE_API_URL` in env (e.g. `https://api.example.com/api`)
