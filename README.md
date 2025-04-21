# 📚 Bookstore Web App

This is a full-stack bookstore web application built with **Node.js**, **Express**, **MongoDB**, and **React**. It includes features such as user authentication, browsing books, placing orders, managing users, and more.

---

## 📁 Project Structure

. ├── server # Backend (Node.js + Express)
│ └── .env
  └── index.js
  └── routers
  │ └── ...
  └── models
  │ └── ...
   └── middlewares
  │ └── ...
  └── index.js
  └── Dockerfile
  
├── frontend # Frontend (React + Vite) 
  │ └── .env
    └── Dockerfile
    └── ...
├── docker-compose.yml 

## ⚙️ Requirements

- Node.js (v18 or later)
- MongoDB (local or Atlas cluster)
- Docker + Docker Compose (for containerized deployment)

---

## 🚀 How to Run

### ✅ Option 1: Run Locally

#### 1. Clone the repository

git clone https://github.com/tranahuy2407/lvtn_bookstore.git
cd lvtn_bookstore

2. Setup the Backend
cd server
npm install
npm run dev
3. Setup the Frontend
4. 
cd ../frontend
npm install
npm run dev

### 🐳 Option 2: Run with Docker
1. Build and run with Docker Compose 
docker-compose up --build
2. Access the Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000

### 🛠 Technology Stack
Frontend: React, Vite, Redux Toolkit

Backend: Node.js, Express, Mongoose

Database: MongoDB Atlas

Mail Service: Nodemailer

Containerization: Docker, Docker Compose
