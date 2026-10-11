# 🚀 VYUGAM AI HACKATHON PLATFORM (2026)

> **Enterprise-grade, high-concurrency hackathon management & evaluation arena inspired by Smart India Hackathon (SIH), built for Sri Eshwar College of Engineering.**

---

## ⚡ Overview

**Vyugam AI Hackathon Platform** is a full-stack, gamified hackathon platform architected to smoothly handle 3,000+ concurrent students, evaluators, and jury members. It features:
- **Gamified Cyber UI**: Neon-accented HUD components, responsive grids, and interactive roadmap timelines.
- **Squad Formation**: Team creation locked to **teams of 4 students** with official `@sece.ac.in` domain verification.
- **10 Innovation Sectors & Arenas**: 50+ industry-curated problem statements across AI, HealthTech, CyberSecurity, IoT, AgriTech, FinTech, and Clean Energy.
- **Battle-Tested Evaluation**: Multi-criteria rubrics (Innovation, Feasibility, Tech Stack, Presentation) with live scoring and jury dashboards.
- **Cloud Database (Supabase PostgreSQL) + Local SQLite WAL Fallback**: Dual-layer architecture ensuring 99.99% uptime and zero bottleneck under massive submission traffic.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Grid Cyber HUD Borders
- **Icons & Visuals**: [Lucide React](https://lucide.dev/), Canvas Particle Matrix, Confetti Canvas
- **Routing**: [React Router DOM v7](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Server Framework**: [Express.js](https://expressjs.com/)
- **Caching & Concurrency**: [NodeCache](https://github.com/node-cache/node-cache) + gzip compression
- **Rate Limiting**: `express-rate-limit` (1000 req / 15 min per IP)
- **Authentication**: JWT token verification + `bcryptjs` password hashing

### Database & Storage
- **Production Primary**: [Supabase PostgreSQL](https://supabase.com/) with Row Level Security (RLS)
- **Local Cache / Fallback**: SQLite with Write-Ahead Logging (`WAL` mode)

---

## 📁 Repository Structure

```
vyugam-ai-hackathon/
├── .env.example              # Root environment template
├── .gitignore                # Production gitignore (secrets & builds excluded)
├── Dockerfile                # Multi-stage production container build
├── Procfile                  # Cloud deployment process file (Render/Railway/Heroku)
├── render.yaml               # Infrastructure-as-Code manifest for Render
├── requirements.txt          # Python dependencies for AI evaluators & pipelines
├── package.json              # Monorepo management scripts
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Auth, Admin, Teams, Problems, Submissions
│   │   ├── routes/           # RESTful API endpoints
│   │   ├── middleware/       # Auth guards & rate limiters
│   │   ├── database.js       # SQLite + Supabase dual adapter
│   │   ├── supabaseClient.js # Supabase cloud connection
│   │   ├── seed.js           # Default problem statements & mock data
│   │   └── server.js         # Express HTTP server
│   ├── supabase_schema.sql   # Complete Supabase PostgreSQL schema (9 tables)
│   ├── .env.example          # Backend environment variables template
│   └── package.json          # Backend dependencies
│
└── frontend/
    ├── src/
    │   ├── components/       # UI, Landing, Navbar, Footer, Chatbot
    │   ├── context/          # AuthContext & State management
    │   ├── pages/            # FAQPage, ContactPage, Dashboards
    │   └── services/         # API & Supabase data services
    ├── public/               # Logos, mascots, video assets
    ├── .env.example          # Frontend environment variables template
    ├── vercel.json           # Vercel SPA routing rules
    ├── vite.config.ts        # Vite configuration
    └── package.json          # Frontend dependencies
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/KungumapriyaaMKP/vyugam-ai-hackathon.git
cd vyugam-ai-hackathon
```

### 3. Install Dependencies
```bash
npm run setup
```
*(Installs both `backend/` and `frontend/` packages)*

### 4. Configure Environment Variables
Copy the `.env.example` templates to `.env`:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```
Fill in your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in both `.env` files.

### 5. Start the Development Servers
In two separate terminals:

```bash
# Terminal 1: Backend API (port 5000)
npm run dev:backend

# Terminal 2: Frontend Client (port 3000)
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase)

The platform comes with a complete cloud schema in [`backend/supabase_schema.sql`](backend/supabase_schema.sql) covering all 9 tables:
1. `users` (Students, Mentors, Evaluators, Admins)
2. `problem_statements` (Industry problem statements, sectors, descriptions)
3. `teams` (Squad names, leader references, codes)
4. `team_members` (Squad members, role, department)
5. `submissions` (Abstracts, GitHub links, decks, live demos)
6. `evaluations` (Scores, feedback, criteria breakdowns)
7. `announcements` (Live ticker announcements)
8. `contact_messages` (Student inquiries & contact form)
9. `password_resets` (6-digit OTP verification)

To initialize or reset Supabase:
1. Open your Supabase project's **SQL Editor**.
2. Paste the contents of `backend/supabase_schema.sql` and run.
3. Sync local seed data with:
   ```bash
   cd backend && npm run sync:supabase
   ```

---

## 🌐 Production Deployment

### Option A: Vercel (Frontend) + Render / Railway (Backend)
1. **Frontend on Vercel**:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Set Environment Variables: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
2. **Backend on Render / Railway**:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Set Environment Variables: `PORT`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_ANON_KEY`

### Option B: Unified Full-Stack Deploy on Render
Connect this repository to Render using Blueprint (`render.yaml`):
- Render will build the React frontend and serve both the API and the single-page application under one unified domain.

### Option C: Docker Container
```bash
docker build -t vyugam-platform .
docker run -p 5000:5000 --env-file backend/.env vyugam-platform
```

---

## 🔒 Security Best Practices
- `@sece.ac.in` domain validation for Sri Eshwar College students.
- Rate limiters to prevent brute-force login and API flooding.
- Passwords hashed using standard `bcryptjs` salt rounds.
- Real API keys and credentials are systematically excluded via `.gitignore`.

---

## 🤝 Contributing & License
Developed for the **Vyugam AI Hackathon 2026** by the Vyugam Development Team.  
Licensed under the [ISC License](LICENSE).
