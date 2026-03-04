/**
 * Resolves a seller's JSON branding config to CSS custom properties.
 * Components in the seller storefront consume these via var(--seller-*).
 *
 * @param {Object} config - Seller branding configuration
 * @param {string} config.brandColor - Primary hex color (e.g. '#8B5CF6')
 * @param {string} [config.brandColorHover] - Hover state color (auto-derived if omitted)
 * @param {string} [config.fontFamily] - Google Font name
 * @param {string} [config.borderRadius] - Button border-radius (e.g. '9999px' for pill)
 * @param {string} [config.headerStyle] - 'light' | 'dark'
 * @returns {Object} CSS custom property map for inline style injection
 */
export function resolveSellerTheme(config = {}) {
    const {
        brandColor = '#06B6D4',
        brandColorHover,
        fontFamily = 'Inter, sans-serif',
        borderRadius = '0.5rem',
        headerStyle = 'light',
    } = config;

    // Darken brand color by ~15% for hover if not provided
    const hover = brandColorHover || darkenHex(brandColor, 0.15);

    return {
        '--seller-brand': brandColor,
        '--seller-brand-hover': hover,
        '--seller-font': fontFamily,
        '--seller-radius': borderRadius,
        '--seller-header-bg': headerStyle === 'dark' ? '#0F172A' : '#FFFFFF',
        '--seller-header-text': headerStyle === 'dark' ? '#FFFFFF' : '#0F172A',
    };
}

/**
 * Simple hex color darkening utility.
 */
function darkenHex(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xFF) * (1 - amount)));
    const g = Math.max(0, Math.min(255, (((num >> 8) & 0xFF) * (1 - amount))));
    const b = Math.max(0, Math.min(255, ((num & 0xFF) * (1 - amount))));
    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export default resolveSellerTheme;
