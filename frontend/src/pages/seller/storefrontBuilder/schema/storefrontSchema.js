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
 * Convert a ThemeSettings object to CSS custom properties for injection.
 * @param {ThemeSettings} theme
 * @returns {Object}
 */
export function themeToCSS(theme) {
    return {
        '--seller-brand': theme.brandColor,
        '--seller-brand-secondary': theme.secondaryColor,
        '--seller-bg': theme.backgroundColor,
        '--seller-text': theme.textColor,
        '--seller-text-muted': theme.mutedTextColor,
        '--seller-heading-font': `"${theme.headingFont}", sans-serif`,
        '--seller-body-font': `"${theme.bodyFont}", sans-serif`,
        '--seller-font-size': `${theme.baseFontSize}px`,
        '--seller-radius': resolveBorderRadius(theme.borderRadius),
        '--seller-header-bg': theme.headerStyle === 'dark' ? '#0F172A' : '#FFFFFF',
        '--seller-header-text': theme.headerStyle === 'dark' ? '#FFFFFF' : '#0F172A',
    };
}
