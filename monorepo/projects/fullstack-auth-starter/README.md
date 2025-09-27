# 🚀 Fullstack Skeleton

A beautiful, production-ready fullstack application with Next.js frontend, Express backend, SQLite database, and JWT authentication.

## ✨ Features

- **Next.js 14** - Modern React with App Router
- **Express.js** - Fast, minimal web framework
- **SQLite** - Lightweight, serverless database
- **JWT Authentication** - Secure user auth system
- **Docker Compose** - Easy deployment and development
- **TailwindCSS** - Beautiful, responsive UI
- **Framer Motion** - Smooth animations
- **TypeScript** - Type-safe development

## 🏃‍♂️ Quick Start

### Using Docker Compose (Recommended for E2B)

```bash
# Start both frontend and backend
docker-compose up --build

# Frontend will be available at http://localhost:3000
# Backend API at http://localhost:3001
```

### Manual Setup

1. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend Setup**
```bash
cd frontend  
npm install
npm run dev
```

## 🔗 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile (protected)
- `GET /api/projects` - List user projects (protected)
- `POST /api/projects` - Create new project (protected)

## 🛠 Environment Variables

Create `.env` files in backend directory:

```env
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=sqlite:./data/database.sqlite
```

## 🎨 UI Features

- Animated landing page with gradient backgrounds
- Glass morphism design elements
- Responsive authentication modals
- Interactive project dashboard
- Smooth page transitions
- Mobile-friendly design

## 📁 Project Structure

```
fullstack-skeleton/
├── docker-compose.yml
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
└── backend/
    ├── src/
    │   └── index.js
    ├── Dockerfile
    └── package.json
```

## 🚀 Deployment

Perfect for deployment on:
- **E2B Sandboxes** - Direct Docker Compose support
- **Vercel** - Frontend deployment
- **Railway/Render** - Backend deployment
- **Docker** - Any container platform

## 🔐 Authentication Flow

1. User registers/logs in via modal
2. JWT token stored in localStorage
3. Token sent in Authorization header
4. Backend validates token for protected routes
5. User can create and manage projects

## 🎯 Development

- **Hot reload** - Both frontend and backend support live reloading
- **Type safety** - Full TypeScript support in frontend
- **Linting** - ESLint configuration included
- **Database** - SQLite with automatic table creation

---

Built with ❤️ for rapid prototyping and production deployment!