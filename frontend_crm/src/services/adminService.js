import { api } from './api';

export const adminService = {
    async getPlatformStats(range = '7') {
        return await api(`/admin/stats?range=${range}`);
    },

    async getAllUsers(page = 1, search = '', role = 'all') {
        return await api(`/admin/users?page=${page}&search=${search}&role=${role}`);
    },

    async getSellers(page = 1, search = '') {
        return await api(`/admin/sellers?page=${page}&search=${search}`);
    },

    async getUserDetails(userId) {
        return await api(`/admin/users/${userId}`);
    },

    async updateUserRole(userId, newRole) {
        return await api(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: newRole }),
        });
    },

    async toggleUserStatus(userId) {
        return await api(`/admin/users/${userId}/toggle-status`, {
            method: 'PATCH'
        });
    },

    // Category Management
    async getCategories() {
        return await api('/admin/categories');
    },

    async createCategory(data) {
        return await api('/admin/categories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateCategory(id, data) {
        return await api(`/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async deleteCategory(id) {
        return await api(`/admin/categories/${id}`, {
            method: 'DELETE'
        });
    },

    // Platform Settings
    async getSettings() {
        return await api('/admin/settings');
    },

    async updateSettings(settings) {
        return await api('/admin/settings', {
            method: 'POST',
            body: JSON.stringify(settings)
        });
    }
};


