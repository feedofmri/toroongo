import { sellers } from '../data/mockData';

/**
 * Resolve a seller's URL slug from a sellerId string like "seller_5" or numeric ID.
 * Used across components to generate /:slug links for seller storefronts.
 * @param {string|number} sellerId - e.g. "seller_5", 5, etc.
 * @returns {string} The seller's slug (e.g. "ecohome") or the sellerId as fallback.
 */
export function resolveSellerSlug(sellerId) {
    const numericId = typeof sellerId === 'string' && sellerId.startsWith('seller_')
        ? parseInt(sellerId.replace('seller_', ''))
        : typeof sellerId === 'string'
            ? parseInt(sellerId)
            : sellerId;
    return sellers.find((s) => s.id === numericId)?.slug || String(sellerId);
}
