# 🚀 SK System Backend  
**Express + Prisma + MySQL**

Backend API for **SK System**, built with **Express.js**, **Prisma ORM**, **MySQL**, and **JWT Authentication**.  
Supports **Role-Based Access Control (RBAC)**, **Budgeting**, **Procurement**, **Approval Workflow**, and **System Settings**.

---

## 🛠 Tech Stack

- Node.js (v18+)
- Express.js
- Prisma ORM
- MySQL
- JWT Authentication
- bcrypt
- ES Modules

---

## 📁 Project Structure

```
sk_system_backend/
├─ prisma/
│  ├─ schema.prisma
│  ├─ seed.js
│  └─ prisma.config.ts
├─ src/
│  ├─ controllers/
│  ├─ services/
│  ├─ routes/
│  ├─ middlewares/
│  ├─ constants/
│  │  └─ permission.constant.js
│  ├─ config/
│  │  └─ db.config.js
│  └─ app.js
├─ server.js
├─ .env
├─ package.json
└─ README.md
```

---

## ✅ Prerequisites

- Node.js **v18+**
- MySQL **v8+**
- npm or yarn

---

## 📦 Installation Guide
```bash
git clone https://github.com/MariaApple17/skbackend.git
cd skbackend
```

### 1️⃣ Clone the Repository


### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables
#DATABASE_URL="mysql://root@localhost:3306/sk_system_db" 

DATABASE_URL='postgresql://neondb_owner:npg_7whP0XJMQVrm@ep-red-dream-ahl1t49k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
PORT=3001
NODE_ENV=development

JWT_SECRET="pjpiyte64e879-yy"
JWT_EXPIRES_IN="1d"

BCRYPT_SALT_ROUNDS=10

## 🗄 Database Setup

```sql
CREATE DATABASE sk_system_db;
```

---

## 🧬 Prisma Setup & Migration

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## 🌱 Database Seeding

Default SUPER ADMIN is created.

```
Email: admin@system.local
Password: Admin@12345
Role: SUPER_ADMIN
```

```bash
npx prisma db seed
```

---

## ▶️ Running the Server

```bash
npm run dev
```

Server:
```
http://localhost:3001
```

---

## 🔐 Authentication

```
Authorization: Bearer <token>
```

---

## 🚀 Production Notes

- Change default admin password
- Use strong secrets
- Enable rate limiting

---

## 📌 Common Commands

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```
