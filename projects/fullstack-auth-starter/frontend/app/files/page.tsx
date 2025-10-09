'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import FileUpload from '../components/FileUpload';

interface FileItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  folder: string;
  tags: string[];
  createdAt: string;
}

interface StorageQuota {
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  fileCount: number;
  maxFileSize: number;
}

export default function FilesPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [quota, setQuota] = useState<StorageQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Check auth
  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/');
    } else {
      loadFiles();
      loadQuota();
    }
  }, [router]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.files.list({ limit: 50 });
      setFiles(response.files || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const loadQuota = async () => {
    try {
      const response = await api.files.getQuota();
      setQuota(response.quota);
    } catch (err) {
      console.error('Failed to load quota:', err);
    }
  };

  const handleUploadComplete = (file: FileItem) => {
    setFiles(prev => [file, ...prev]);
    loadQuota(); // Refresh quota
  };

  const handleDelete = async (fileId: string) => {
    try {
      await api.files.delete(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      setDeleteConfirm(null);
      loadQuota(); // Refresh quota
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('json') || mimeType.includes('text')) return '📝';
    return '📎';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Files</h1>
          <p className="mt-2 text-gray-600">Upload and manage your files</p>
        </div>

        {/* Storage Quota */}
        {quota && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Storage Usage</h2>
              <span className="text-sm text-gray-600">
                {formatBytes(quota.usedStorage)} / {formatBytes(quota.totalStorage)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  (quota.usedStorage / quota.totalStorage) > 0.9 ? 'bg-red-600' :
                  (quota.usedStorage / quota.totalStorage) > 0.7 ? 'bg-yellow-600' :
                  'bg-blue-600'
                }`}
                style={{ width: `${(quota.usedStorage / quota.totalStorage) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>{quota.fileCount} files</span>
              <span>{formatBytes(quota.availableStorage)} available</span>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h2>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Files ({files.length})
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading files...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadFiles}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No files uploaded yet</p>
                <p className="text-sm text-gray-400 mt-1">Upload your first file above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatBytes(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(file.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Delete file"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        {formatDate(file.createdAt)}
                      </p>
                      {file.tags && file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {file.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={async () => {
                        try {
                          const fileData = await api.files.get(file.id);
                          window.open(fileData.file.downloadUrl, '_blank');
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }}
                      className="mt-3 w-full text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete File?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this file? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
