# @justcopy/storage

Storage client for JustCopy published applications. Provides persistent file storage with zero configuration.

## Features

- 📁 **Persistent Storage** - Files survive container restarts
- 🚀 **Zero Configuration** - Works out of the box with environment variables
- 🔒 **Secure** - Presigned URLs for downloads, application-scoped isolation
- 🏷️ **Rich Metadata** - Tags, folders, custom metadata
- 📊 **Quota Management** - Built-in storage limits and tracking
- ⚡ **Fast Uploads** - Multipart support for large files

## Installation

```bash
npm install @justcopy/storage
```

## Quick Start

```javascript
const { JustCopyStorage } = require('@justcopy/storage');

// Initialize (auto-configured from environment variables)
const storage = new JustCopyStorage();

// Upload a file
const file = await storage.upload(fileBuffer, {
  fileName: 'photo.jpg',
  userId: user.id,
  folder: 'avatars',
  isPublic: false,
  tags: ['profile', 'verified']
});

console.log(`File uploaded: ${file.id}`);
console.log(`Download URL: ${await storage.getUrl(file.id)}`);
```

## API Reference

### Constructor

```javascript
const storage = new JustCopyStorage(config);
```

**Config Options:**
- `apiUrl` - API base URL (default: `process.env.JUSTCOPY_API_URL`)
- `apiKey` - Project API key (default: `process.env.JUSTCOPY_API_KEY`)
- `applicationId` - Application ID (default: `process.env.APPLICATION_ID`)

### Upload File

```javascript
const file = await storage.upload(fileData, options);
```

**Parameters:**
- `fileData` - `Buffer` (Node.js) or `Blob` (Browser)
- `options` - Upload options:
  - `fileName` (required) - Original file name
  - `userId` (required) - User ID who owns the file
  - `folder` - Optional folder path (e.g., "avatars", "documents")
  - `isPublic` - Public access (default: `false`)
  - `generateThumbnails` - Generate image thumbnails (default: `false`)
  - `tags` - Array of tags (e.g., `['profile', 'verified']`)
  - `metadata` - Custom metadata object

**Returns:**
```javascript
{
  id: 'file-uuid',
  name: 'photo.jpg',
  size: 102400,
  mimeType: 'image/jpeg',
  folder: 'avatars',
  isPublic: false,
  tags: ['profile'],
  createdAt: '2025-10-08T12:00:00Z'
}
```

### Get Download URL

```javascript
const url = await storage.getUrl(fileId);
```

Returns a presigned URL valid for 1 hour.

### Get File Metadata

```javascript
const file = await storage.get(fileId);
```

**Returns:**
```javascript
{
  id: 'file-uuid',
  name: 'photo.jpg',
  size: 102400,
  mimeType: 'image/jpeg',
  folder: 'avatars',
  downloadUrl: 'https://s3.amazonaws.com/presigned-url',
  expiresAt: '2025-10-08T13:00:00Z',
  createdAt: '2025-10-08T12:00:00Z',
  updatedAt: '2025-10-08T12:00:00Z'
}
```

### List Files

```javascript
const { files, pagination } = await storage.list(options);
```

**Options:**
- `userId` - Filter by user ID
- `folder` - Filter by folder path
- `mimeType` - Filter by MIME type (e.g., "image/jpeg")
- `tags` - Filter by tags (array)
- `limit` - Results per page (default: 20)
- `cursor` - Pagination cursor

**Returns:**
```javascript
{
  files: [
    { id, name, size, mimeType, folder, createdAt, ... }
  ],
  pagination: {
    nextCursor: 'base64-cursor',
    hasMore: true
  }
}
```

### Delete File

```javascript
await storage.delete(fileId, userId, options);
```

**Parameters:**
- `fileId` - File ID to delete
- `userId` - User ID (for ownership verification)
- `options` - Delete options:
  - `hard` - Permanent deletion (default: `false`, soft delete)

**Soft Delete (default):**
- File marked as deleted
- Removed after 30 days
- Can be recovered during grace period

**Hard Delete:**
- Immediate permanent deletion
- Cannot be recovered

### Get Storage Quota

```javascript
const quota = await storage.getQuota();
```

**Returns:**
```javascript
{
  totalStorage: 5368709120,      // 5 GB
  usedStorage: 1073741824,       // 1 GB
  availableStorage: 4294967296,  // 4 GB
  fileCount: 42,
  maxFileSize: 104857600,        // 100 MB
  allowedMimeTypes: ['image/*', 'application/pdf', 'video/*'],
  maxFilesPerUser: 100
}
```

## Usage Examples

### Basic File Upload (Node.js)

```javascript
const fs = require('fs');
const { JustCopyStorage } = require('@justcopy/storage');

const storage = new JustCopyStorage();

// Read file from disk
const fileBuffer = fs.readFileSync('./photo.jpg');

// Upload
const file = await storage.upload(fileBuffer, {
  fileName: 'photo.jpg',
  userId: 'user-123',
  folder: 'uploads'
});

console.log(`Uploaded: ${file.id}`);
```

