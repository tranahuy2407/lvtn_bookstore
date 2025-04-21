# 📚 Bookstore Web App

This is a full-stack bookstore web application built with **Node.js**, **Express**, **MongoDB**, and **React**. It includes features such as user authentication, browsing books, placing orders, managing users, and more.

---

## 📁 Project Structure

. ├── server # Backend (Node.js + Express) │ └── .env # Environment variables (not committed) ├── frontend # Frontend (React + Vite) ├── docker-compose.yml ├── README.md

yaml
Sao chép
Chỉnh sửa

---

## ⚙️ Requirements

- Node.js (v18 or later)
- MongoDB (local or Atlas cluster)
- Docker + Docker Compose (for containerized deployment)

---

## 🚀 How to Run

### ✅ Option 1: Run Locally

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/bookstore-app.git
cd bookstore-app
2. Setup the Backend
bash
Sao chép
Chỉnh sửa
cd server
npm install
Create a .env file in the server directory with the following:

ini
Sao chép
Chỉnh sửa
PORT=5000
DB=mongodb+srv://<username>:<password>@<cluster-url>/test?retryWrites=true&w=majority
MAIL_ACCOUNT=your_email@gmail.com
MAIL_PASSWORD=your_app_password
3. Start the Backend
bash
Sao chép
Chỉnh sửa
npm start
4. Setup the Frontend
bash
Sao chép
Chỉnh sửa
cd ../frontend
npm install
npm run build
5. Start the Frontend (using a static server)
bash
Sao chép
Chỉnh sửa
npx serve -s dist -l 3000
Open your browser and visit: http://localhost:3000

🐳 Option 2: Run with Docker
1. Make sure .env file exists in the server directory
Example:

ini
Sao chép
Chỉnh sửa
PORT=5000
DB=mongodb+srv://<username>:<password>@<cluster-url>/test?retryWrites=true&w=majority
MAIL_ACCOUNT=your_email@gmail.com
MAIL_PASSWORD=your_app_password
2. Build and run with Docker Compose
bash
Sao chép
Chỉnh sửa
docker-compose up --build
3. Access the Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000

🛠 Technology Stack
Frontend: React, Vite, Redux Toolkit

Backend: Node.js, Express, Mongoose

Database: MongoDB Atlas

Mail Service: Nodemailer

Containerization: Docker, Docker Compose

👨‍💻 Author
Name: Huy Trần

Email: tranahuy247@gmail.com
