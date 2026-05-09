/**
 * Storefront Schema Definitions (JSDoc-typed)
 *
 * The entire storefront is driven by a structured JSON schema:
 *   - Global Theme: brand colors, fonts, border-radius, header style
 *   - Layout: ordered array of widget blocks, each with type + props + layout controls
 */

/**
 * @typedef {'sharp' | 'rounded' | 'pill'} BorderRadiusPreset
 */

/**
 * @typedef {'light' | 'dark'} HeaderStyle
 */

/**
 * @typedef {'left' | 'center' | 'right'} TextAlignment
 */

/**
 * @typedef {'small' | 'medium' | 'large'} SpacingSize
 */

/**
 * @typedef {'full' | 'boxed'} ContainerWidth
 */

/**
 * @typedef {'desktop' | 'tablet' | 'mobile'} ViewportMode
 */

/**
 * @typedef {Object} ThemeSettings
 * @property {string} brandColor        - Primary action color (hex)
 * @property {string} secondaryColor    - Secondary/accent color (hex)
 * @property {string} backgroundColor   - Page background color (hex)
 * @property {string} textColor         - Primary heading text color (hex)
 * @property {string} mutedTextColor    - Muted/body text color (hex)
 * @property {string} headingFont       - Google Font name for headings
 * @property {string} bodyFont          - Google Font name for body text
 * @property {number} baseFontSize      - Base font size in px (14-20)
 * @property {BorderRadiusPreset} borderRadius - Button/input border-radius preset
 * @property {BorderRadiusPreset} widgetRadius - Widget outer bounding box border-radius preset
 * @property {'none' | 'shadow' | 'border'} cardStyle - Product card visual style
 * @property {HeaderStyle} headerStyle  - Header color scheme
 * @property {'left' | 'center'} logoPosition - Logo alignment in header
 * @property {boolean} stickyHeader     - Whether header sticks on scroll
 */

/**
 * @typedef {Object} WidgetLayout
 * @property {SpacingSize} paddingTop
 * @property {SpacingSize} paddingBottom
 * @property {ContainerWidth} containerWidth
 * @property {boolean} hideOnMobile
 * @property {boolean} hideOnDesktop
 */

/**
 * @typedef {Object} WidgetBlock
 * @property {string} id               - Unique widget instance ID
 * @property {string} type             - Widget type key (e.g. 'HeroBanner')
 * @property {Object} props            - Widget-specific configuration
 * @property {WidgetLayout} layout     - Standard layout controls
 */

/**
 * @typedef {Object} StorefrontSchema
 * @property {ThemeSettings} theme
 * @property {WidgetBlock[]} widgets
 */

/** @returns {ThemeSettings} */
export function createDefaultTheme() {
    return {
        brandColor: '#008080',
        secondaryColor: '#8B5CF6',
        backgroundColor: '#FFFFFF',
        textColor: '#0F172A',
        mutedTextColor: '#64748B',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        baseFontSize: 16,
        borderRadius: 'rounded',
        widgetRadius: 'rounded',
        cardStyle: 'shadow',
        headerStyle: 'light',
        logoPosition: 'left',
        stickyHeader: true,
    };
}

/** @returns {WidgetLayout} */
export function createDefaultWidgetLayout() {
    return {
        paddingTop: 'medium',
        paddingBottom: 'medium',
        containerWidth: 'boxed',
        hideOnMobile: false,
        hideOnDesktop: false,
    };
}

/**
 * Create a new widget block with a unique ID.
 * @param {string} type
 * @param {Object} [props={}]
 * @param {Partial<WidgetLayout>} [layout={}]
 * @returns {WidgetBlock}
 */
export function createWidgetBlock(type, props = {}, layout = {}) {
    return {
        id: `widget_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type,
        props,
        layout: { ...createDefaultWidgetLayout(), ...layout },
    };
}

/** @returns {StorefrontSchema} */
export function createDefaultStorefrontConfig() {
    return {
        theme: createDefaultTheme(),
        widgets: [],
    };
}

/**
 * Maps border-radius preset names to CSS values.
 * @param {BorderRadiusPreset} preset
 * @returns {string}
 */
export function resolveBorderRadius(preset) {
    const map = { sharp: '0px', rounded: '0.5rem', pill: '9999px' };
    return map[preset] || map.rounded;
}

/**
 * Maps spacing size names to Tailwind-compatible rem values.
 * @param {SpacingSize} size
 * @returns {string}
 */
export function resolveSpacing(size) {
    const map = { small: '1rem', medium: '2.5rem', large: '4rem' };
    return map[size] || map.medium;
}

/**
 * Darken a hex color by a given amount (0–1).
 * @param {string} hex
 * @param {number} amt
 * @returns {string}
 */
function darkenHex(hex, amt) {
    const n = parseInt((hex || '#008080').replace('#', ''), 16);
    const r = Math.max(0, Math.round(((n >> 16) & 0xff) * (1 - amt)));
    const g = Math.max(0, Math.round((((n >> 8) & 0xff) * (1 - amt))));
    const b = Math.max(0, Math.round((n & 0xff) * (1 - amt)));
    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/**
 * Convert a ThemeSettings object to CSS custom properties for injection.
 * @param {ThemeSettings} theme
 * @returns {Object}
 */
export function themeToCSS(theme) {
    const cardShadow = theme.cardStyle === 'shadow'
        ? '0 4px 14px rgba(0,0,0,0.08)'
        : 'none';
    const cardBorderColor = theme.cardStyle === 'border'
        ? 'rgba(0,0,0,0.12)'
        : theme.cardStyle === 'none'
            ? 'transparent'
            : 'rgba(0,0,0,0.08)'; // default subtle border for 'shadow' style

    const isDark = theme.headerStyle === 'dark';
    return {
        '--seller-brand': theme.brandColor,
        '--seller-brand-hover': darkenHex(theme.brandColor, 0.15),
        '--seller-brand-secondary': theme.secondaryColor,
        '--seller-bg': theme.backgroundColor,
        '--seller-text': theme.textColor,
        '--seller-text-muted': theme.mutedTextColor,
        '--seller-heading-font': `"${theme.headingFont}", sans-serif`,
        '--seller-body-font': `"${theme.bodyFont}", sans-serif`,
        '--seller-font-size': `${theme.baseFontSize}px`,
        '--seller-radius': resolveBorderRadius(theme.borderRadius),
        '--seller-widget-radius': resolveBorderRadius(theme.widgetRadius || 'rounded'),
        '--seller-header-bg': isDark ? '#0F172A' : '#FFFFFF',
        '--seller-header-text': isDark ? '#FFFFFF' : '#0F172A',
        '--seller-header-text-muted': isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.45)',
        '--seller-header-border': isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        '--seller-card-shadow': cardShadow,
        '--seller-card-border-color': cardBorderColor,
    };
}
