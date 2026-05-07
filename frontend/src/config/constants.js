/**
 * Centralized constants for the Toroongo platform.
 * These values are shared across various buyer and seller components.
 */

export const PLATFORM_CONFIG = {
    ORDER_ID_PREFIX: 'TRG-',
    DEFAULT_FEE_RATE: 0.10, // 10% platform fee
    DEFAULT_TAX_RATE: 0.08, // 8% estimated tax
    CURRENCY_FALLBACK: 'USD',
    LOCALE_FALLBACK: 'en-US',
};

export const RESERVED_SLUGS = [
    'admin', 'shop', 'shops', 'product', 'products', 'category', 'categories',
    'search', 'cart', 'checkout', 'login', 'register', 'dashboard', 'settings',
    'orders', 'finance', 'messages', 'notifications', 'wishlist', 'account',
    'sell', 'seller', 'seller-dashboard', 'auth', 'api', 'static', 'legal',
    'help', 'support', 'terms', 'privacy', 'about', 'contact', 'blog', 'news'
];

export const STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    delivered: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    returned: 'bg-slate-100 text-slate-700 border-slate-200'
};
