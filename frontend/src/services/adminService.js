import { api } from './api';

export const adminService = {
  async getPlatformStats(range = '7') {
    return await api(`/admin/stats?range=${range}`);
  },

  async getAllUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await api(`/admin/users${query ? `?${query}` : ''}`);
  },

  async getUserById(id) {
    return await api(`/admin/users/${id}`);
  },

  async updateUserRole(userId, newRole) {
    return await api(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
    });
  },

  async toggleUserStatus(userId) {
    return await api(`/admin/users/${userId}/toggle-status`, {
      method: 'PATCH',
    });
  },

  async getSellersList(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await api(`/admin/sellers${query ? `?${query}` : ''}`);
  },

  async getAllOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await api(`/admin/orders${query ? `?${query}` : ''}`);
  },

  async getCategories() {
    return await api('/admin/categories');
  },

  async createCategory(data) {
    return await api('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id, data) {
    return await api(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id) {
    return await api(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  async getSettings() {
    return await api('/admin/settings');
  },

  async updateSettings(data) {
    return await api('/admin/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
