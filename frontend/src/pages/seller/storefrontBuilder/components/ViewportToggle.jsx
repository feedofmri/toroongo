import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import useBuilderStore from '../store/useBuilderStore.js';

/**
 * ViewportToggle
 * Toolbar buttons to switch between desktop, tablet, and mobile preview widths.
 */
const VIEWPORTS = [
    { mode: 'desktop', icon: Monitor, label: 'Desktop' },
    { mode: 'tablet', icon: Tablet, label: 'Tablet' },
    { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
];

export default function ViewportToggle() {
    const viewportMode = useBuilderStore((s) => s.viewportMode);
    const setViewport = useBuilderStore((s) => s.setViewport);

    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {VIEWPORTS.map((viewport) => {
                const IconComponent = viewport.icon;
                return (
                    <button
                        key={viewport.mode}
                        onClick={() => setViewport(viewport.mode)}
                        title={viewport.label}
                        className={`p-2 rounded-md transition-colors ${
                            viewportMode === viewport.mode
                                ? 'bg-white text-brand-primary shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <IconComponent size={16} />
                    </button>
                );
            })}
        </div>
    );
}
