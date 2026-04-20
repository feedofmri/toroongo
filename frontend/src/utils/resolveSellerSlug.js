/**
 * Resolve a seller's URL slug from a sellerId string like "seller_5" or numeric ID.
 * Used across components to generate /:slug links for seller storefronts.
 * @param {string|number} sellerId - e.g. "seller_5", 5, etc.
 * @param {Array} sellers - List of seller objects from context or API.
 * @returns {string} The seller's slug (e.g. "ecohome") or the sellerId as fallback.
 */
export function resolveSellerSlug(sellerId, sellers = []) {
    if (!sellerId) return '';
    
    const numericId = typeof sellerId === 'string' && sellerId.startsWith('seller_')
        ? parseInt(sellerId.replace('seller_', ''))
        : typeof sellerId === 'string'
            ? parseInt(sellerId)
            : typeof sellerId === 'number'
                ? sellerId
                : NaN;
            
    if (isNaN(numericId)) return String(sellerId);

    const seller = sellers.find((s) => Number(s.id) === numericId);
    return seller?.slug || String(sellerId);
}
