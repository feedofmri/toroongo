import { api } from './api';

export const userService = {
    async getUserProfile(userId) {
        return await api(`/users/profile/${userId}`);
    },

    async updateProfile(userId, updateData) {
        const user = await api('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
        // Update localStorage copy
        localStorage.setItem('toroongo_user', JSON.stringify(user));
        return user;
    },

    async getAllSellers() {
        return await api('/users/sellers');
    },

    async getSellerById(sellerId) {
        return await api(`/users/sellers/${sellerId}`);
    },

    async getSellerBySlug(slug) {
        return await api(`/users/sellers/${slug}`);
    }
};
