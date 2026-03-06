import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { getWidgetCategories, getWidgetsByCategory } from '../widgets/widgetRegistry.js';

/**
 * WidgetPalette
 * Shows all available widgets grouped by category.
 * Each widget card is draggable to the builder stage.
 */
export default function WidgetPalette() {
    const categories = getWidgetCategories();

    return (
        <div className="space-y-6">
            {categories.map((category) => {
                const widgets = getWidgetsByCategory(category);
                return (
                    <div key={category}>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-1">
                            {category}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {widgets.map(({ type, icon: Icon, label }) => (
                                <DraggableWidgetCard key={type} type={type} icon={Icon} label={label} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// eslint-disable-next-line no-unused-vars
function DraggableWidgetCard({ type, icon: Icon, label }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${type}`,
        data: { type, fromPalette: true },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white
                cursor-grab active:cursor-grabbing hover:border-blue-200 hover:bg-brand-primary/10/50 transition-colors
                ${isDragging ? 'opacity-50 ring-2 ring-brand-primary' : ''}`}
        >
            <Icon size={20} className="text-gray-500" />
            <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">{label}</span>
        </div>
    );
}
