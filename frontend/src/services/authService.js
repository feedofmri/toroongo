import { api, setToken, clearToken, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './api';
import { setBuyerCurrencyCode } from '../utils/currency';

function persistCurrency(user) {
    if (user?.currency_code) {
        setBuyerCurrencyCode(user.currency_code);
    }
}

export const authService = {
    async login(email, password) {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setToken(data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        persistCurrency(data.user);
        return data.user;
    },

    async register({ name, email, password, role = 'buyer', storeName, country, currency_code, country_custom_name }) {
        const payload = { name, email, password, role };
        if (storeName) payload.storeName = storeName;
        if (country) payload.country = country;
        if (currency_code) payload.currency_code = currency_code;
        if (country_custom_name) payload.country_custom_name = country_custom_name;

        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setToken(data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        persistCurrency(data.user);
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
    },

    async sendOtp(email, type = 'signup') {
        return await api('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email, type }),
        });
    },

    async verifyOtp(email, otp, type = 'signup') {
        return await api('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp, type }),
        });
    },

    async getGoogleUrl() {
        const data = await api('/auth/google');
        return data.url;
    },

    async handleGoogleCallback(queryParams) {
        const data = await api(`/auth/google/callback${queryParams}`);
        setToken(data.access_token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        persistCurrency(data.user);
        return data.user;
    },
};
