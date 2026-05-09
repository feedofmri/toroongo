import { create } from 'zustand';
import {
    createDefaultTheme,
    createWidgetBlock,
    createDefaultStorefrontConfig,
} from '../schema/storefrontSchema.js';

const MAX_HISTORY = 50;

/**
 * Zustand store for the Storefront Builder.
 * Manages the active layout state, selected widget, theme, viewport, undo/redo.
 */
export const useBuilderStore = create((set, get) => ({
    // ── State ────────────────────────────────────────────
    /** @type {import('../schema/storefrontSchema.js').ThemeSettings} */
    theme: createDefaultTheme(),

    /** @type {import('../schema/storefrontSchema.js').WidgetBlock[]} */
    widgets: [],

    /** @type {string|null} */
    selectedWidgetId: null,

    /** @type {'desktop' | 'tablet' | 'mobile'} */
    viewportMode: 'desktop',

    /** @type {boolean} */
    isDirty: false,

    /** @type {string[][]} - Array of serialized snapshots for undo */
    undoStack: [],

    /** @type {string[][]} - Array of serialized snapshots for redo */
    redoStack: [],

    /** @type {string|null} - Seller ID this config belongs to */
    sellerId: null,

    // ── Snapshot helpers ──────────────────────────────────
    _pushUndo: () => {
        const { theme, widgets, undoStack } = get();
        const snapshot = JSON.stringify({ theme, widgets });
        set({
            undoStack: [...undoStack.slice(-MAX_HISTORY), snapshot],
            redoStack: [],
            isDirty: true,
        });
    },

    // ── Widget Actions ───────────────────────────────────

    /**
     * Add a new widget at the given index (or end).
     * @param {string} type - Widget type key
     * @param {Object} [defaultProps={}]
     * @param {number} [index] - Insertion index (default: end)
     */
    addWidget: (type, defaultProps = {}, index) => {
        get()._pushUndo();
        const widget = createWidgetBlock(type, { ...defaultProps });
        set((state) => {
            const widgets = [...state.widgets];
            if (typeof index === 'number') {
                widgets.splice(index, 0, widget);
            } else {
                widgets.push(widget);
            }
            return { widgets, selectedWidgetId: widget.id };
        });
    },

    /**
     * Remove a widget by ID.
     * @param {string} widgetId
     */
    removeWidget: (widgetId) => {
        get()._pushUndo();
        set((state) => ({
            widgets: state.widgets.filter((w) => w.id !== widgetId),
            selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
        }));
    },

    /**
     * Duplicate a widget.
     * @param {string} widgetId
     */
    duplicateWidget: (widgetId) => {
        get()._pushUndo();
        set((state) => {
            const idx = state.widgets.findIndex((w) => w.id === widgetId);
            if (idx === -1) return state;
            const original = state.widgets[idx];
            const clone = createWidgetBlock(original.type, { ...original.props }, { ...original.layout });
            const widgets = [...state.widgets];
            widgets.splice(idx + 1, 0, clone);
            return { widgets, selectedWidgetId: clone.id };
        });
    },

    /**
     * Move a widget from oldIndex to newIndex.
     * @param {number} oldIndex
     * @param {number} newIndex
     */
    moveWidget: (oldIndex, newIndex) => {
        get()._pushUndo();
        set((state) => {
            const widgets = [...state.widgets];
            const [removed] = widgets.splice(oldIndex, 1);
            widgets.splice(newIndex, 0, removed);
            return { widgets };
        });
    },

    /**
     * Reorder widgets using dnd-kit's array move.
     * @param {string} activeId
     * @param {string} overId
     */
    reorderWidgets: (activeId, overId) => {
        if (activeId === overId) return;
        const { widgets } = get();
        const oldIndex = widgets.findIndex((w) => w.id === activeId);
        const newIndex = widgets.findIndex((w) => w.id === overId);
        if (oldIndex === -1 || newIndex === -1) return;
        get().moveWidget(oldIndex, newIndex);
    },

    /**
     * Update a widget's props (shallow merge).
     * @param {string} widgetId
     * @param {Object} newProps
     */
    updateWidgetProps: (widgetId, newProps) => {
        set((state) => ({
            widgets: state.widgets.map((w) =>
                w.id === widgetId ? { ...w, props: { ...w.props, ...newProps } } : w
            ),
            isDirty: true
        }));
    },

    /**
     * Update a widget's layout controls (shallow merge).
     * @param {string} widgetId
     * @param {Partial<import('../schema/storefrontSchema.js').WidgetLayout>} newLayout
     */
    updateWidgetLayout: (widgetId, newLayout) => {
        set((state) => ({
            widgets: state.widgets.map((w) =>
                w.id === widgetId ? { ...w, layout: { ...w.layout, ...newLayout } } : w
            ),
            isDirty: true
        }));
    },

    /**
     * Update a widget's style overrides (shallow merge). Pass null for a key to clear that override.
     * @param {string} widgetId
     * @param {Partial<import('../schema/storefrontSchema.js').WidgetStyleOverride>} styleUpdates
     */
    updateWidgetStyle: (widgetId, styleUpdates) => {
        set((state) => ({
            widgets: state.widgets.map((w) =>
                w.id === widgetId ? { ...w, style: { ...(w.style || {}), ...styleUpdates } } : w
            ),
            isDirty: true,
        }));
    },

    /**
     * Record the current state into the undo stack explicitly.
     */
    commitHistory: () => {
        get()._pushUndo();
    },

    /**
     * Select a widget (or deselect by passing null).
     * @param {string|null} widgetId
     */
    selectWidget: (widgetId) => {
        set({ selectedWidgetId: widgetId });
    },

    // ── Theme Actions ────────────────────────────────────

    /**
     * Update global theme settings (shallow merge).
     * @param {Partial<import('../schema/storefrontSchema.js').ThemeSettings>} updates
     */
    updateTheme: (updates) => {
        get()._pushUndo();
        set((state) => ({
            theme: { ...state.theme, ...updates },
        }));
    },

    // ── Viewport ─────────────────────────────────────────

    /** @param {'desktop' | 'tablet' | 'mobile'} mode */
    setViewport: (mode) => set({ viewportMode: mode }),

    // ── Undo / Redo ──────────────────────────────────────

    undo: () => {
        const { undoStack, theme, widgets } = get();
        if (undoStack.length === 0) return;
        const currentSnapshot = JSON.stringify({ theme, widgets });
        const previous = undoStack[undoStack.length - 1];
        const parsed = JSON.parse(previous);
        set((state) => ({
            theme: parsed.theme,
            widgets: parsed.widgets,
            undoStack: state.undoStack.slice(0, -1),
            redoStack: [...state.redoStack, currentSnapshot],
            isDirty: true,
        }));
    },

    redo: () => {
        const { redoStack, theme, widgets } = get();
        if (redoStack.length === 0) return;
        const currentSnapshot = JSON.stringify({ theme, widgets });
        const next = redoStack[redoStack.length - 1];
        const parsed = JSON.parse(next);
        set((state) => ({
            theme: parsed.theme,
            widgets: parsed.widgets,
            redoStack: state.redoStack.slice(0, -1),
            undoStack: [...state.undoStack, currentSnapshot],
            isDirty: true,
        }));
    },

    // ── Load / Save ──────────────────────────────────────

    /**
     * Hydrate the store from a saved JSON config.
     * @param {import('../schema/storefrontSchema.js').StorefrontSchema} config
     * @param {string} [sellerId]
     */
    loadConfig: (config, sellerId) => {
        const defaults = createDefaultStorefrontConfig();
        set({
            theme: config?.theme || defaults.theme,
            widgets: config?.widgets || defaults.widgets,
            selectedWidgetId: null,
            undoStack: [],
            redoStack: [],
            isDirty: false,
            sellerId: sellerId || null,
        });
    },

    /**
     * Serialize the current state to a StorefrontSchema.
     * @returns {import('../schema/storefrontSchema.js').StorefrontSchema}
     */
    getConfig: () => {
        const { theme, widgets } = get();
        return { theme, widgets };
    },

    /**
     * Mark state as saved (not dirty).
     */
    markSaved: () => set({ isDirty: false }),
}));

export default useBuilderStore;
