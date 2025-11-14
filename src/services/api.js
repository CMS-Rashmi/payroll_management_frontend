// src/services/api.js
import { getPublicIP } from "../utils/getIP";

// Base URL (same as you had)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ---- Token helpers -------------------------------------------------
function getToken() {
  // Adjust if your app stores the token differently
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : { ...extra };
}

// ---- GET: return raw body (array or object). Throw on non-2xx -----
export async function apiGet(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || 'GET',
    credentials: 'include',
    headers: authHeaders(opts.headers || {}),
    ...opts,
  });

  const ct = res.headers.get('content-type') || '';
  const isJSON = ct.includes('application/json');
  const body = isJSON ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

  if (!res.ok) {
    // Prefer server message if available
    const msg =
      (isJSON && body && (body.message || body.error)) ||
      (typeof body === 'string' && body) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return body; // could be array or object
}

let cachedIP = null;
// ---- JSON helpers (POST/PUT/PATCH) that ALWAYS attach token --------
// They return: { ok, status, ...body } so caller can check json.ok safely.
async function apiJsonWrite(path, method, body) {
  if (!cachedIP) cachedIP = await getPublicIP(); 
  const payload = { ...body, ip : cachedIP };
  console.log(payload);

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  const ct = res.headers.get('content-type') || '';
  const isJSON = ct.includes('application/json');
  const data = isJSON ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

  if (typeof data === 'object' && data !== null) {
    return { ok: res.ok, status: res.status, ...data };
  }
  return { ok: res.ok, status: res.status, data };
}

// Backward-compat name you already used sometimes
export function apiJSON(path, method, body) {
  return apiJsonWrite(path, method, body);
}

// POST/PUT/PATCH wrappers
export function apiPost(path, body = {}) {
  return apiJsonWrite(path, 'POST', body);
}

export function apiPut(path, body = {}) {
  return apiJsonWrite(path, 'PUT', body);
}

export function apiPatch(path, body = {}) {
  return apiJsonWrite(path, 'PATCH', body);
}

// ---- DELETE (returns { ok, status, ...body }) ----------------------
export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: authHeaders(),
  });

  const ct = res.headers.get('content-type') || '';
  const isJSON = ct.includes('application/json');
  const data = isJSON ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

  if (typeof data === 'object' && data !== null) {
    return { ok: res.ok, status: res.status, ...data };
  }
  return { ok: res.ok, status: res.status, data };
}

// ---- Upload (FormData) — do NOT set Content-Type manually ----------
// Returns { ok, status, ...body } like write helpers.
export async function apiUpload(path, formData, method = 'POST') {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: authHeaders(), // no 'Content-Type' so browser sets proper boundary
    body: formData,
  });

  const ct = res.headers.get('content-type') || '';
  const isJSON = ct.includes('application/json');
  const data = isJSON ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

  if (typeof data === 'object' && data !== null) {
    return { ok: res.ok, status: res.status, ...data };
  }
  return { ok: res.ok, status: res.status, data };
}

// api with parameters
export async function apiGetWithParams(path, params = {}, opts = {}) {
  // Build query string
  let url = `${API_BASE}${path}`;
  const query = new URLSearchParams();

  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  }

  const queryString = query.toString();
  if (queryString) url += `?${queryString}`;

  const res = await fetch(url, {
    credentials: 'include',
    headers: authHeaders(opts.headers || {}),
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

// Time & Attendance API calls
export const attendanceApi = {
    // Timetables
    getTimetables: () => apiGet('/attendance/timetables'),
    createTimetable: (data) => apiPost('/attendance/timetables', data),
    updateTimetable: (id, data) => apiPut(`/attendance/timetables/${id}`, data),
    deleteTimetable: (id) => apiDelete(`/attendance/timetables/${id}`),
    
    // Attendance records
    checkIn: (data) => apiPost('/attendance/checkin', data),
    checkOut: (data) => apiPost('/attendance/checkout', data),
    
    // Adjustments
    getAttendanceRecords: (params) => apiGetWithParams('/attendance/attendance', params),
    getEmployeeAttendance: (employeeId, params) => apiGetWithParams(`/attendance/attendance/employee/${employeeId}`, params),
    getAdjustments: (params) => apiGetWithParams('/attendance/adjustments', params),
    createAdjustment: (data) => apiPost('/attendance/adjustments', data),
    approveAdjustment: (id, data) => apiPut(`/attendance/adjustments/${id}/approve`, data),

  

    
    // Reports
    getAbsenceReport: (params) => apiGetWithParams('/attendance/reports/absence', params),
    getCheckinCheckoutReport: (params) => apiGet('/attendance/reports/checkin-checkout', params)
};
