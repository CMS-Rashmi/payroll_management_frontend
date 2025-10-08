// src/services/api.js

// Define the API base URL (use .env if available, else fallback to localhost)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Generic GET (or any) request handler.
 */
export async function apiGet(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

/**
 * JSON request with custom method (GET, POST, PUT, DELETE, etc.)
 */
export async function apiJSON(path, method, body) {
  return apiGet(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * File upload helper for multipart/form-data requests
 */
export async function apiUpload(path, formData, method = 'POST') {
  // NOTE: Do not manually set Content-Type; the browser sets the boundary automatically.
  return apiGet(path, { method, body: formData });
}

/**
 * ✅ POST helper — used for login, registration, etc.
 * Returns a simplified response object: { ok, status, ...data }
 */
export async function apiPost(path, body = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // Try to parse JSON response (fallback to empty object)
  const data = await res.json().catch(() => ({}));

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
}
