import { api } from './api';

export const notificationService = {
    async getNotifications(page = 1) {
        return await api(`/notifications?page=${page}`);
    },

    async getUnreadCount() {
        return await api('/notifications/unread-count');
    },

    async markAsRead(id) {
        return await api(`/notifications/${id}/read`, {
            method: 'PUT',
        });
    },

    async markAllAsRead() {
        return await api('/notifications/read-all', {
            method: 'PUT',
        });
    },

    async deleteNotification(id) {
        return await api(`/notifications/${id}`, {
            method: 'DELETE',
        });
    }
};
