import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import useBuilderStore from '../store/useBuilderStore.js';
import { widgetRegistry } from '../widgets/widgetRegistry.js';
import MediaUploader from '../../../../components/ui/MediaUploader.jsx';

export default function PropertyEditor() {
    const selectedWidgetId = useBuilderStore((s) => s.selectedWidgetId);
    const widgets = useBuilderStore((s) => s.widgets);
    const updateWidgetProps = useBuilderStore((s) => s.updateWidgetProps);
    const updateWidgetLayout = useBuilderStore((s) => s.updateWidgetLayout);
    const removeWidget = useBuilderStore((s) => s.removeWidget);
    const duplicateWidget = useBuilderStore((s) => s.duplicateWidget);
    const selectWidget = useBuilderStore((s) => s.selectWidget);
    const commitHistory = useBuilderStore((s) => s.commitHistory);

    const widget = widgets.find((w) => w.id === selectedWidgetId);
    if (!widget) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2z" />
                    </svg>
                </div>
                <p className="text-sm text-gray-400">Click a widget in the preview to edit its properties</p>
            </div>
        );
    }

    const entry = widgetRegistry[widget.type];
    if (!entry) return null;

    const { propertySchema, label, icon: Icon } = entry;

    const handlePropChange = (key, value) => {
        updateWidgetProps(widget.id, { [key]: value });
    };

    const handleLayoutChange = (key, value) => {
        updateWidgetLayout(widget.id, { [key]: value });
        commitHistory();
    };

    return (
        <div className="space-y-5">
            {/* Widget Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Icon size={16} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">{label}</span>
                <button
                    onClick={() => {
                        commitHistory();
                        selectWidget(null);
                    }}
                    className="ml-auto text-xs text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>

            {/* Property Fields */}
            {propertySchema.length > 0 && (
                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Content</h4>
                    <div className="space-y-3">
                        {propertySchema.map((field) => (
                            <PropertyField
                                key={field.key}
                                field={field}
                                value={widget.props[field.key]}
                                onChange={(val) => handlePropChange(field.key, val)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Layout Controls */}
            <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Layout</h4>
                <div className="space-y-3">
                    <LayoutSelect
                        label="Padding Top"
                        value={widget.layout.paddingTop}
                        options={['small', 'medium', 'large']}
                        onChange={(v) => handleLayoutChange('paddingTop', v)}
                    />
                    <LayoutSelect
                        label="Padding Bottom"
                        value={widget.layout.paddingBottom}
                        options={['small', 'medium', 'large']}
                        onChange={(v) => handleLayoutChange('paddingBottom', v)}
                    />
                    <LayoutSelect
                        label="Container Width"
                        value={widget.layout.containerWidth}
                        options={['boxed', 'full']}
                        onChange={(v) => handleLayoutChange('containerWidth', v)}
                    />
                    <LayoutToggle
                        label="Hide on Mobile"
                        checked={widget.layout.hideOnMobile}
                        onChange={(v) => handleLayoutChange('hideOnMobile', v)}
                    />
                    <LayoutToggle
                        label="Hide on Desktop"
                        checked={widget.layout.hideOnDesktop}
                        onChange={(v) => handleLayoutChange('hideOnDesktop', v)}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
                <button
                    onClick={() => duplicateWidget(widget.id)}
                    className="w-full px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Duplicate Widget
                </button>
                <button
                    onClick={() => { removeWidget(widget.id); }}
                    className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                    Delete Widget
                </button>
            </div>
        </div>
    );
}

// ── Property Field renderer ──────────────────────────────

function PropertyField({ field, value, onChange }) {
    switch (field.type) {
        case 'text':
        case 'url':
            return (
                <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.type === 'url' ? 'https://...' : ''}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                </div>
            );
        case 'textarea':
            return (
                <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 resize-none font-mono"
                    />
                </div>
            );
        case 'number':
            return (
                <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                    <input
                        type="number"
                        value={value ?? ''}
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    />
                </div>
            );
        case 'range':
            return (
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs font-medium text-gray-500">{field.label}</label>
                        <span className="text-xs text-gray-400 font-mono">{value}</span>
                    </div>
                    <input
                        type="range"
                        value={value ?? field.min ?? 0}
                        min={field.min ?? 0}
                        max={field.max ?? 100}
                        step={field.step ?? 1}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full accent-brand-primary"
                    />
                </div>
            );
        case 'color':
            return (
                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-500">{field.label}</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={value || '#000000'}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-7 h-7 rounded-md border border-gray-200 cursor-pointer p-0.5"
                        />
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Auto"
                            className="w-20 text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-md"
                        />
                    </div>
                </div>
            );
        case 'select':
            return (
                <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                    <select
                        value={value ?? ''}
                        onChange={(e) => {
                            const v = e.target.value;
                            const parsed = Number(v);
                            onChange(isNaN(parsed) ? v : parsed);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                    >
                        {(field.options || []).map((opt) => (
                            <option key={opt} value={opt}>
                                {typeof opt === 'string' ? opt.charAt(0).toUpperCase() + opt.slice(1) : opt}
                            </option>
                        ))}
                    </select>
                </div>
            );
        case 'toggle':
            return (
                <LayoutToggle label={field.label} checked={!!value} onChange={onChange} />
            );
        case 'datetime': {
            // Convert ISO string → datetime-local value and back
            const localVal = value
                ? new Date(value).toLocaleString('sv-SE', { hour12: false }).replace(' ', 'T').slice(0, 16)
                : '';
            return (
                <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                    <input
                        type="datetime-local"
                        value={localVal}
                        onChange={(e) => {
                            const iso = e.target.value ? new Date(e.target.value).toISOString() : '';
                            onChange(iso);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 bg-white"
                    />
                    {value && (
                        <p className="mt-1 text-[11px] text-gray-400">
                            {new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                    )}
                </div>
            );
        }
        case 'image-upload':
            return <ImageUploadField field={field} value={value} onChange={onChange} />;
        case 'list-editor':
            return <ListEditorField field={field} value={value || []} onChange={onChange} />;
        default:
            return null;
    }
}

// ── Image Upload Field ───────────────────────────────────

function ImageUploadField({ field, value, onChange }) {
    return (
        <div>
            <label className="text-xs font-medium text-gray-500 block mb-2">{field.label}</label>
            <MediaUploader
                value={value ? [value] : []}
                onChange={(urls) => onChange(urls[0] || '')}
                maxFiles={1}
                acceptVideo={field.acceptVideo || false}
                variant="compact"
            />
        </div>
    );
}

// ── List Editor Field ────────────────────────────────────

function ListEditorField({ field, value = [], onChange }) {
    const [expandedIdx, setExpandedIdx] = useState(null);

    const addItem = () => {
        const newItem = {};
        (field.itemSchema || []).forEach((f) => {
            newItem[f.key] = f.default !== undefined ? f.default : '';
        });
        const newValue = [...value, newItem];
        onChange(newValue);
        setExpandedIdx(newValue.length - 1);
    };

    const removeItem = (idx) => {
        onChange(value.filter((_, i) => i !== idx));
        if (expandedIdx === idx) setExpandedIdx(null);
        else if (expandedIdx > idx) setExpandedIdx(expandedIdx - 1);
    };

    const updateItem = (idx, key, val) => {
        onChange(value.map((item, i) => (i === idx ? { ...item, [key]: val } : item)));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">{field.label}</label>
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:opacity-75 transition-opacity"
                >
                    <Plus size={12} /> Add
                </button>
            </div>
            <div className="space-y-1.5">
                {value.length === 0 && (
                    <p className="text-[11px] text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
                        No items yet — click Add to create one
                    </p>
                )}
                {value.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                            className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-left transition-colors"
                        >
                            <span className="text-xs font-medium text-gray-600 truncate">
                                {(field.previewKey && item[field.previewKey]) || `Item ${idx + 1}`}
                            </span>
                            <ChevronDown
                                size={13}
                                className={`text-gray-400 transition-transform shrink-0 ml-2 ${expandedIdx === idx ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {expandedIdx === idx && (
                            <div className="p-3 space-y-3 border-t border-gray-100 bg-white">
                                {(field.itemSchema || []).map((subField) => (
                                    <ListItemSubField
                                        key={subField.key}
                                        field={subField}
                                        value={item[subField.key]}
                                        onChange={(val) => updateItem(idx, subField.key, val)}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="w-full flex items-center justify-center gap-1.5 mt-1 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                >
                                    <Trash2 size={11} /> Remove Item
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ListItemSubField({ field, value, onChange }) {
    switch (field.type) {
        case 'text':
        case 'url':
            return (
                <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">{field.label}</label>
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder || (field.type === 'url' ? 'https://...' : '')}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/40"
                    />
                </div>
            );
        case 'textarea':
            return (
                <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">{field.label}</label>
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/40 resize-none"
                    />
                </div>
            );
        case 'number':
            return (
                <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">{field.label}</label>
                    <input
                        type="number"
                        value={value ?? ''}
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/40"
                    />
                </div>
            );
        case 'select':
            return (
                <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1">{field.label}</label>
                    <select
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary/40"
                    >
                        {(field.options || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );
        case 'image-upload':
            return (
                <div>
                    <label className="text-[11px] font-medium text-gray-400 block mb-1.5">{field.label}</label>
                    <MediaUploader
                        value={value ? [value] : []}
                        onChange={(urls) => onChange(urls[0] || '')}
                        maxFiles={1}
                        acceptVideo={field.acceptVideo || false}
                        variant="compact"
                    />
                </div>
            );
        default:
            return null;
    }
}

// ── Layout Helper Components ─────────────────────────────

function LayoutSelect({ label, value, options, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            <div className="flex gap-1">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors capitalize
                            ${value === opt
                                ? 'bg-brand-primary/10 border-brand-primary/30 text-teal-700'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

function LayoutToggle({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-primary' : 'bg-gray-200'}`}
            >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${checked ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'}`} />
            </button>
        </div>
    );
}
