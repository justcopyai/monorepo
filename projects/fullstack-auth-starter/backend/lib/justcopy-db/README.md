# @justcopy/database

Database client for JustCopy published applications. Provides authentication and data persistence with zero configuration.

## Features

- 🔐 **Built-in Authentication** - Register, login, logout, token verification
- 💾 **Persistent Storage** - Data survives container restarts
- 🚀 **Zero Configuration** - Works out of the box with environment variables
- 🔍 **Indexed Queries** - Fast lookups with automatic index selection
- 🛡️ **Access Control** - User-scoped data isolation
- ⚡ **Fluent API** - Chainable query builder

## Installation

```bash
npm install @justcopy/database
```

## Quick Start

```javascript
const { JustCopyDB } = require('@justcopy/database');

// Initialize (auto-configured from environment variables)
const db = new JustCopyDB();

// Define your table schemas
await db.defineTable('users', {
  indexes: {
    email: 'unique',    // Fast email lookups
    status: 'filter'    // Filter by status
  }
});

await db.defineTable('items', {
  indexes: {
    userId: 'filter',
    status: 'filter'
  }
});
```

## Authentication

### Register User

```javascript
const result = await db.auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  name: 'John Doe'
});

// Returns: { user: { id, email, name }, token: "..." }
```

### Login

```javascript
const result = await db.auth.login({
  email: 'user@example.com',
  password: 'securepassword'
});

// Returns: { user: { id, email, name }, token: "..." }
```

### Verify Token

```javascript
const user = await db.auth.verify(token);
// Returns: { userId, email, name } or null if invalid
```

### Logout

```javascript
await db.auth.logout(token);
```

## Database Operations

### Insert

```javascript
const item = await db.table('items').insert({
  title: 'My Item',
  description: 'Item description',
  userId: user.userId,
  status: 'active'
});
```

### Query with Index

```javascript
// Query by userId (uses index)
const userItems = await db.table('items')
  .where('userId', user.userId)
  .get();

// Query by status (uses index)
const activeItems = await db.table('items')
  .where('status', 'active')
  .get();
```

### Get Single Record

```javascript
// By ID
const item = await db.table('items').find(itemId);

// First match
const item = await db.table('items')
  .where('userId', user.userId)
  .first();
```

### Update

```javascript
const updated = await db.table('items')
  .where('id', itemId)
  .update(user.userId, {
    title: 'Updated Title',
    description: 'Updated description'
  });
```

### Delete

```javascript
await db.table('items')
  .where('id', itemId)
  .delete(user.userId);
```

### Filter Results

```javascript
// Combine indexed query with filter
const items = await db.table('items')
  .where('userId', user.userId)  // Uses index
  .filter('status', 'active')    // Filters results
  .limit(10)
  .get();
```

## Express.js Integration

```javascript
const express = require('express');
const { JustCopyDB } = require('@justcopy/database');

const app = express();
const db = new JustCopyDB();

// Authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await db.auth.verify(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await db.auth.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await db.auth.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Protected routes
app.get('/api/items', authenticate, async (req, res) => {
  const items = await db.table('items')
    .where('userId', req.user.userId)
    .get();
  res.json(items);
});

app.post('/api/items', authenticate, async (req, res) => {
  const item = await db.table('items').insert({
    ...req.body,
    userId: req.user.userId
  });
  res.status(201).json(item);
});
```

## Configuration

The client is auto-configured from environment variables (injected by JustCopy):

```bash
JUSTCOPY_API_URL=https://api.justcopy.ai/api/customer-backend
JUSTCOPY_API_KEY=jc_proj_abc123_...
PROJECT_ID=abc123
```

Or configure manually:

```javascript
const db = new JustCopyDB({
  apiUrl: 'https://api.justcopy.ai/api/customer-backend',
  apiKey: 'jc_proj_abc123_...',
  projectId: 'abc123'
});
```

## Table Indexes

Each table supports up to **3 indexed fields** for fast queries:

- **idx1**: Primary lookup field (e.g., email, username)
- **idx2**: Secondary filter field (e.g., status, category)
- **Built-in**: `userId` and `createdAt` are always indexed

Fields not indexed will still work but queries may be slower.

## API Reference

### JustCopyDB

- `constructor(config?)` - Create new client
- `defineTable(name, schema)` - Define table schema with indexes
- `table(name)` - Get query builder for table
- `auth` - Auth client instance

### Auth Client

- `register({ email, password, name })` - Register new user
- `login({ email, password })` - Login user
- `verify(token)` - Verify token and get user
- `logout(token)` - Invalidate token
- `me(token)` - Get current user (alias for verify)

### Table Query

- `where(field, value)` - Add indexed query condition
- `filter(field, value)` - Add filter condition
- `limit(count)` - Limit results
- `get()` - Execute query and get all results
- `first()` - Get first result
- `find(id)` - Get record by ID
- `insert(data)` - Insert new record
- `update(userId, data)` - Update record
- `delete(userId)` - Delete record
- `count()` - Count results

## License

MIT
