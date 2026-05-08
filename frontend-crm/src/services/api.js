const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');

export const TOKEN_KEY = 'crm_token';
export const USER_KEY  = 'crm_user';

export function getToken()      { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t)     { localStorage.setItem(TOKEN_KEY, t); }
export function clearAuth()     { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }

export async function api(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login';
    return null;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed');
    err.response = data;
    err.status = res.status;
    throw err;
  }

  return data;
}
