/**
 * Viewport width utilities for the storefront builder.
 */

/**
 * Get CSS max-width for the current viewport mode.
 * @param {'desktop' | 'tablet' | 'mobile'} mode
 * @returns {string}
 */
export function getViewportWidth(mode) {
    return { desktop: '100%', tablet: '768px', mobile: '375px' }[mode] || '100%';
}
