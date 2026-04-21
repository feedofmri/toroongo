import { api, setToken, clearToken, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './api';

export const authService = {
    async login(email, password) {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setToken(data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
    },

    async register({ name, email, password, role = 'buyer' }) {
        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role }),
        });
        setToken(data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
    },

    async logout() {
        try {
            await api('/auth/logout', { method: 'POST' });
        } catch {
            // Ignore errors on logout
        }
        clearToken();
        localStorage.removeItem(USER_STORAGE_KEY);
    },

    async me() {
        return await api('/auth/me');
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        } catch {
            return null;
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem(TOKEN_STORAGE_KEY);
    }
};
