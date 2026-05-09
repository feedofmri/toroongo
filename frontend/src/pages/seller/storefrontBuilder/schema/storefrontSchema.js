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
 * @property {string} headingFont           - Google Font name for headings
 * @property {string} bodyFont              - Google Font name for body text
 * @property {number} baseFontSize          - Base font size in px (12-22)
 * @property {string} headingWeight         - CSS font-weight for headings (100-900)
 * @property {string} bodyWeight            - CSS font-weight for body text (100-900)
 * @property {string} headingLetterSpacing  - Letter-spacing preset for headings
 * @property {string} bodyLetterSpacing     - Letter-spacing preset for body
 * @property {string} headingLineHeight     - Line-height preset for headings
 * @property {string} bodyLineHeight        - Line-height preset for body
 * @property {'none'|'uppercase'|'capitalize'} headingTransform - text-transform for headings
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
 * @typedef {Object} HeroConfig
 * @property {string|null} bannerImage      - Override banner image URL
 * @property {string|null} storeName        - Override store display name
 * @property {string|null} tagline          - Subtitle line below store name
 * @property {boolean}     showRating       - Show star rating row
 * @property {boolean}     showContact      - Show Contact button
 * @property {string}      contactText      - Contact button label
 * @property {number}      overlayOpacity   - Dark overlay strength (0–100)
 * @property {string|null} nameFont         - Font family for store name (null = heading font)
 * @property {string|null} nameSize         - Font size preset for store name
 * @property {string|null} nameWeight       - Font weight for store name
 * @property {string|null} nameColor        - Text color for store name (null = white)
 * @property {string|null} taglineSize      - Font size preset for tagline
 * @property {string|null} taglineColor     - Text color for tagline (null = white/80)
 */

/** @returns {HeroConfig} */
export function createDefaultHero() {
    return {
        bannerImage: null,
        storeName: null,
        tagline: null,
        showRating: true,
        showContact: true,
        contactText: 'Contact',
        overlayOpacity: 70,
        // Text styles
        nameFont: null,
        nameSize: null,
        nameWeight: null,
        nameColor: null,
        taglineSize: null,
        taglineColor: null,
    };
}

/**
 * @typedef {Object} StorefrontSchema
 * @property {ThemeSettings} theme
 * @property {HeroConfig} hero
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
        headingWeight: '700',
        bodyWeight: '400',
        headingLetterSpacing: 'normal',
        bodyLetterSpacing: 'normal',
        headingLineHeight: 'tight',
        bodyLineHeight: 'relaxed',
        headingTransform: 'none',
        borderRadius: 'rounded',
        widgetRadius: 'rounded',
        cardStyle: 'shadow',
        headerStyle: 'light',
        logoPosition: 'left',
        stickyHeader: true,
    };
}

/**
 * @param {'tight'|'normal'|'wide'|'wider'|'widest'} key
 * @returns {string}
 */
export function resolveLetterSpacing(key) {
    const map = { tight: '-0.04em', normal: '0em', wide: '0.05em', wider: '0.1em', widest: '0.2em' };
    return map[key] ?? '0em';
}

/**
 * @param {'tight'|'snug'|'normal'|'relaxed'|'loose'} key
 * @returns {string}
 */
export function resolveLineHeight(key) {
    const map = { tight: '1.1', snug: '1.25', normal: '1.5', relaxed: '1.65', loose: '2.0' };
    return map[key] ?? '1.5';
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
 * @typedef {Object} WidgetStyleOverride
 * @property {string|null} [backgroundColor]
 * @property {string|null} [brandColor]
 * @property {string|null} [secondaryColor]
 * @property {string|null} [textColor]
 * @property {string|null} [mutedTextColor]
 * @property {string|null} [headingFont]
 * @property {string|null} [bodyFont]
 * @property {string|null} [headingWeight]
 * @property {string|null} [bodyWeight]
 * @property {string|null} [headingLetterSpacing]
 * @property {string|null} [bodyLetterSpacing]
 * @property {string|null} [headingLineHeight]
 * @property {string|null} [bodyLineHeight]
 * @property {string|null} [headingTransform]
 * @property {string|null} [borderRadius]
 */

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
        style: {},
    };
}

/**
 * Convert widget-level style overrides to CSS custom properties.
 * Only emits vars for fields that are explicitly set (non-null/non-empty).
 * @param {WidgetStyleOverride} [style={}]
 * @returns {Object}
 */
export function widgetStyleToVars(style = {}) {
    if (!style) return {};
    const vars = {};
    if (style.backgroundColor) vars['--seller-bg'] = style.backgroundColor;
    if (style.brandColor) vars['--seller-brand'] = style.brandColor;
    if (style.secondaryColor) vars['--seller-brand-secondary'] = style.secondaryColor;
    if (style.textColor) vars['--seller-text'] = style.textColor;
    if (style.mutedTextColor) vars['--seller-text-muted'] = style.mutedTextColor;
    if (style.headingFont) vars['--seller-heading-font'] = `"${style.headingFont}", sans-serif`;
    if (style.bodyFont) vars['--seller-body-font'] = `"${style.bodyFont}", sans-serif`;
    if (style.headingWeight) vars['--seller-heading-weight'] = style.headingWeight;
    if (style.bodyWeight) vars['--seller-body-weight'] = style.bodyWeight;
    if (style.headingLetterSpacing) vars['--seller-heading-tracking'] = resolveLetterSpacing(style.headingLetterSpacing);
    if (style.bodyLetterSpacing) vars['--seller-body-tracking'] = resolveLetterSpacing(style.bodyLetterSpacing);
    if (style.headingLineHeight) vars['--seller-heading-leading'] = resolveLineHeight(style.headingLineHeight);
    if (style.bodyLineHeight) vars['--seller-body-leading'] = resolveLineHeight(style.bodyLineHeight);
    if (style.headingTransform) vars['--seller-heading-transform'] = style.headingTransform;
    if (style.borderRadius) vars['--seller-radius'] = resolveBorderRadius(style.borderRadius);
    return vars;
}

/** @returns {StorefrontSchema} */
export function createDefaultStorefrontConfig() {
    return {
        theme: createDefaultTheme(),
        hero: createDefaultHero(),
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
        // Heading typography
        '--seller-heading-font': `"${theme.headingFont}", sans-serif`,
        '--seller-heading-weight': theme.headingWeight || '700',
        '--seller-heading-tracking': resolveLetterSpacing(theme.headingLetterSpacing || 'normal'),
        '--seller-heading-leading': resolveLineHeight(theme.headingLineHeight || 'tight'),
        '--seller-heading-transform': theme.headingTransform || 'none',
        // Body typography
        '--seller-body-font': `"${theme.bodyFont}", sans-serif`,
        '--seller-body-weight': theme.bodyWeight || '400',
        '--seller-body-tracking': resolveLetterSpacing(theme.bodyLetterSpacing || 'normal'),
        '--seller-body-leading': resolveLineHeight(theme.bodyLineHeight || 'relaxed'),
        '--seller-font-size': `${theme.baseFontSize}px`,
        // Shape
        '--seller-radius': resolveBorderRadius(theme.borderRadius),
        '--seller-widget-radius': resolveBorderRadius(theme.widgetRadius || 'rounded'),
        // Header
        '--seller-header-bg': isDark ? '#0F172A' : '#FFFFFF',
        '--seller-header-text': isDark ? '#FFFFFF' : '#0F172A',
        '--seller-header-text-muted': isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.45)',
        '--seller-header-border': isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        // Cards
        '--seller-card-shadow': cardShadow,
        '--seller-card-border-color': cardBorderColor,
    };
}
