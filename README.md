

# 🍴 Food Ordering System

## 📌 Overview
A full-stack food ordering application built with **React (TypeScript)** for the frontend and **FastAPI** for the backend. It supports role-based access for **customers** and **admins**, enabling cart management, order placement, and food item administration.

---

## 🚀 Features

### Customer
- Register and login with JWT authentication.
- Browse food items by category and availability.
- Add items to cart, increase/decrease quantity, and remove items.
- Place orders and track order status.

### Admin
- Manage food items (add, edit, delete).
- Toggle availability (AVAILABLE/UNAVAILABLE).
- View all orders and update their status.

---

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, CSS  
- **Backend**: FastAPI  
- **Database**: Configurable SQL/NoSQL  
- **Auth**: JWT tokens  

---

## 📂 Project Structure
```
frontend/
  src/
    components/
      NavBar.tsx
      CartItem.tsx
      OrderCard.tsx
      AdminFoodCard.tsx
    pages/
      Login.tsx
      Register.tsx
      CartPage.tsx
      AdminDashboard.tsx
    App.tsx
backend/
  main.py
  routers/
    auth.py
    user.py
    food_items.py
    order.py
```

---

## 🔑 API Endpoints

### Auth
- `POST /auth/token` → Login

### User
- `POST /user/` → Create customer  
- `POST /user/auth` → Create admin  
- `GET /user/` → Get user details  

### Food Items
- `GET /FoodItems/` → Get food items  
- `POST /FoodItems/` → Add food item  
- `PUT /FoodItems/?food_id={id}` → Update food item  
- `DELETE /FoodItems/?food_id={id}` → Delete food item  
- `PATCH /FoodItems/?food_id={id}&availablity_request={AVAILABLE|UNAVAILABLE}` → Update availability  

### Orders
- `POST /Order/` → Place order  
- `GET /Order/` → Get order details  
- `PATCH /Order/?order_id={id}&status={PLACED|PROCESSING|DELIVERED|CANCELLED}` → Update order status  

---

## ⚙️ Installation

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

---

## 📖 Usage
1. Register or login as a customer/admin.  
2. Customers can browse food items, add to cart, and place orders.  
3. Admins can manage food items and update order statuses.  




