import { api, setToken, clearToken } from './api';

export const authService = {
    async login(email, password) {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setToken(data.token);
        localStorage.setItem('toroongo_user', JSON.stringify(data.user));
        return data.user;
    },

    async register({ name, email, password, role = 'buyer', storeName }) {
        const payload = { name, email, password, role };
        if (storeName) payload.storeName = storeName;

        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setToken(data.token);
        localStorage.setItem('toroongo_user', JSON.stringify(data.user));
        return data.user;
    },

    async logout() {
        try {
            await api('/auth/logout', { method: 'POST' });
        } catch (e) {
            // Ignore errors on logout
        }
        clearToken();
        localStorage.removeItem('toroongo_user');
    },

    async me() {
        return await api('/auth/me');
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('toroongo_user'));
        } catch {
            return null;
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('toroongo_token');
    }
};
