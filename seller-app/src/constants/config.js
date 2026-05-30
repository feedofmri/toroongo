import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 to reach the host machine's localhost.
// iOS simulator and web can use 127.0.0.1 directly.
const HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
export const API_BASE_URL = `http://${HOST}:8000/api`;
export const STORAGE_KEY_TOKEN = 'toroongo_token';
export const STORAGE_KEY_USER = 'toroongo_user';

export const ORDER_STATUSES = [
  { value: 'pending',    label: 'Pending',    color: '#F59E0B' },
  { value: 'confirmed',  label: 'Confirmed',  color: '#3B82F6' },
  { value: 'processing', label: 'Processing', color: '#8B5CF6' },
  { value: 'shipped',    label: 'Shipped',    color: '#06B6D4' },
  { value: 'delivered',  label: 'Delivered',  color: '#10B981' },
  { value: 'cancelled',  label: 'Cancelled',  color: '#EF4444' },
  { value: 'refunded',   label: 'Refunded',   color: '#64748B' },
];

export const PLAN_COLORS = {
  starter:    '#64748B',
  pro:        '#008080',
  business:   '#8B5CF6',
  enterprise: '#F59E0B',
};
