
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function apiGet(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : res.text();
}

export async function apiJSON(path, method, body) {
  return apiGet(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function apiUpload(path, formData, method = 'POST') {
  
  return apiGet(path, { method, body: formData });
}
