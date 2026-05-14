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
  deleteUser:       (id)          => api(`/admin/users/${id}`, { method: 'DELETE' }),

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

  // ── Subscriptions ──────────────────────────────────
  getSubscriptions: (params = {}) => api(`/admin/subscriptions${qs(params)}`),

  // ── Reviews ────────────────────────────────────────
  getReviews:   (params = {}) => api(`/admin/reviews${qs(params)}`),
  updateReview: (id, data)    => api(`/admin/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteReview: (id)          => api(`/admin/reviews/${id}`, { method: 'DELETE' }),

  // ── Blogs ──────────────────────────────────────────
  getBlogs:   (params = {}) => api(`/admin/blogs${qs(params)}`),
  deleteBlog: (id)          => api(`/admin/blogs/${id}`, { method: 'DELETE' }),

  // ── Hero Banners ───────────────────────────────────
  getHeroBanners:    ()         => api('/admin/hero-banners'),
  createHeroBanner:  (data)     => api('/admin/hero-banners',      { method: 'POST',   body: JSON.stringify(data) }),
  updateHeroBanner:  (id, data) => api(`/admin/hero-banners/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteHeroBanner:  (id)       => api(`/admin/hero-banners/${id}`, { method: 'DELETE' }),

  // ── Discounts ──────────────────────────────────────
  getDiscounts: (params = {}) => api(`/admin/discounts${qs(params)}`),

  // ── Sellers ───────────────────────────────────────
  verifySeller: (id) => api(`/admin/sellers/${id}/verify`, { method: 'PATCH' }),

  // ── Products update ───────────────────────────────
  updateProduct: (id, data) => api(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // ── Subscription management ───────────────────────
  cancelSubscription:     (id) => api(`/admin/subscriptions/${id}/cancel`, { method: 'PATCH' }),
  reactivateSubscription: (id) => api(`/admin/subscriptions/${id}/reactivate`, { method: 'PATCH' }),
  approveSubscription:    (id) => api(`/admin/subscriptions/${id}/approve`, { method: 'PATCH' }),

  // ── Advertisements ────────────────────────────────
  getAdvertisements:    ()         => api('/admin/advertisements'),
  createAdvertisement:  (data)     => api('/admin/advertisements',      { method: 'POST',   body: JSON.stringify(data) }),
  updateAdvertisement:  (id, data) => api(`/admin/advertisements/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteAdvertisement:  (id)       => api(`/admin/advertisements/${id}`, { method: 'DELETE' }),

  // ── Notification counts ───────────────────────────
  getNotificationCounts: () => api('/admin/notification-counts'),

  // ── Career Jobs ───────────────────────────────────
  getCareerJobs:    ()         => api('/admin/career-jobs'),
  createCareerJob:  (data)     => api('/admin/career-jobs',      { method: 'POST',   body: JSON.stringify(data) }),
  updateCareerJob:  (id, data) => api(`/admin/career-jobs/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteCareerJob:  (id)       => api(`/admin/career-jobs/${id}`, { method: 'DELETE' }),

  // ── Newsletter & Contacts (all sellers) ──────────
  getAllSubscribers:       () => api('/admin/newsletter/subscribers'),
  getAllContactSubmissions:() => api('/admin/contact/submissions'),

  // ── Admin Chat ────────────────────────────────────
  getChatConversations: ()         => api('/admin/chat/conversations'),
  getChatMessages:      (userId)   => api(`/admin/chat/${userId}/messages`),
  sendChatMessage:      (userId, text) => api(`/admin/chat/${userId}/send`, { method: 'POST', body: JSON.stringify({ text }) }),
  markContactAsRead:    (id) => api(`/admin/contact/submissions/${id}/read`, { method: 'PUT' }),
  markAllAsRead:        (type) => api(`/admin/notifications/${type}/read`, { method: 'POST' }),
};
