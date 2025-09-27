# Fullstack Auth Starter

Production-ready fullstack template with Next.js, Express, SQLite, and JWT authentication.

## 🚀 Build & Deploy with JustCopy.ai

**Start FREE** - Unlimited development builds. Deploy when ready with tokens!

### How to use this template:

1. Go to [justcopy.ai](https://justcopy.ai)
2. Describe your app: "I need a fullstack app with authentication"
3. (Optional) Check "Use specific template" and enter:
   ```
   projects/fullstack-auth-starter
   ```
4. Chat with AI to customize
5. Test in free dev environment
6. Deploy with tokens when ready

### What You Get FREE:
- ✅ Full dev environment
- ✅ AI customization chat
- ✅ Unlimited testing
- ✅ Code export

### Premium Features (Use Tokens):
- 🚀 Production deployment
- ⚡ Custom domains
- 🔒 SSL certificates
- 📊 Analytics

**Get 100K tokens on signup + 50K per referral!**

**[Start Building Free →](https://justcopy.ai)**

## Features

- 🔐 **JWT Authentication** - Secure user auth with register/login
- ⚡ **Next.js 14** - Modern React with App Router
- 🚀 **Express.js** - Fast, minimal backend
- 💾 **SQLite** - Lightweight, serverless database
- 🎨 **TailwindCSS** - Beautiful, responsive UI
- 🌊 **Framer Motion** - Smooth animations
- 📱 **Mobile Responsive** - Works on all devices

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State**: React Hooks

### Backend
- **Framework**: Express.js
- **Database**: SQLite
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Express middleware
- **Security**: bcrypt, cors

## Project Structure

```
fullstack-auth-starter/
├── frontend/
│   ├── app/
│   │   ├── components/    # Reusable UI components
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
└── backend/
    ├── src/
    │   └── index.js       # Express server & API
    ├── data/              # SQLite database
    └── package.json       # Backend dependencies
```

## Quick Start

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend  
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/user/profile` | Get user profile | Yes |
| GET | `/api/projects` | List user projects | Yes |
| POST | `/api/projects` | Create new project | Yes |

## Environment Variables

Create `.env` in backend directory:

```env
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=sqlite:./data/database.sqlite
PORT=3001
```

## UI Features

- 🎨 Glass morphism design
- 🌈 Animated gradient backgrounds
- 📱 Responsive authentication modals
- 📊 Interactive dashboard
- ⚡ Smooth page transitions
- 🔐 Protected routes

## Authentication Flow

1. User registers/logs in via modal
2. JWT token stored in localStorage
3. Token sent in Authorization header
4. Backend validates token
5. Access to protected routes granted

## What You Can Customize on JustCopy.ai

- Company branding and colors
- Add more database tables
- Integrate payment processing
- Add email notifications
- Social login (Google, GitHub)
- Admin dashboard
- API rate limiting
- File uploads

Just chat with the AI and it handles everything!

## 🤝 Contributing to Monorepo

Want to improve this template or add your own? We love contributions!

### Quick Contribution Guide:
1. **Fork** the monorepo
2. **Improve** this template or add new ones
3. **Submit PR** with clear description
4. **Get featured** as a contributor

### Benefits for Contributors:
- 🌟 Get credited in the repo
- 📈 Your templates help thousands of developers
- 💰 Earn referral tokens when users use your templates
- 🏆 Top contributors get premium JustCopy.ai access

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

**💡 Pro Tip:** Share your referral link when you contribute! You'll earn 50K tokens for each developer who signs up through your templates.

**[Start Contributing →](https://github.com/justcopyai/monorepo)** | **[Join Discord →](https://discord.gg/4yRrqHqG6W)**

---

**Ready to ship?** Visit [justcopy.ai](https://justcopy.ai) → Describe or paste path → Deploy in minutes!