import { api } from './api';

export const adminService = {
    async getPlatformStats() {
        return await api('/admin/stats');
    },

    async getAllUsers() {
        return await api('/admin/users');
    },

    async updateUserRole(userId, newRole) {
        return await api(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: newRole }),
        });
    }
};
