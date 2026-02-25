# 🛒 E-Commerce Application with Coupon Management System

## 📌 Project Overview

This project is a **Role-Based E-Commerce Backend Application** developed using **Spring Boot** and **MySQL**, implementing real-world shopping cart and coupon management functionality.

The system supports two types of users:

* **Admin** – Manages products, categories, and promotional coupons.
* **User** – Browses products, manages cart, applies coupons, and performs checkout.

The application follows **clean architecture principles**, **JWT-based authentication**, and **industry-standard backend design practices**.

---

## 🚀 Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring Data JPA
* Spring Security
* JWT Authentication

### Database

* MySQL

### Tools

* Maven
* Postman
* Git & GitHub

---

## 🏗️ System Architecture

The project follows a layered architecture:

Client → Controller → Service → Repository → Database

### Layers

**Controller Layer**

* Handles HTTP requests
* Performs validation
* Exposes REST APIs

**Service Layer**

* Contains business logic
* Cart calculations
* Coupon validation
* Checkout processing

**Repository Layer**

* Database interaction using JPA repositories

---

## 🔐 Authentication & Authorization

Implemented using **Spring Security + JWT**.

### Features

* Stateless Authentication
* Secure Password Encryption (BCrypt)
* Role-Based Access Control
* Method-Level Authorization

### Roles

* ROLE_ADMIN
* ROLE_USER

---

## 🗄️ Database Design

### User & Role

* One Role → Many Users
* Supports role-based authorization

### Product & Category

* One Category → Many Products

### Cart System

* One User → One Cart
* One Cart → Multiple Cart Items
* Cart persists after logout/login

### Coupon System

* Coupons linked to Categories
* One Cart can have one active coupon
* Category-based discount calculation

---

## 🛍️ Core Features

### ✅ Admin Features

* Manage Categories (CRUD)
* Manage Products (CRUD)
* Create & Manage Coupons
* Activate/Deactivate Coupons

### ✅ User Features

* User Registration & Login
* Persistent Shopping Cart
* Add/Update/Remove Products in Cart
* Stock Validation
* Apply Category-Based Coupons
* Checkout Summary

---

## 🎟️ Coupon Engine

Coupon validation includes:

* Coupon existence validation
* Active status check
* Expiry date validation
* Category eligibility validation
* Automatic recalculation of cart total
* Auto removal of invalid coupons

---

## 🧾 Checkout Flow

Checkout performs:

* Final stock validation
* Discount-aware total calculation
* Coupon verification
* Order-ready summary generation

---

## 🔄 API Highlights

### Authentication

POST /api/auth/register
POST /api/auth/login

### Products

GET /api/products
POST /api/products (Admin)
PUT /api/products/{id} (Admin)
DELETE /api/products/{id} (Admin)

### Cart

GET /api/cart
POST /api/cart/add
PUT /api/cart/update
DELETE /api/cart/remove/{productId}
POST /api/cart/apply-coupon
DELETE /api/cart/remove-coupon
GET /api/cart/checkout

### Coupons

POST /api/coupons (Admin)
GET /api/coupons (Admin)

---

## ⭐ Key Design Decisions

* DTO pattern used to prevent entity exposure
* JWT-based stateless authentication
* Persistent database-driven cart
* Price snapshot stored using `priceAtTime`
* Stock validated at both cart and checkout stages
* Category-based coupon strategy

---

## 📈 Future Enhancements

* Order Placement Module
* Payment Gateway Integration
* Email Notification System
* Admin Analytics Dashboard
* Inventory Auto Adjustment

---

## 📜 License

This project is developed for learning and internship evaluation purposes.
