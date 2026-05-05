const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
};

const normalizeBaseUrl = (value, fallback) => {
  const raw = (value || fallback || "").trim();
  return raw.replace(/\/+$/, "");
};

const normalizeApiPrefix = (value, fallback = "/api") => {
  const raw = (value || fallback).trim();
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeadingSlash.replace(/\/+$/, "");
};

const storagePrefix = (
  import.meta.env.VITE_STORAGE_PREFIX || "toroongo"
).trim();
const apiHost = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL,
  "http://localhost:8000",
);
const apiPrefix = normalizeApiPrefix(import.meta.env.VITE_API_PREFIX, "/api");
const useCredentials = toBoolean(import.meta.env.VITE_USE_CREDENTIALS, false);

export const TOKEN_STORAGE_KEY =
  import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY || `${storagePrefix}_token`;
export const USER_STORAGE_KEY =
  import.meta.env.VITE_AUTH_USER_STORAGE_KEY || `${storagePrefix}_user`;

// Central API client for all backend requests
const API_BASE = `${apiHost}${apiPrefix}`;

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function api(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: useCredentials ? "include" : options.credentials,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    // Don't redirect here, let the auth context handle it
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || "API Error");
    err.response = data;
    err.status = res.status;
    throw err;
  }

  return data;
}
