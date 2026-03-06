import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Undo2, Redo2, Eye } from 'lucide-react';
import useBuilderStore from './store/useBuilderStore.js';
import BuilderSidebar from './components/BuilderSidebar.jsx';
import BuilderStage from './components/BuilderStage.jsx';
import ViewportToggle from './components/ViewportToggle.jsx';
import { getStorefrontConfig, saveStorefrontConfig } from './services/storefrontService.js';
import iconColourful from '../../../assets/Logo/icon_colourful.png';

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

    // Current seller (hardcoded to match SellerDashboardLayout for now)
    const sellerId = 'seller_1';

    const handleSave = useCallback(() => {
        const config = getConfig();
        saveStorefrontConfig(sellerId, config);
        markSaved();
    }, [getConfig, markSaved, sellerId]);

    // Load saved config on mount
    useEffect(() => {
        const saved = getStorefrontConfig(sellerId);
        if (saved) {
            loadConfig(saved, sellerId);
        } else {
            loadConfig(null, sellerId);
        }
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
        window.open('/sony-electronics', '_blank');
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
                        <span className="font-semibold hidden sm:inline">Back to Dashboard</span>
                    </Link>
                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                    <span className="text-sm font-semibold text-gray-700 hidden sm:inline">Storefront Builder</span>
                </div>

                <ViewportToggle />

                <div className="flex items-center gap-2">
                    <button
                        onClick={undo}
                        disabled={undoStack.length === 0}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={16} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={redoStack.length === 0}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 size={16} />
                    </button>
                    <div className="h-6 w-px bg-gray-200" />
                    <button
                        onClick={handlePreview}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Preview</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors
                            ${isDirty ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-default'}`}
                    >
                        <Save size={14} />
                        <span className="hidden sm:inline">{isDirty ? 'Save' : 'Saved'}</span>
                    </button>
                </div>
            </header>

            {/* Main Area: Sidebar + Stage */}
            <div className="flex flex-1 overflow-hidden">
                <BuilderSidebar />
                <BuilderStage />
            </div>
        </div>
    );
}
