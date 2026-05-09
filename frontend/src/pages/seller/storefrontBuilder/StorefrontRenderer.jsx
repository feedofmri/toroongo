import React, { useEffect } from 'react';
import { widgetRegistry } from './widgets/widgetRegistry.js';
import { resolveSpacing, themeToCSS } from './schema/storefrontSchema.js';

function loadGoogleFonts(headingFont, bodyFont) {
    const fonts = [...new Set([headingFont, bodyFont].filter(Boolean))];
    if (!fonts.length) return;
    const families = fonts
        .map((f) => `family=${f.replace(/ /g, '+')}:ital,wght@0,400;0,500;0,600;0,700;1,400`)
        .join('&');
    const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    const existing = document.getElementById('seller-google-fonts');
    if (existing) {
        existing.href = href;
    } else {
        const link = document.createElement('link');
        link.id = 'seller-google-fonts';
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

/**
 * StorefrontRenderer
 * Pure rendering engine that takes a StorefrontSchema JSON and renders widgets.
 * Shared between the builder preview and the public storefront page.
 *
 * @param {Object} props
 * @param {import('./schema/storefrontSchema.js').StorefrontSchema} props.schema
 * @param {Array} [props.products] - Seller products for product widgets
 * @param {Function} [props.onWidgetClick] - Callback when a widget is clicked (builder mode)
 * @param {string} [props.selectedWidgetId] - Currently selected widget ID (builder mode)
 * @param {boolean} [props.isBuilder] - Whether in builder mode (enables selection outlines)
 * @param {string|number} [props.sellerId] - Seller ID injected into every widget
 */
export default function StorefrontRenderer({ schema, products = [], onWidgetClick, selectedWidgetId, isBuilder = false, sellerId }) {
    if (!schema) return null;

    const { theme, widgets } = schema;
    const themeStyles = themeToCSS(theme);

    useEffect(() => {
        if (theme?.headingFont || theme?.bodyFont) {
            loadGoogleFonts(theme.headingFont, theme.bodyFont);
        }
    }, [theme?.headingFont, theme?.bodyFont]);

    return (
        <div
            className="storefront-root min-h-[200px]"
            style={{
                ...themeStyles,
                backgroundColor: 'var(--seller-bg, #FFFFFF)',
                fontFamily: 'var(--seller-body-font, Inter, sans-serif)',
                fontSize: 'var(--seller-font-size, 16px)',
                color: 'var(--seller-text, #0F172A)',
            }}
        >
            {widgets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">
                        {isBuilder ? 'Drag widgets here to start building your storefront' : 'This storefront is being set up'}
                    </p>
                </div>
            )}

            {widgets.map((widget) => {
                const entry = widgetRegistry[widget.type];
                if (!entry) return null;

                const Component = entry.component;
                const { layout } = widget;

                // Resolve layout values
                const paddingTop = resolveSpacing(layout.paddingTop);
                const paddingBottom = resolveSpacing(layout.paddingBottom);
                const isFullWidth = layout.containerWidth === 'full';
                const hideOnMobile = layout.hideOnMobile;
                const hideOnDesktop = layout.hideOnDesktop;

                // Build responsive visibility classes
                let visibilityClass = '';
                if (hideOnMobile && !hideOnDesktop) visibilityClass = 'hidden sm:block';
                else if (hideOnDesktop && !hideOnMobile) visibilityClass = 'block sm:hidden';
                else if (hideOnMobile && hideOnDesktop) visibilityClass = 'hidden';

                // Inject runtime props (products, sellerId) into widgets
                const widgetProps = { ...widget.props };
                if (widget.type === 'ProductGrid' && products.length > 0) {
                    widgetProps.products = products;
                }
                if (sellerId) widgetProps.sellerId = sellerId;

                const isSelected = isBuilder && selectedWidgetId === widget.id;

                return (
                    <div
                        key={widget.id}
                        className={`storefront-widget-wrapper ${visibilityClass} ${isBuilder ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-brand-primary ring-offset-2 rounded-lg' : ''}`}
                        style={{ paddingTop, paddingBottom }}
                        onClick={isBuilder ? (e) => { e.stopPropagation(); onWidgetClick?.(widget.id); } : undefined}
                        data-widget-id={widget.id}
                        data-widget-type={widget.type}
                    >
                        <div className={isFullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
                            <Component {...widgetProps} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
