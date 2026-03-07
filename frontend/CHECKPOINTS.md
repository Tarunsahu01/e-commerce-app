# Checkpoints — E-Commerce Frontend

This file records project checkpoints used as baselines before new feature changes.

---

## Checkpoint 1 – Hero Page Stable

**Date:** Baseline before Product Suggestion Carousel  
**Purpose:** Stable state of the UI before adding the "Suggested For You" carousel.

### Current working pages

| Route   | Page          | Status  |
|--------|----------------|---------|
| `/`    | HomePage       | Working |
| `/cart`| CartPage       | Working |
| `/login`   | LoginPage  | Working |
| `/register`| RegisterPage | Working |

### Current UI components

| Component   | Location                    | Role |
|------------|-----------------------------|------|
| Layout     | `components/layout/Layout.jsx`   | Navbar + Footer + Outlet |
| Navbar     | `components/layout/Navbar.jsx`   | Header, cart, login, user menu |
| Footer     | `components/layout/Footer.jsx`   | Site footer |
| Hero       | `components/home/Hero.jsx`      | Homepage hero section |

### Routing state

- **Router:** React Router v6 (`BrowserRouter`, `Routes`, `Route`)
- **Layout:** All main routes render inside `Layout` (Navbar above, Footer below, content via `Outlet`)
- **Catch-all:** `path="*"` redirects to `/`
- **Auth:** No route guards; auth state from `AuthContext` used only in Navbar and CartPage content

### Confirmation

- **Hero:** Stable. Section with heading "Discover Your Next Favorite", subtitle, and two links (Shop Now, Browse All). Styles: `bg-gray-100`, `border-b border-gray-200`, `max-w-7xl`, black/gray text.
- **Navbar:** Stable. White header, E-Shop logo, cart icon, Login or user dropdown. Styles: `bg-white border-b border-gray-200`, black text, `rounded-md`, `hover:bg-gray-100`.
- **Footer:** Stable. Black background, gray text, E-Shop link, Contact, copyright. Styles: `bg-black text-gray-300`, `max-w-7xl`.

**No UI changes were made during this checkpoint.** This checkpoint is the baseline for the Product Suggestion Carousel feature.

---

## Checkpoint 4 – Pre-Admin System

**Date:** Baseline before Admin System implementation  
**Purpose:** Stable state with cart, coupons, and user flows before adding Admin Dashboard and product/coupon management.

### Current working pages

| Route     | Page        | Status  |
|----------|-------------|---------|
| `/`      | HomePage    | Working |
| `/cart`  | CartPage    | Working |
| `/payment` | PaymentPage | Working |
| `/login` | LoginPage   | Working |
| `/register` | RegisterPage | Working |

### Features at this checkpoint

- User authentication (JWT, login/register)
- Product listing with category carousels
- Cart (add, update, remove, checkout)
- Coupon application on cart
- Payment page

### Backend APIs (unchanged)

- Auth: `/auth/login`, `/auth/register`, `/auth/me`
- Products: GET `/products`, GET `/products/:id` (public); POST/PUT/DELETE (ADMIN)
- Categories: GET/POST (ADMIN for POST)
- Coupons: POST `/coupons` (ADMIN), GET `/coupons`, POST `/coupons/applicable`
- Cart: USER-only endpoints

**No breaking changes to user functionality after this checkpoint.** Admin system is added in a separate layer with route protection and role-based UI.

