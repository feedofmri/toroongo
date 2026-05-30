import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEY_TOKEN } from '../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEY_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', { ...data, role: 'seller' }),
  me: () => api.get('/auth/me'),
  sendOtp: (email) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// --- Products ---
export const productService = {
  list: (params) => api.get('/products', { params: { ...params, seller: 'me' } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) =>
    api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => {
    // Laravel method spoofing: append _method to FormData body (not URL params)
    data.append('_method', 'PUT');
    return api.post(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/products/${id}`),
};

// --- Orders ---
export const orderService = {
  listSeller: (params) => api.get('/orders/seller', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// --- Messages ---
export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (receiverId, message) =>
    api.post('/messages', { receiver_id: receiverId, message }),
  markRead: (userId) => api.put(`/messages/${userId}/read`),
};

// --- Profile / User ---
export const userService = {
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => {
    // Laravel method spoofing: append _method to FormData body
    data.append('_method', 'PUT');
    return api.post('/users/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  checkSlug: (slug) => api.post('/users/check-slug', { slug }),
};

// --- Storefront ---
export const storefrontService = {
  get: (sellerId) => api.get(`/storefront/${sellerId}`),
  update: (data) => api.put('/storefront', data),
};

// --- Subscription ---
export const subscriptionService = {
  current: () => api.get('/subscription/current'),
  plans: () => api.get('/subscription/plans'),
  history: () => api.get('/subscription/history'),
  upgrade: (planId) => api.post('/subscription/upgrade', { plan: planId }),
  downgrade: (planId) => api.post('/subscription/downgrade', { plan: planId }),
};

// --- Notifications ---
export const notificationService = {
  list: () => api.get('/notifications'),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// --- Reviews ---
export const reviewService = {
  listSeller: () => api.get('/reviews/seller'),
};

// --- Discounts ---
export const discountService = {
  list: () => api.get('/discounts'),
  create: (data) => api.post('/discounts', data),
  update: (id, data) => api.put(`/discounts/${id}`, data),
  toggle: (id) => api.put(`/discounts/${id}/toggle`),
  delete: (id) => api.delete(`/discounts/${id}`),
};

// --- Shipping Areas ---
export const shippingAreaService = {
  list: () => api.get('/shipping-areas'),
  create: (data) => api.post('/shipping-areas', data),
  update: (id, data) => api.put(`/shipping-areas/${id}`, data),
  delete: (id) => api.delete(`/shipping-areas/${id}`),
};

// --- Payment Methods ---
export const paymentMethodService = {
  list: () => api.get('/payment-methods'),
  create: (data) => api.post('/payment-methods', data),
  update: (id, data) => api.put(`/payment-methods/${id}`, data),
  delete: (id) => api.delete(`/payment-methods/${id}`),
};

// --- Blogs ---
export const blogService = {
  listBySeller: (sellerId) => api.get(`/blogs/seller/${sellerId}`),
  create: (data) =>
    api.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

export default api;
