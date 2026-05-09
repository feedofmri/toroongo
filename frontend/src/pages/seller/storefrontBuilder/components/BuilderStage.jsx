import React, { useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useBuilderStore from '../store/useBuilderStore.js';
import { widgetRegistry } from '../widgets/widgetRegistry.js';
import { resolveSpacing, themeToCSS, widgetStyleToVars } from '../schema/storefrontSchema.js';
import SortableWidgetWrapper from './SortableWidgetWrapper.jsx';
import { getViewportWidth } from '../utils/viewportUtils.js';
import { BuilderHeaderChrome, BuilderFooterChrome } from './BuilderPreviewChrome.jsx';

/**
 * BuilderStage
 * The main droppable preview canvas where widgets are rendered, sorted, and selected.
 */
export default function BuilderStage() {
    const widgets = useBuilderStore((s) => s.widgets);
    const theme = useBuilderStore((s) => s.theme);
    const viewportMode = useBuilderStore((s) => s.viewportMode);
    const selectWidget = useBuilderStore((s) => s.selectWidget);
    const sellerId = useBuilderStore((s) => s.sellerId);

    const { setNodeRef: setDroppableRef } = useDroppable({ id: 'builder-canvas' });

    const themeStyles = themeToCSS(theme);
    const viewportWidth = getViewportWidth(viewportMode);

    // Load Google Fonts whenever the selected fonts change
    useEffect(() => {
        const fonts = [...new Set([theme.headingFont, theme.bodyFont].filter(Boolean))];
        if (!fonts.length) return;
        const families = fonts
            .map((f) => `family=${f.replace(/ /g, '+')}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400`)
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
    }, [theme.headingFont, theme.bodyFont]);

    return (
        <div
            className="flex-1 overflow-y-auto bg-gray-100 p-6"
            onClick={() => selectWidget(null)}
        >
            <div
                ref={setDroppableRef}
                className="storefront-root mx-auto bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300"
                style={{
                    maxWidth: viewportWidth,
                    ...themeStyles,
                    backgroundColor: 'var(--seller-bg, #FFFFFF)',
                    fontFamily: 'var(--seller-body-font, Inter, sans-serif)',
                    fontSize: 'var(--seller-font-size, 16px)',
                    fontWeight: 'var(--seller-body-weight, 400)',
                    letterSpacing: 'var(--seller-body-tracking, 0em)',
                    lineHeight: 'var(--seller-body-leading, 1.65)',
                    color: 'var(--seller-text, #0F172A)',
                }}
            >
                {/* Preview chrome: header, banner, nav tabs */}
                <BuilderHeaderChrome />

                {/* Widget canvas */}
                <div className="min-h-[300px]">
                    {widgets.length === 0 ? (
                        <EmptyCanvas />
                    ) : (
                        <SortableContext
                            items={widgets.map((w) => w.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {widgets.map((widget) => {
                                const entry = widgetRegistry[widget.type];
                                if (!entry) return null;

                                const Component = entry.component;
                                const { layout } = widget;
                                const paddingTop = resolveSpacing(layout.paddingTop);
                                const paddingBottom = resolveSpacing(layout.paddingBottom);
                                const isFullWidth = layout.containerWidth === 'full';

                                let visibilityClass = '';
                                if (layout.hideOnMobile && !layout.hideOnDesktop) visibilityClass = 'hidden sm:block';
                                else if (layout.hideOnDesktop && !layout.hideOnMobile) visibilityClass = 'block sm:hidden';
                                else if (layout.hideOnMobile && layout.hideOnDesktop) visibilityClass = 'hidden';

                                return (
                                    <SortableWidgetWrapper key={widget.id} widget={widget}>
                                        <div
                                            className={visibilityClass}
                                            style={{ paddingTop, paddingBottom, ...widgetStyleToVars(widget.style) }}
                                        >
                                            <div className={isFullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
                                                <Component {...widget.props} sellerId={sellerId} />
                                            </div>
                                        </div>
                                    </SortableWidgetWrapper>
                                );
                            })}
                        </SortableContext>
                    )}
                </div>

                {/* Preview chrome: footer */}
                <BuilderFooterChrome />
            </div>
        </div>
    );
}

function EmptyCanvas() {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center px-8">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Start Building</h3>
            <p className="text-sm text-gray-300 max-w-xs">
                Drag widgets from the left panel or click the "+" on a widget card to add it to your storefront.
            </p>
        </div>
    );
}
