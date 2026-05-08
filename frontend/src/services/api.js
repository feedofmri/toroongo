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

/**
 * Upload files as multipart/form-data (for media uploads).
 * Does NOT set Content-Type — browser handles multipart boundary.
 * Supports progress tracking via onProgress callback.
 */
export async function apiUpload(endpoint, formData, { onProgress } = {}) {
  const token = getToken();

  if (onProgress) {
    // Use XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}${endpoint}`);

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.setRequestHeader('Accept', 'application/json');

      if (useCredentials) {
        xhr.withCredentials = true;
      }

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            const err = new Error(data?.message || 'Upload failed');
            err.response = data;
            err.status = xhr.status;
            reject(err);
          }
        } catch {
          reject(new Error('Failed to parse upload response'));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload network error')));
      xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

      xhr.send(formData);
    });
  }

  // Simple fetch-based upload (no progress)
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    credentials: useCredentials ? 'include' : undefined,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || 'Upload failed');
    err.response = data;
    err.status = res.status;
    throw err;
  }

  return data;
}
