const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(dataDir, 'app.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Sessions table for persistent authentication
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Example data table
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Create default admin user if not exists
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (email, password, name) VALUES (?, ?, ?)`, 
    ['admin@example.com', defaultPassword, 'Admin User']);
  
  // Clean up expired sessions periodically
  setInterval(() => {
    db.run(`DELETE FROM sessions WHERE expires_at < datetime('now')`, (err) => {
      if (err) console.error('Error cleaning sessions:', err);
    });
  }, 60 * 60 * 1000); // Clean every hour
});

// Authentication middleware - check token from database
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Check if session exists and is valid
  db.get(
    `SELECT s.*, u.id as userId, u.email, u.name 
     FROM sessions s 
     JOIN users u ON s.user_id = u.id 
     WHERE s.token = ? AND s.expires_at > datetime('now')`,
    [token],
    (err, session) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!session) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Attach user info to request
      req.user = {
        userId: session.userId,
        email: session.email,
        name: session.name
      };
      next();
    }
  );
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Backend API',
    database: 'Connected'
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        const userId = this.lastID;
        const token = jwt.sign(
          { userId, email, name, timestamp: Date.now() },
          JWT_SECRET
        );

        // Store session in database (expires in 7 days)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        db.run(
          'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
          [token, userId, expiresAt],
          function(sessionErr) {
            if (sessionErr) {
              return res.status(500).json({ error: 'Failed to create session' });
            }

            res.status(201).json({
              message: 'User created successfully',
              token,
              user: { id: userId, email, name }
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a unique token
        const token = jwt.sign(
          { userId: user.id, email: user.email, name: user.name, timestamp: Date.now() },
          JWT_SECRET
        );

        // Store session in database (expires in 7 days)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        db.run(
          'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
          [token, user.id, expiresAt],
          function(sessionErr) {
            if (sessionErr) {
              return res.status(500).json({ error: 'Failed to create session' });
            }

            res.json({
              message: 'Login successful',
              token,
              user: { id: user.id, email: user.email, name: user.name }
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected routes - Items CRUD
app.get('/api/items', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.post('/api/items', authenticateToken, (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'INSERT INTO items (title, description, user_id) VALUES (?, ?, ?)',
    [title, description, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        description,
        user_id: req.user.userId,
        created_at: new Date().toISOString()
      });
    }
  );
});

app.put('/api/items/:id', authenticateToken, (req, res) => {
  const { title, description } = req.body;
  const itemId = req.params.id;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'UPDATE items SET title = ?, description = ? WHERE id = ? AND user_id = ?',
    [title, description, itemId, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ message: 'Item updated successfully' });
    }
  );
});

app.delete('/api/items/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;

  db.run(
    'DELETE FROM items WHERE id = ? AND user_id = ?',
    [itemId, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ message: 'Item deleted successfully' });
    }
  );
});

// User profile route
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, email, name, created_at FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    }
  );
});

// Auth me endpoint for checking current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, email, name FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    }
  );
});

// Logout endpoint - remove session from database
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  db.run(
    'DELETE FROM sessions WHERE token = ?',
    [token],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ message: 'Logged out successfully' });
    }
  );
});

// Alias /api/projects to /api/items for compatibility
app.get('/api/projects', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows || []);
    }
  );
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'INSERT INTO items (title, description, user_id) VALUES (?, ?, ?)',
    [title, description, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        description,
        user_id: req.user.userId,
        created_at: new Date().toISOString()
      });
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Default admin: admin@example.com / admin123`);
});