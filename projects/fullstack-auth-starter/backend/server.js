const express = require('express');
const { JustCopyDB } = require('./lib/justcopy-db');
const { JustCopyAuth } = require('./lib/justcopy-auth');
const { JustCopyStorage } = require('./lib/justcopy-storage');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize JustCopy clients (auto-configured from environment variables)
const db = new JustCopyDB();
const auth = new JustCopyAuth();
const storage = new JustCopyStorage();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database schemas
async function initializeDatabase() {
  try {
    // Define users table with email and status indexes
    await db.defineTable('users', {
      indexes: {
        email: 'unique',    // Fast email lookups for auth
        status: 'filter'    // Filter by user status
      }
    });

    // Define items table with userId and status indexes
    await db.defineTable('items', {
      indexes: {
        userId: 'filter',   // Filter by owner
        status: 'filter'    // Filter by status
      }
    });

    console.log('✅ Database schemas initialized');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    // Continue anyway - schemas might already exist
  }
}

// Authentication middleware - verifies JWT tokens
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = await auth.verify(token);
    if (!user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Backend API',
    database: 'JustCopy DB Connected'
  });
});

// ============================================
// AUTH ROUTES
// ============================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const result = await auth.register({ email, password, name });

    res.status(201).json({
      message: 'User created successfully',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.message.includes('already registered')) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await auth.login({ email, password });

    res.json({
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error.message.includes('Invalid credentials')) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user info
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// Logout endpoint - invalidate session
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    await auth.logout(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// ============================================
// ITEMS ROUTES (Protected)
// ============================================

app.get('/api/items', authenticateToken, async (req, res) => {
  try {
    const items = await db.table('items')
      .where('userId', req.user.userId)
      .get();

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/items', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const item = await db.table('items').insert({
      title,
      description,
      userId: req.user.userId,
      status: 'active'
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const itemId = req.params.id;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const item = await db.table('items')
      .where('id', itemId)
      .update(req.user.userId, {
        title,
        description,
        status: 'active'
      });

    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);

    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: 'You can only update your own items' });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;

    await db.table('items')
      .where('id', itemId)
      .delete(req.user.userId);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);

    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: 'You can only delete your own items' });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// USER PROFILE ROUTE
// ============================================

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    // User info is already in req.user from auth middleware
    res.json(req.user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// PROJECTS ROUTES (Alias for items)
// ============================================

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const items = await db.table('items')
      .where('userId', req.user.userId)
      .get();

    res.json(items || []);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const item = await db.table('items').insert({
      title,
      description,
      userId: req.user.userId,
      status: 'active'
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// FILE UPLOAD ROUTES (NEW - using @justcopy/storage)
// ============================================

app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const folder = req.body.folder || 'uploads';
    const isPublic = req.body.isPublic === 'true';
    const tags = req.body.tags ? req.body.tags.split(',') : [];

    console.log(`📤 Uploading file: ${req.file.originalname} (${req.file.size} bytes)`);

    const file = await storage.upload(req.file.buffer, {
      fileName: req.file.originalname,
      userId: req.user.userId,
      folder,
      isPublic,
      tags,
      metadata: {
        uploadedBy: req.user.email,
        uploadedAt: new Date().toISOString(),
      },
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file.id,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        folder: file.folder,
        tags: file.tags,
      },
    });
  } catch (error) {
    console.error('File upload error:', error);

    if (error.message.includes('quota exceeded')) {
      return res.status(413).json({ error: 'Storage quota exceeded' });
    }

    if (error.message.includes('not allowed')) {
      return res.status(400).json({ error: 'File type not allowed' });
    }

    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.get('/api/files', authenticateToken, async (req, res) => {
  try {
    const { folder, mimeType, tags, limit } = req.query;

    const { files, pagination } = await storage.list({
      userId: req.user.userId,
      folder: folder || undefined,
      mimeType: mimeType || undefined,
      tags: tags ? tags.split(',') : undefined,
      limit: limit ? parseInt(limit) : 20,
    });

    res.json({
      files,
      pagination,
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

app.get('/api/files/:fileId', authenticateToken, async (req, res) => {
  try {
    const file = await storage.get(req.params.fileId);

    res.json({
      file: {
        id: file.id,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        folder: file.folder,
        downloadUrl: file.downloadUrl,
        expiresAt: file.expiresAt,
        createdAt: file.createdAt,
      },
    });
  } catch (error) {
    console.error('Get file error:', error);

    if (error.message === 'File not found') {
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(500).json({ error: 'Failed to get file' });
  }
});

app.delete('/api/files/:fileId', authenticateToken, async (req, res) => {
  try {
    await storage.delete(req.params.fileId, req.user.userId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);

    if (error.message === 'File not found') {
      return res.status(404).json({ error: 'File not found' });
    }

    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: 'Unauthorized to delete this file' });
    }

    res.status(500).json({ error: 'Failed to delete file' });
  }
});

app.get('/api/files/quota', authenticateToken, async (req, res) => {
  try {
    const quota = await storage.getQuota();

    res.json({ quota });
  } catch (error) {
    console.error('Get quota error:', error);
    res.status(500).json({ error: 'Failed to get quota' });
  }
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

// Start server
(async () => {
  try {
    // Initialize database schemas
    await initializeDatabase();

    // Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`💾 Database: JustCopy DB (persistent)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
