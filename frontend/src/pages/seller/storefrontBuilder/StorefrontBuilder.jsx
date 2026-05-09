import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Undo2, Redo2, Eye } from 'lucide-react';
import useBuilderStore from './store/useBuilderStore.js';
import BuilderSidebar from './components/BuilderSidebar.jsx';
import BuilderStage from './components/BuilderStage.jsx';
import ViewportToggle from './components/ViewportToggle.jsx';
import { getStorefrontConfig, saveStorefrontConfig } from './services/storefrontService.js';
import iconColourful from '../../../assets/Logo/icon_colourful.png';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { widgetRegistry } from './widgets/widgetRegistry.js';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * StorefrontBuilder Page
 * Full-screen builder UI with sidebar controls and live preview stage.
 * Loads/saves storefront config from localStorage.
 */
export default function StorefrontBuilder() {
    const loadConfig = useBuilderStore((s) => s.loadConfig);
    const getConfig = useBuilderStore((s) => s.getConfig);
    const markSaved = useBuilderStore((s) => s.markSaved);
    const isDirty = useBuilderStore((s) => s.isDirty);
    const undo = useBuilderStore((s) => s.undo);
    const redo = useBuilderStore((s) => s.redo);
    const undoStack = useBuilderStore((s) => s.undoStack);
    const redoStack = useBuilderStore((s) => s.redoStack);
    const addWidget = useBuilderStore((s) => s.addWidget);
    const reorderWidgets = useBuilderStore((s) => s.reorderWidgets);
    const [saveSuccess, setSaveSuccess] = React.useState(false);

    const { t } = useTranslation();
    const { user } = useAuth();

    const sellerId = user?.id ?? null;
    const storeSlug = user?.slug || user?.id || 'sony-electronics';

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

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

    const handleSave = useCallback(async () => {
        const config = getConfig();
        await saveStorefrontConfig(sellerId, config);
        markSaved();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }, [getConfig, markSaved, sellerId]);

    // Load saved config on mount
    useEffect(() => {
        let cancelled = false;
        getStorefrontConfig(sellerId).then((saved) => {
            if (cancelled) return;
            if (saved && saved.widgets && saved.widgets.length > 0) {
                loadConfig(saved, sellerId);
            } else {
                loadConfig(null, sellerId);
            }
        });
        return () => { cancelled = true; };
    }, [loadConfig, sellerId]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, handleSave]);

    const handlePreview = () => {
        handleSave();
        window.open(`/${storeSlug}`, '_blank');
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Top Toolbar */}
            <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <Link
                        to="/seller"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <img src={iconColourful} alt="Toroongo" className="w-6 h-6" />
                        <span className="font-semibold hidden sm:inline">{t('builder.backToDashboard')}</span>
                    </Link>
                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                    <span className="text-sm font-semibold text-gray-700 hidden sm:inline">{t('builder.title')}</span>
                </div>

                <ViewportToggle />

                <div className="flex items-center gap-2">
                    <button
                        onClick={undo}
                        disabled={undoStack.length === 0}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title={t('builder.undo')}
                    >
                        <Undo2 size={16} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={redoStack.length === 0}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title={t('builder.redo')}
                    >
                        <Redo2 size={16} />
                    </button>
                    <div className="h-6 w-px bg-gray-200" />
                    <button
                        onClick={handlePreview}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <Eye size={14} />
                        <span className="hidden sm:inline">{t('builder.preview')}</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all
                            ${saveSuccess 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : (isDirty ? 'bg-brand-primary text-white hover:bg-brand-secondary' : 'bg-gray-50 text-gray-400 cursor-default')
                            }`}
                    >
                        {saveSuccess ? (
                            <>
                                <span className="flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    <span className="hidden sm:inline">{t('builder.savedSuccess')}</span>
                                </span>
                            </>
                        ) : (
                            <>
                                <Save size={14} />
                                <span className="hidden sm:inline">{isDirty ? t('builder.save') : t('builder.saved')}</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Area: Sidebar + Stage */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-1 overflow-hidden">
                    <BuilderSidebar />
                    <BuilderStage />
                </div>
            </DndContext>
        </div>
    );
}
