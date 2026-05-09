import React, { useState } from 'react';
import { LayoutGrid, Palette, SlidersHorizontal } from 'lucide-react';
import WidgetPalette from './WidgetPalette.jsx';
import ThemePanel from './ThemePanel.jsx';
import PropertyEditor from './PropertyEditor.jsx';
import useBuilderStore from '../store/useBuilderStore.js';
import { useTranslation } from 'react-i18next';

/**
 * BuilderSidebar
 * Left sidebar of the builder with three tabs: Widgets, Theme, Properties.
 * Automatically switches to Properties when a widget is selected.
 */
const TABS = [
    { id: 'widgets', labelKey: 'builder.tabs.widgets', label: 'Widgets', icon: LayoutGrid },
    { id: 'theme', labelKey: 'builder.tabs.theme', label: 'Theme', icon: Palette },
    { id: 'properties', labelKey: 'builder.tabs.properties', label: 'Properties', icon: SlidersHorizontal },
];

export default function BuilderSidebar() {
    const [activeTab, setActiveTab] = useState('widgets');
    const selectedWidgetId = useBuilderStore((s) => s.selectedWidgetId);
    const heroSelected     = useBuilderStore((s) => s.heroSelected);
    const { t }            = useTranslation();

    const hasSelection = !!selectedWidgetId || heroSelected;

    // Auto-switch to properties when a widget or the hero section is selected
    const effectiveTab = hasSelection ? 'properties' : activeTab === 'properties' ? 'widgets' : activeTab;

    const handleTabChange = (tabId) => {
        if (tabId === 'properties' && !hasSelection) return;
        setActiveTab(tabId);
        if (tabId !== 'properties') {
            useBuilderStore.getState().selectWidget(null);
            useBuilderStore.getState().deselectHero();
        }
    };

    return (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 shrink-0">
                {TABS.map((tab) => {
                    const isActive = effectiveTab === tab.id;
                    const isDisabled = tab.id === 'properties' && !hasSelection;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            disabled={isDisabled}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors border-b-2
                                ${isActive
                                    ? 'border-brand-primary text-brand-primary'
                                    : isDisabled
                                        ? 'border-transparent text-gray-300 cursor-not-allowed'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <tab.icon size={14} />
                            {t(tab.labelKey, tab.label)}
                        </button>
                    );
                })}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {effectiveTab === 'widgets' && <WidgetPalette />}
                {effectiveTab === 'theme' && <ThemePanel />}
                {effectiveTab === 'properties' && <PropertyEditor />}
            </div>
        </aside>
    );
}
