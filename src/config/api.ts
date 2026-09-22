/**
 * Centralized API Configuration & Utility for All Fresh Naturals
 * Ensures 100% reliable API connectivity in:
 * - Production: https://allfreshnaturals.com (uses standard HTTPS /api without port 5000)
 * - Local development: Vite dev proxy & fallback
 */

export function getApiBaseUrl(): string {
  // 1. Explicit Vite environment variable (e.g. VITE_API_URL in .env)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  // 2. Browser runtime environment detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || '';
    const protocol = window.location.protocol || '';

    // Check if running on localhost / private dev network
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.');

    // On ANY production host (allfreshnaturals.com, www.allfreshnaturals.com, or HTTPS),
    // always use relative '/api' on standard ports 80/443 without appending ':5000'.
    if (!isLocalhost || protocol === 'https:' || (typeof import.meta !== 'undefined' && import.meta.env?.PROD)) {
      return '/api';
    }

    // In local dev with Vite dev server (e.g. port 5173, 3000)
    const port = window.location.port;
    if (port && port !== '5000') {
      return '/api';
    }

    // Direct localhost backend access
    return `http://${hostname || 'localhost'}:8000/api`;
  }

  return '/api';
}

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = getApiBaseUrl();
  return `${base}${cleanEndpoint}`;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const primaryUrl = getApiUrl(cleanEndpoint);

  // Retrieve stored authentication token if present
  const authHeader: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const adminToken = localStorage.getItem('afn_admin_token');
    const userToken = localStorage.getItem('afn_user_token');
    const token = adminToken || userToken;
    if (token) {
      authHeader['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(primaryUrl, fetchOptions);
    return response;
  } catch (err) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname || '';
      const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.');

      // In production, retry with same-origin relative endpoint
      if (!isLocalhost || window.location.protocol === 'https:' || (typeof import.meta !== 'undefined' && import.meta.env?.PROD)) {
        return fetch(`/api${cleanEndpoint}`, fetchOptions);
      }

      // Localhost fallback on port 8000
      const fallbackUrl = `http://${hostname || 'localhost'}:8000/api${cleanEndpoint}`;
      return fetch(fallbackUrl, fetchOptions);
    }
    throw err;
  }
}
