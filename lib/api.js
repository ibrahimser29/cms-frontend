const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function authPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    const message = Array.isArray(json.message)
      ? json.message[0]
      : (json.message || 'Something went wrong');
    throw new Error(message);
  }
  return json.data;
}

export function saveTokens({ access_token, refresh_token }) {
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function getTokenPayload() {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function isAdmin() {
  const role = getTokenPayload()?.role;
  return typeof role === 'string' && role.toUpperCase() === 'ADMIN';
}

export function isLoggedIn() {
  const payload = getTokenPayload();
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}

export async function refreshAccessToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    if (json.data?.access_token) {
      saveTokens(json.data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Drop-in replacement for fetch() that adds Authorization and auto-refreshes on 401.
// Do NOT pass Content-Type for FormData — the browser sets it with the boundary.
export async function fetchWithAuth(url, options = {}) {
  const makeReq = (token) =>
    fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });

  let res = await makeReq(getAccessToken());

  if (res.status === 401) {
    const ok = await refreshAccessToken();
    if (ok) {
      res = await makeReq(getAccessToken());
    } else {
      clearTokens();
      window.location.href = '/login';
    }
  }

  return res;
}
