# 📘 API CONTRACT — E-Commerce Application

## 📌 Base URL

```
http://localhost:8080/api
```

---

## 🔐 Authentication

All protected APIs require JWT token.

### Header Format

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 👤 AUTH APIs

---

## ✅ Register User

**POST** `/auth/register`

### Request Body

```json
{
  "name": "Tarun",
  "email": "user@gmail.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "User registered successfully"
}
```

---

## ✅ Login

**POST** `/auth/login`

### Request Body

```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "JWT_TOKEN"
}
```

---

# 🛍 PRODUCT APIs

---

## ✅ Get All Products (Public)

**GET** `/products`

### Response

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 50000,
    "category": "Electronics"
  }
]
```

---

## ✅ Create Product (ADMIN)

**POST** `/products`

🔒 Requires ADMIN role

---

## ✅ Update Product (ADMIN)

**PUT** `/products/{id}`

---

## ✅ Delete Product (ADMIN)

**DELETE** `/products/{id}`

---

# 🛒 CART APIs (USER ONLY)

---

## ✅ Get User Cart

**GET** `/cart`

Returns logged-in user's cart.

---

## ✅ Add Product To Cart

**POST** `/cart/add`

### Request

```json
{
  "productId": 1,
  "quantity": 2
}
```

---

## ✅ Update Cart Quantity

**PUT** `/cart/update`

### Request

```json
{
  "productId": 1,
  "quantity": 5
}
```

Quantity `0` removes item.

---

## ✅ Remove Item From Cart

**DELETE** `/cart/remove/{productId}`

---

# 🎟 COUPON APIs

---

## ✅ Apply Coupon

**POST** `/cart/apply-coupon`

### Request

```json
{
  "couponCode": "BLACKFRIDAY"
}
```

---

## ✅ Remove Coupon

**DELETE** `/cart/remove-coupon`

---

# 🧾 CHECKOUT API

---

## ✅ Checkout Summary

**GET** `/cart/checkout`

### Response

```json
{
  "items": [
    {
      "productName": "Laptop",
      "quantity": 2,
      "price": 50000,
      "subtotal": 100000
    }
  ],
  "appliedCoupon": "BLACKFRIDAY",
  "totalAmount": 75000
}
```

---

# 🧑‍💼 ADMIN COUPON MANAGEMENT

---

## ✅ Create Coupon (ADMIN)

**POST** `/coupons`

### Request

```json
{
  "code": "BLACKFRIDAY",
  "discountPercentage": 25,
  "expiryDate": "2026-12-31",
  "categoryId": 1
}
```

---

## ✅ Get All Coupons (ADMIN)

**GET** `/coupons`

---

# ⚠️ ERROR RESPONSE FORMAT

All errors follow standard format:

```json
{
  "timestamp": "2026-02-25T10:00:00",
  "status": 400,
  "message": "Error message",
  "path": "/api/cart/add"
}
```

---

# ✅ ROLE ACCESS SUMMARY

| API                | USER | ADMIN |
| ------------------ | ---- | ----- |
| View Products      | ✅    | ✅     |
| Cart Operations    | ✅    | ❌     |
| Checkout           | ✅    | ❌     |
| Product Management | ❌    | ✅     |
| Coupon Management  | ❌    | ✅     |

---

# 🧩 Integration Notes (Frontend Team)

* Store JWT token after login.
* Send token in every protected request.
* Do not send userId manually.
* Backend identifies user via JWT.

---

# 📌 Environment

Backend Port: **8080**
Frontend Port: **3000**

---

## 👨‍💻 Maintained By

Backend Team — E-Commerce Internship Project
