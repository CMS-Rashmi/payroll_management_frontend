// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function authHeaders(extra = {}) {
  const token = localStorage.getItem('token');
  return token ? { ...extra, Authorization: `Bearer ${token}` } : { ...extra };
}

export async function apiGet(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: authHeaders(opts.headers || {}),
    ...opts,
  });

  if (!res.ok) {
    // Try to surface backend JSON error message
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export async function apiJSON(path, method, body) {
  return apiGet(path, {
    method,
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
}

export async function apiUpload(path, formData, method = 'POST') {
  // Do NOT set Content-Type for FormData (browser sets boundary)
  return apiGet(path, { method, body: formData });
}

// Login / any simple POST that should not throw on non-2xx:
export async function apiPost(path, body = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // login has no token yet
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, ...data };
}
