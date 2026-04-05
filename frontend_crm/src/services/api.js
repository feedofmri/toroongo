// Central API client for all backend requests
const API_BASE = 'http://localhost:8000/api';

function getToken() {
    return localStorage.getItem('toroongo_token');
}

export function setToken(token) {
    localStorage.setItem('toroongo_token', token);
}

export function clearToken() {
    localStorage.removeItem('toroongo_token');
}

export async function api(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        clearToken();
        localStorage.removeItem('toroongo_user');
        // Don't redirect here, let the auth context handle it
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'API Error');
    }

    return data;
}
