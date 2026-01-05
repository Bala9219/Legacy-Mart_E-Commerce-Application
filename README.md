## 🛍️ Legacy-Mart — E-Commerce Application
Legacy-Mart is a full-stack e-commerce application consisting of:

• Frontend — React + Vite
• Backend — Java + Spring Boot (REST APIs, JPA, Hibernate, MySQL)
• Order Management
• Checkout & Payment Status Flow
• Order Timeline & Tracking
• User Order History

# This project is structured as two separate modules:
├── frontend/   → React Web App
└── backend/    → Java + Spring Boot REST API

# Features: 
• Customer Features
• Browse products
• Add to cart & place order
• Checkout flow
• Delivery address support
• Payment Checkout using card
• View order details
• Profile page to save details
• Order timeline tracking
• Order status support:
    • PAYMENT_PENDING
    • PAID
    • SHIPPED
    • CANCELLED
    • PLACED
    • PAYMENT_FAILED
    • DELIVERED
• Admin Features
• Able change the time-line history and order history of the orders
• CRUD operations like:
  • Add product
  • Update product
  • Delete Product
  • Edit stock quantity of the product

# Order Details Features:
• Order summary
• Item list
• Delivery address
• Payment status
• Order history timeline
• Conditional payment retry button

# Backend Features:
• Spring Boot REST APIs
• JPA / Hibernate entities
• MySQL database
• Order item mapping
• Status transitions
• Place orders
• Stock quantity management
• Timestamp tracking
• Delivery address mapping
• JWT Authentication & Authorization
• Payment integration using Stripe payment gateway
• Login and Register features

# Tech Stack
# Frontend:
• React (Vite)
• React Router
• Axios
• IDE: VS Code

# Backend:
• Java + Spring Boot
• Spring Data JPA
• Hibernate
• JDBC
• MySQL Workbench
• IDE: IntelliJ Idea

# How to run this project:
• Backend — Run Locally
  >>> mvn clean install
  >>> mvn spring-boot:run
• Server runs at: http://localhost:8080

• Frontend — Run Locally
  >>> npm install
  >>> npm run dev
• Server runs at: http://localhost:5173

# License:
This project is for learning & personal development.
You may modify or extend it as needed.

