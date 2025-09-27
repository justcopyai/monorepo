# E2B Template for JustCopy.ai Fullstack Skeleton
# This Dockerfile creates a pre-built template with all dependencies installed
# to enable instant deployment without npm install delays

FROM node:18-bullseye

# Set working directory
WORKDIR /home/user

# Install system dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    git \
    curl \
    wget \
    vim \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Create app directory structure
RUN mkdir -p /home/user/app/backend /home/user/app/frontend

# Copy package.json files first for better Docker layer caching
COPY backend/package.json /home/user/app/backend/
COPY frontend/package.json /home/user/app/frontend/

# Install backend dependencies
WORKDIR /home/user/app/backend
RUN npm install --production=false

# Install frontend dependencies
WORKDIR /home/user/app/frontend
RUN npm install --production=false

# Copy all application files
WORKDIR /home/user/app
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Create user if it doesn't exist
RUN id -u user >/dev/null 2>&1 || useradd -m user

# Set proper permissions
RUN chown -R user:user /home/user/app

# Create startup script
RUN echo '#!/bin/bash\n\
cd /home/user/app\n\
echo "🚀 Starting JustCopy Fullstack Skeleton..."\n\
echo "📁 Backend: Express.js + SQLite + JWT Auth"\n\
echo "📁 Frontend: Next.js 14 + React 18 + Tailwind CSS"\n\
echo ""\n\
# Start backend in background\n\
cd backend && npm start &\n\
BACKEND_PID=$!\n\
echo "✅ Backend started (PID: $BACKEND_PID)"\n\
SANDBOX_ID="${E2B_SANDBOX_ID:-sandbox}"\n\
echo "🔗 Backend API: https://3001-${SANDBOX_ID}.e2b.dev"\n\
echo ""\n\
# Start frontend\n\
cd ../frontend\n\
echo "✅ Starting frontend..."\n\
echo "🔗 Frontend: https://3000-${SANDBOX_ID}.e2b.dev"\n\
echo ""\n\
echo "✨ Your application will be accessible at the URLs above once E2B sandbox is ready"\n\
npm run dev\n\
' > /home/user/start-fullstack.sh

RUN chmod +x /home/user/start-fullstack.sh

# Switch to user
USER user

# Set working directory back to user home
WORKDIR /home/user/app

# Default command - just keep container running
CMD ["tail", "-f", "/dev/null"]