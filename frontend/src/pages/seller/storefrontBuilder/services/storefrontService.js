/**
 * Storefront config persistence helpers.
 * Stores/retrieves storefront JSON configs from the backend API.
 */

import { api } from '../../../../services/api';

/**
 * Get a saved storefront config for a seller.
 * @param {string|number} sellerId
 * @returns {Promise<{theme: object|null, widgets: Array}>}
 */
export async function getStorefrontConfig(sellerId) {
    try {
        return await api(`/storefront/${sellerId}`);
    } catch (e) {
        console.error('Error loading storefront config:', e);
        return { theme: null, widgets: [] };
    }
}

/**
 * Save a storefront config for the authenticated seller.
 * @param {string} _sellerId  — unused, kept for API compat; backend uses auth user
 * @param {object} config     — { theme, widgets }
 */
export async function saveStorefrontConfig(_sellerId, config) {
    try {
        return await api('/storefront', {
            method: 'PUT',
            body: JSON.stringify({
                theme: config.theme || null,
                hero: config.hero || null,
                widgets: config.widgets || [],
            }),
        });
    } catch (e) {
        console.error('Error saving storefront config:', e);
    }
}
