import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useBuilderStore from '../store/useBuilderStore.js';
import { widgetRegistry } from '../widgets/widgetRegistry.js';
import { resolveSpacing, themeToCSS } from '../schema/storefrontSchema.js';
import SortableWidgetWrapper from './SortableWidgetWrapper.jsx';
import { getViewportWidth } from '../utils/viewportUtils.js';

/**
 * BuilderStage
 * The main droppable preview canvas where widgets are rendered, sorted, and selected.
 */
export default function BuilderStage() {
    const widgets = useBuilderStore((s) => s.widgets);
    const theme = useBuilderStore((s) => s.theme);
    const viewportMode = useBuilderStore((s) => s.viewportMode);
    const selectWidget = useBuilderStore((s) => s.selectWidget);
    const reorderWidgets = useBuilderStore((s) => s.reorderWidgets);
    const addWidget = useBuilderStore((s) => s.addWidget);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const { setNodeRef: setDroppableRef } = useDroppable({ id: 'builder-canvas' });

    const themeStyles = themeToCSS(theme);
    const viewportWidth = getViewportWidth(viewportMode);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        // Dragging from palette to canvas
        if (active.data?.current?.fromPalette) {
            const widgetType = active.data.current.type;
            const entry = widgetRegistry[widgetType];
            if (entry) {
                addWidget(widgetType, { ...entry.defaultProps });
            }
            return;
        }

        // Reordering within canvas
        if (active.id !== over.id) {
            reorderWidgets(active.id, over.id);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div
                className="flex-1 overflow-y-auto bg-gray-100 p-6"
                onClick={() => selectWidget(null)}
            >
                <div
                    ref={setDroppableRef}
                    className="mx-auto bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 min-h-[600px]"
                    style={{
                        maxWidth: viewportWidth,
                        ...themeStyles,
                        backgroundColor: 'var(--seller-bg, #FFFFFF)',
                        fontFamily: 'var(--seller-body-font, Inter, sans-serif)',
                        fontSize: 'var(--seller-font-size, 16px)',
                        color: 'var(--seller-text, #0F172A)',
                    }}
                >
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
                                            style={{ paddingTop, paddingBottom }}
                                        >
                                            <div className={isFullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
                                                <Component {...widget.props} />
                                            </div>
                                        </div>
                                    </SortableWidgetWrapper>
                                );
                            })}
                        </SortableContext>
                    )}
                </div>
            </div>
        </DndContext>
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
