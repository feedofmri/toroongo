import { api } from './api';

const qs = (params) => {
  const q = new URLSearchParams(params).toString();
  return q ? `?${q}` : '';
};

export const adminService = {
  // ── Platform stats ─────────────────────────────────
  getPlatformStats: (range = '30') => api(`/admin/stats?range=${range}`),

  // ── Users ──────────────────────────────────────────
  getAllUsers:      (params = {}) => api(`/admin/users${qs(params)}`),
  getUserById:      (id)          => api(`/admin/users/${id}`),
  updateUserRole:   (id, role)    => api(`/admin/users/${id}/role`, { method: 'PUT',   body: JSON.stringify({ role }) }),
  toggleUserStatus: (id)          => api(`/admin/users/${id}/toggle-status`, { method: 'PATCH' }),

  // ── Sellers ────────────────────────────────────────
  getSellersList: (params = {}) => api(`/admin/sellers${qs(params)}`),

  // ── Orders ─────────────────────────────────────────
  getAllOrders: (params = {}) => api(`/admin/orders${qs(params)}`),

  // ── Products ───────────────────────────────────────
  getAllProducts: (params = {}) => api(`/admin/products${qs(params)}`),

  // ── Categories ─────────────────────────────────────
  getCategories:    ()          => api('/admin/categories'),
  createCategory:   (data)      => api('/admin/categories',    { method: 'POST',   body: JSON.stringify(data) }),
  updateCategory:   (id, data)  => api(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory:   (id)        => api(`/admin/categories/${id}`, { method: 'DELETE' }),

  // ── Settings ───────────────────────────────────────
  getSettings:    ()     => api('/admin/settings'),
  updateSettings: (data) => api('/admin/settings', { method: 'POST', body: JSON.stringify(data) }),

  // ── Admin accounts ─────────────────────────────────
  createAdmin: (data) => api('/admin/create-admin', { method: 'POST', body: JSON.stringify(data) }),
  getAdmins:   ()     => api('/admin/users?role=admin&per_page=50'),
};