### Express.js File Upload

```javascript
const express = require('express');
const multer = require('multer');
const { JustCopyStorage } = require('@justcopy/storage');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const storage = new JustCopyStorage();

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = await storage.upload(req.file.buffer, {
      fileName: req.file.originalname,
      userId: req.user.id,
      folder: 'uploads',
      tags: ['user-upload']
    });

    res.json({ success: true, fileId: file.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/files/:fileId', async (req, res) => {
  const { downloadUrl } = await storage.get(req.params.fileId);
  res.redirect(downloadUrl);
});

app.get('/files', async (req, res) => {
  const { files } = await storage.list({
    userId: req.user.id,
    limit: 20
  });
  res.json(files);
});
```

### Browser File Upload

```javascript
import { JustCopyStorage } from '@justcopy/storage';

const storage = new JustCopyStorage({
  apiUrl: 'https://api.justcopy.ai/api',
  apiKey: 'your-api-key'
});

// Handle file input
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];

  try {
    const result = await storage.upload(file, {
      fileName: file.name,
      userId: currentUser.id,
      folder: 'uploads'
    });

    console.log('Upload successful:', result.id);

    // Get download URL
    const url = await storage.getUrl(result.id);
    console.log('Download URL:', url);
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
});
```

### Image Gallery with Pagination

```javascript
const { JustCopyStorage } = require('@justcopy/storage');
const storage = new JustCopyStorage();

async function getUserPhotos(userId, cursor = null) {
  const { files, pagination } = await storage.list({
    userId,
    mimeType: 'image/*',
    folder: 'photos',
    limit: 20,
    cursor
  });

  // Generate download URLs for each photo
  const photos = await Promise.all(
    files.map(async (file) => ({
      ...file,
      url: await storage.getUrl(file.id)
    }))
  );

  return {
    photos,
    hasMore: pagination.hasMore,
    nextCursor: pagination.nextCursor
  };
}

// Load first page
const { photos, nextCursor } = await getUserPhotos('user-123');

// Load next page
if (nextCursor) {
  const morePh photos = await getUserPhotos('user-123', nextCursor);
}
```

### Tagged File Management

```javascript
const { JustCopyStorage } = require('@justcopy/storage');
const storage = new JustCopyStorage();

// Upload with tags
const file = await storage.upload(fileBuffer, {
  fileName: 'document.pdf',
  userId: 'user-123',
  tags: ['invoice', 'paid', 'q1-2025'],
  metadata: {
    invoiceNumber: 'INV-2025-001',
    amount: 1500.00,
    customer: 'Acme Corp'
  }
});

// Find files by tag
const { files } = await storage.list({
  userId: 'user-123',
  tags: ['invoice', 'paid']
});
```

### Quota Checking

```javascript
const { JustCopyStorage } = require('@justcopy/storage');
const storage = new JustCopyStorage();

async function uploadWithQuotaCheck(fileBuffer, options) {
  const quota = await storage.getQuota();

  // Check if file fits in remaining quota
  if (fileBuffer.length > quota.availableStorage) {
    throw new Error(`Storage quota exceeded. Available: ${quota.availableStorage} bytes`);
  }

  // Check file size limit
  if (fileBuffer.length > quota.maxFileSize) {
    throw new Error(`File too large. Max size: ${quota.maxFileSize} bytes`);
  }

  return await storage.upload(fileBuffer, options);
}
```

## Configuration

The client is auto-configured from environment variables (injected by JustCopy):

```bash
JUSTCOPY_API_URL=https://api.justcopy.ai/api
JUSTCOPY_API_KEY=jc_app_abc123_...
APPLICATION_ID=abc123
```

Or configure manually:

```javascript
const storage = new JustCopyStorage({
  apiUrl: 'https://api.justcopy.ai/api',
  apiKey: 'jc_app_abc123_...',
  applicationId: 'abc123'
});
```

## Storage Limits

**Default Quotas (Per Application):**
- **Max file size:** 100 MB per file
- **Total storage:** 5 GB
- **Allowed MIME types:** `image/*`, `video/*`, `application/pdf`, `text/*`, `application/json`
- **Max files per user:** 100

## Error Handling

```javascript
try {
  const file = await storage.upload(fileBuffer, options);
} catch (error) {
  if (error.message.includes('quota exceeded')) {
    // Handle storage quota exceeded
  } else if (error.message.includes('not allowed')) {
    // Handle invalid file type
  } else if (error.message.includes('exceeds limit')) {
    // Handle file too large
  } else {
    // Handle other errors
  }
}
```

## Supported MIME Types

**Images:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`

**Videos:** `video/mp4`, `video/quicktime`, `video/x-msvideo`, `video/webm`

**Documents:** `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`, `application/json`

**Audio:** `audio/mpeg`, `audio/wav`, `audio/ogg`

## License

MIT
