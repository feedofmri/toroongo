import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Trash2 } from 'lucide-react';
import useBuilderStore from '../store/useBuilderStore.js';
import { widgetRegistry } from '../widgets/widgetRegistry.js';

/**
 * SortableWidgetWrapper
 * Wraps each widget in the builder stage with drag handle, selection, and action buttons.
 */
export default function SortableWidgetWrapper({ widget, children }) {
    const selectedWidgetId = useBuilderStore((s) => s.selectedWidgetId);
    const selectWidget = useBuilderStore((s) => s.selectWidget);
    const removeWidget = useBuilderStore((s) => s.removeWidget);
    const duplicateWidget = useBuilderStore((s) => s.duplicateWidget);

    const isSelected = selectedWidgetId === widget.id;
    const entry = widgetRegistry[widget.type];

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: widget.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative transition-all duration-150
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg z-10' : 'hover:ring-1 hover:ring-blue-200 hover:ring-offset-1 rounded-lg'}`}
            onClick={(e) => { e.stopPropagation(); selectWidget(widget.id); }}
        >
            {/* Hover/Selected toolbar */}
            <div className={`absolute -top-8 left-2 z-20 flex items-center gap-1 bg-blue-500 text-white text-[10px] font-semibold rounded-t-lg px-2 py-1 transition-opacity
                ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-blue-600 rounded"
                    title="Drag to reorder"
                >
                    <GripVertical size={12} />
                </button>
                <span className="px-1">{entry?.label || widget.type}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); duplicateWidget(widget.id); }}
                    className="p-0.5 hover:bg-blue-600 rounded"
                    title="Duplicate"
                >
                    <Copy size={11} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
                    className="p-0.5 hover:bg-red-500 rounded"
                    title="Delete"
                >
                    <Trash2 size={11} />
                </button>
            </div>

            {children}
        </div>
    );
}
