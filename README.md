# 🌐 SocialFeed — Mini Social Post App

> 3W Full Stack Internship Assignment — Task 1

A full-stack social media feed app with accounts, posts (text + image), public feed, likes, and comments.

---

## 📁 Project Structure

```
social-app/
├── backend/
│   ├── models/
│   │   ├── User.js          ← username, email, bcrypt password
│   │   └── Post.js          ← text, image, likes[], comments[]
│   ├── routes/
│   │   ├── auth.js          ← POST /signup, /login
│   │   └── posts.js         ← GET /posts, POST create/like/comment, DELETE
│   ├── middleware/
│   │   └── auth.js          ← JWT verification
│   ├── uploads/             ← auto-created, stores uploaded images
│   ├── server.js            ← Express entry point
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js   ← global user state (JWT + user info)
│   │   ├── pages/
│   │   │   ├── Home.js          ← feed + create post
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   ├── components/
│   │   │   ├── Navbar.js        ← app bar with user info + logout
│   │   │   ├── PostCard.js      ← post display, like, comment
│   │   │   └── CreatePost.js    ← text + image upload form
│   │   ├── api.js               ← axios instance with JWT interceptor
│   │   ├── App.js               ← routes + MUI theme
│   │   └── index.js
│   ├── vercel.json          ← fixes React Router on Vercel
│   └── .env.example
│
├── render.yaml              ← one-click Render deployment config
└── README.md
```

---

## ✅ Requirements Checklist (PDF)

| Requirement | Status |
|---|---|
| Signup with email + password | ✅ |
| Login with email + password | ✅ |
| Store user details in MongoDB | ✅ |
| Create post with text | ✅ |
| Create post with image | ✅ |
| Either text or image is enough (not both mandatory) | ✅ |
| Public feed — all posts from all users | ✅ |
| Display username on each post | ✅ |
| Display post content | ✅ |
| Display likes count | ✅ (labeled "X Likes") |
| Display comments count | ✅ (labeled "X Comments") |
| Like a post | ✅ |
| Comment on a post | ✅ |
| Save usernames of people who liked | ✅ (shown in tooltip chip) |
| Save usernames of people who commented | ✅ |
| Like/comment updates reflect instantly (no page reload) | ✅ |
| Only 2 MongoDB collections | ✅ (users + posts) |
| React.js frontend | ✅ |
| Node.js + Express backend | ✅ |
| MongoDB database | ✅ |
| Material UI styling | ✅ |
| No TailwindCSS | ✅ |
| Pagination | ✅ (Load More, 10 posts/page) |
| Responsive layout | ✅ |
| Clean + modern UI | ✅ |
| Well-structured, reusable components | ✅ |
| Code comments | ✅ |
| Deployable to Vercel + Render + Atlas | ✅ |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- A free [MongoDB Atlas](https://cloud.mongodb.com) cluster

---

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd social-app

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

**Backend** → create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/socialapp
JWT_SECRET=some_long_random_secret
FRONTEND_URL=http://localhost:3000
```

**Frontend** → create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

---

### 3. Run Locally

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev
```

```bash
# Terminal 2 — Frontend (port 3000)
cd frontend && npm start
```

Visit → `http://localhost:3000`

---

## 🚀 Deployment Guide

### Step 1 — MongoDB Atlas (Database)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster
2. Database Access → Add user → set username + password
3. Network Access → Add IP `0.0.0.0/0` (allow all — required for Render)
4. Connect → Drivers → copy the URI like:
   `mongodb+srv://user:pass@cluster.mongodb.net/socialapp`

---

### Step 2 — Render (Backend)

1. Push code to a **public GitHub repo** with `backend/` and `frontend/` folders
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Environment Variables (add these):
   - `MONGO_URI` → your Atlas URI
   - `JWT_SECRET` → any random string
   - `FRONTEND_URL` → add after Vercel deploy (e.g. `https://yourapp.vercel.app`)
6. Deploy → copy the URL: `https://your-backend.onrender.com`

---

### Step 3 — Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
3. Environment Variables:
   - `REACT_APP_API_URL` → your Render backend URL (from Step 2)
4. Deploy → copy the URL → go back to Render and set `FRONTEND_URL` to this

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/posts?page=1&limit=10` | ❌ | Get paginated feed |
| POST | `/api/posts` | ✅ | Create post (multipart/form-data) |
| DELETE | `/api/posts/:id` | ✅ | Delete own post |
| POST | `/api/posts/:id/like` | ✅ | Toggle like on a post |
| POST | `/api/posts/:id/comment` | ✅ | Add comment to a post |

---

## 🗄️ MongoDB Collections (only 2)

**`users`**
```json
{ "_id", "username", "email", "password (hashed)", "createdAt" }
```

**`posts`**
```json
{
  "_id", "userId", "username",
  "text", "image",
  "likes": ["username1", "username2"],
  "comments": [{ "username", "userId", "text", "createdAt" }],
  "createdAt"
}
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Material UI (MUI), React Router v6, Axios |
| Backend | Node.js, Express.js, Multer (image uploads) |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Deploy | Vercel (frontend), Render (backend), MongoDB Atlas (DB) |
