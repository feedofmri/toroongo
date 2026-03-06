/**
 * Storefront config persistence helpers.
 * Stores/retrieves storefront JSON configs from localStorage, keyed by seller ID.
 */

const STOREFRONT_CONFIGS_KEY = 'toroongo_storefront_configs';

/**
 * Get a saved storefront config for a seller.
 * @param {string} sellerId
 * @returns {import('../schema/storefrontSchema.js').StorefrontSchema|null}
 */
export function getStorefrontConfig(sellerId) {
    try {
        const raw = localStorage.getItem(STOREFRONT_CONFIGS_KEY);
        if (raw) {
            const configs = JSON.parse(raw);
            return configs[sellerId] || null;
        }
    } catch (e) {
        console.error('Error loading storefront config:', e);
    }
    return null;
}

/**
 * Save a storefront config for a seller.
 * @param {string} sellerId
 * @param {import('../schema/storefrontSchema.js').StorefrontSchema} config
 */
export function saveStorefrontConfig(sellerId, config) {
    try {
        const raw = localStorage.getItem(STOREFRONT_CONFIGS_KEY);
        const configs = raw ? JSON.parse(raw) : {};
        configs[sellerId] = config;
        localStorage.setItem(STOREFRONT_CONFIGS_KEY, JSON.stringify(configs));
    } catch (e) {
        console.error('Error saving storefront config:', e);
    }
}
