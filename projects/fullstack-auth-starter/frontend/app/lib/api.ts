/**
 * API Client for Fullstack Skeleton
 * Handles backend URL configuration and bearer token authentication
 */

// Get backend URL from environment or detect automatically
function getBackendUrl(): string {
  // First try environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // If running in browser, try to detect E2B environment
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    
    // Check if we're on an E2B domain (format: 3000-{sandbox-id}.e2b.app or e2b.dev)
    const e2bMatch = currentHost.match(/^3000-([a-z0-9]+)\.e2b\.(dev|app)$/);
    if (e2bMatch) {
      const sandboxId = e2bMatch[1];
      const domain = e2bMatch[2];
      return `https://3001-${sandboxId}.e2b.${domain}`;
    }
  }
  
  // Fallback to localhost for local development
  return 'http://localhost:3001';
}

const BACKEND_URL = getBackendUrl();

// Token storage using localStorage for persistence across refreshes
const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
  
  set(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },
  
  remove(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }
};

export const api = {
  /**
   * Base URL for API requests
   */
  baseUrl: BACKEND_URL,

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return tokenStorage.get();
  },

  /**
   * Set auth token
   */
  setToken(token: string): void {
    tokenStorage.set(token);
  },

  /**
   * Remove auth token
   */
  removeToken(): void {
    tokenStorage.remove();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Make an API request with bearer token authentication
   */
  async request(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`;
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Add bearer token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 unauthorized - token might be expired
    if (response.status === 401) {
      this.removeToken();
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Authentication endpoints
   */
  auth: {
    async login(email: string, password: string) {
      const response = await api.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Store token after successful login
      if (response.token) {
        api.setToken(response.token);
      }
      
      return response;
    },

    async register(name: string, email: string, password: string) {
      const response = await api.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      
      // Store token after successful registration
      if (response.token) {
        api.setToken(response.token);
      }
      
      return response;
    },

    async logout() {
      try {
        await api.request('/api/auth/logout', {
          method: 'POST',
        });
      } finally {
        // Always remove token, even if logout request fails
        api.removeToken();
      }
    },

    async getCurrentUser() {
      return api.request('/api/auth/me');
    },
  },
};

export default api;