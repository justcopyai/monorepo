# @justcopy/auth

Authentication client for JustCopy published applications. Provides user registration, login, and session management with zero configuration.

## Features

- 🔐 **User Registration** - Email/password signup with validation
- 🔑 **User Login** - Secure authentication with JWT tokens
- ✅ **Token Verification** - Validate and decode tokens
- 🚪 **Logout** - Session invalidation
- 🛡️ **Zero Configuration** - Works out of the box with environment variables
- ⚡ **Lightweight** - Minimal dependencies, fast performance

## Installation

```bash
npm install @justcopy/auth
```

## Quick Start

```javascript
const { JustCopyAuth } = require('@justcopy/auth');

// Initialize (auto-configured from environment variables)
const auth = new JustCopyAuth();

// Register a new user
const { user, token } = await auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  name: 'John Doe'
});

console.log('User registered:', user);
console.log('Auth token:', token);
```

## API Reference

### Constructor

```javascript
const auth = new JustCopyAuth(config);
```

**Config Options:**
- `apiUrl` - API base URL (default: `process.env.JUSTCOPY_API_URL`)
- `apiKey` - Project API key (default: `process.env.JUSTCOPY_API_KEY`)
- `applicationId` - Application ID (default: `process.env.APPLICATION_ID`)

### Register User

```javascript
const result = await auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  name: 'John Doe'
});

// Returns: { user: { userId, email, name }, token: "jwt-token..." }
```

### Login

```javascript
const result = await auth.login({
  email: 'user@example.com',
  password: 'securepassword'
});

// Returns: { user: { userId, email, name }, token: "jwt-token..." }
```

### Verify Token

```javascript
const user = await auth.verify(token);
// Returns: { userId, email, name } or null if invalid
```

### Get Current User

```javascript
const user = await auth.me(token);
// Alias for verify() - Returns: { userId, email, name } or null
```

### Logout

```javascript
await auth.logout(token);
// Invalidates the token on the server
```

## Express.js Integration

```javascript
const express = require('express');
const { JustCopyAuth } = require('@justcopy/auth');

const app = express();
const auth = new JustCopyAuth();

// Authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await auth.verify(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await auth.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await auth.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/auth/logout', authenticate, async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  await auth.logout(token);
  res.json({ message: 'Logged out successfully' });
});

// Protected route
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

## Next.js Integration

```javascript
// app/lib/api.ts
import { JustCopyAuth } from '@justcopy/auth';

const auth = new JustCopyAuth({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  apiKey: process.env.NEXT_PUBLIC_API_KEY
});

export async function loginUser(email: string, password: string) {
  const { user, token } = await auth.login({ email, password });
  localStorage.setItem('auth_token', token);
  return user;
}

export async function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  return await auth.verify(token);
}
```

## Configuration

The client is auto-configured from environment variables (injected by JustCopy):

```bash
JUSTCOPY_API_URL=https://api.justcopy.ai/api/customer-backend
JUSTCOPY_API_KEY=jc_app_abc123_...
APPLICATION_ID=abc123
```

Or configure manually:

```javascript
const auth = new JustCopyAuth({
  apiUrl: 'https://api.justcopy.ai/api/customer-backend',
  apiKey: 'jc_app_abc123_...',
  applicationId: 'abc123'
});
```

## Error Handling

```javascript
try {
  const result = await auth.login({ email, password });
  console.log('Login successful:', result.user);
} catch (error) {
  if (error.message.includes('Invalid credentials')) {
    console.error('Wrong email or password');
  } else if (error.message.includes('not found')) {
    console.error('User does not exist');
  } else {
    console.error('Login failed:', error.message);
  }
}
```

## Security Features

- **Bcrypt password hashing** - Server-side secure password storage
- **JWT tokens** - Stateless authentication with expiration
- **Application-scoped** - Isolated by applicationId
- **Session management** - Token invalidation on logout
- **Auto-expiration** - Tokens expire after 24 hours (configurable)

## Works With

- **@justcopy/database** - Data persistence
- **@justcopy/storage** - File uploads
- Any Express.js or Next.js application

## License

MIT
