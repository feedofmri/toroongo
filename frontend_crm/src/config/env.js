const toBoolean = (value, fallback = false) => {
    if (value === undefined) return fallback;
    return String(value).toLowerCase() === 'true';
};

const normalizeBaseUrl = (value, fallback) => {
    const raw = (value || fallback || '').trim();
    return raw.replace(/\/+$/, '');
};

const normalizeApiPrefix = (value, fallback = '/api') => {
    const raw = (value || fallback).trim();
    const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`;
    return withLeadingSlash.replace(/\/+$/, '');
};

const apiHost = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL, 'http://localhost:8000');
const apiPrefix = normalizeApiPrefix(import.meta.env.VITE_API_PREFIX, '/api');
const storagePrefix = (import.meta.env.VITE_STORAGE_PREFIX || 'toroongo').trim();

export const env = Object.freeze({
    apiBaseUrl: `${apiHost}${apiPrefix}`,
    tokenStorageKey: import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY || `${storagePrefix}_token`,
    userStorageKey: import.meta.env.VITE_AUTH_USER_STORAGE_KEY || `${storagePrefix}_user`,
    useCredentials: toBoolean(import.meta.env.VITE_USE_CREDENTIALS, false),
});

