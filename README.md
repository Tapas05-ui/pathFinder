# PathFinder 🧭

> **AI-powered career companion for students and fresh graduates.**
> ChatGPT gives you advice and forgets you. PathFinder remembers your journey, tracks your growth, and evolves your roadmap as you do.

---

## 📸 Overview

PathFinder is a full-stack MERN application that helps students discover their ideal career path through a conversational AI experience. Instead of filling out forms, users have a natural chat with an AI mentor that understands their strengths, interests, and goals — then generates a personalized career roadmap with milestones, resources, and job links.

---

## ✨ Features

- 💬 **Conversational AI Onboarding** — No forms. Just a friendly chat that discovers who you are
- 🗺️ **Personalized Career Roadmap** — 2–3 career paths with 5 milestones each, tailored to you
- ✅ **Milestone Tracking** — Mark milestones complete, undo them, track your progress
- 📈 **Skill Growth Chart** — Visual chart showing your skill level over time
- 🔁 **Weekly Check-ins** — AI reviews your progress every week and gives specific guidance
- 🔔 **Check-in Reminder** — Dashboard reminds you when your weekly check-in is due
- 📚 **Resources + Job Links** — Every milestone has curated learning resources and job board links
- 🔐 **JWT Authentication** — Secure register/login with token-based auth
- 💾 **Persistent Memory** — Unlike ChatGPT, PathFinder remembers your entire journey

---

## 🛠️ Tech Stack

| Layer       | Technology                   |
| ----------- | ---------------------------- |
| Frontend    | React 18, Vite, Tailwind CSS |
| Backend     | Node.js, Express.js          |
| Database    | MongoDB, Mongoose            |
| AI          | OpenAI GPT-3.5 Turbo         |
| Auth        | JWT (JSON Web Tokens)        |
| HTTP Client | Axios                        |
| Fonts       | Syne, DM Sans (Google Fonts) |

---

## 🚀 Local Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API key → [platform.openai.com](https://platform.openai.com)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pathfinder.git
cd pathfinder
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

**Backend** — create `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/pathfinder
JWT_SECRET=your_long_random_secret_key_here
OPENAI_API_KEY=sk-proj-your-openai-key-here
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Frontend** — `client/.env` is already configured:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the project

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit: **http://localhost:5173**

---
