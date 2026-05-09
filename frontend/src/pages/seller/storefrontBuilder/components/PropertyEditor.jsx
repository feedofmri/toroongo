import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import useBuilderStore from '../store/useBuilderStore.js';
import { widgetRegistry } from '../widgets/widgetRegistry.js';
import MediaUploader from '../../../../components/ui/MediaUploader.jsx';
import FontPicker from './FontPicker.jsx';
import { useAuth } from '../../../../context/AuthContext';

export default function PropertyEditor() {
    const selectedWidgetId = useBuilderStore((s) => s.selectedWidgetId);
    const heroSelected     = useBuilderStore((s) => s.heroSelected);
    const widgets          = useBuilderStore((s) => s.widgets);
    const updateWidgetProps  = useBuilderStore((s) => s.updateWidgetProps);
    const updateWidgetLayout = useBuilderStore((s) => s.updateWidgetLayout);
    const updateWidgetStyle  = useBuilderStore((s) => s.updateWidgetStyle);
    const removeWidget    = useBuilderStore((s) => s.removeWidget);
    const duplicateWidget = useBuilderStore((s) => s.duplicateWidget);
    const selectWidget    = useBuilderStore((s) => s.selectWidget);
    const deselectHero    = useBuilderStore((s) => s.deselectHero);
    const commitHistory   = useBuilderStore((s) => s.commitHistory);

    // Hero section selected
    if (heroSelected) {
        return <HeroEditor onClose={deselectHero} />;
    }

    const widget = widgets.find((w) => w.id === selectedWidgetId);
    if (!widget) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2z" />
                    </svg>
                </div>
                <p className="text-sm text-gray-400">Click a widget or the store banner to edit its properties</p>
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

            {/* Style Overrides */}
            <StyleOverrideSection widget={widget} onStyleChange={(key, val) => updateWidgetStyle(widget.id, { [key]: val })} />

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

// ── Hero / Banner Editor ─────────────────────────────────

const HERO_NAME_SIZES = [
    { value: 'sm',  label: 'Small (14px)'  },
    { value: 'base',label: 'Base (16px)'   },
    { value: 'lg',  label: 'Large (18px)'  },
    { value: 'xl',  label: 'XLarge (20px)' },
    { value: '2xl', label: '2XL (24px)'    },
    { value: '3xl', label: '3XL (30px)'    },
    { value: '4xl', label: '4XL (36px)'    },
];

function HeroEditor({ onClose }) {
    const hero       = useBuilderStore((s) => s.hero);
    const updateHero = useBuilderStore((s) => s.updateHero);
    const { user }   = useAuth();

    const set = (key, val) => updateHero({ [key]: val });

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Store Banner</span>
                <button onClick={onClose} className="ml-auto text-xs text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Banner Image */}
            <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Banner Image</h4>
                <MediaUploader
                    variant="compact"
                    maxFiles={1}
                    acceptVideo={false}
                    value={hero.bannerImage ? [hero.bannerImage] : []}
                    onChange={(urls) => set('bannerImage', urls[0] || null)}
                />
            </div>

            {/* Text Content */}
            <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Text Content</h4>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Store Name</label>
                        <input
                            type="text"
                            value={hero.storeName || ''}
                            onChange={(e) => set('storeName', e.target.value || null)}
                            placeholder={user?.store_name || user?.name || 'From profile'}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                        />
                        <p className="mt-1 text-[10px] text-gray-400">Leave empty to use your profile store name</p>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Tagline</label>
                        <input
                            type="text"
                            value={hero.tagline || ''}
                            onChange={(e) => set('tagline', e.target.value || null)}
                            placeholder="e.g. Premium quality since 2020"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                        />
                    </div>
                </div>
            </div>

            {/* Store Name Style */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Store Name Style</p>

                {/* Font */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500">Font</span>
                        {hero.nameFont && (
                            <button type="button" onClick={() => set('nameFont', null)} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">Reset ×</button>
                        )}
                    </div>
                    {hero.nameFont
                        ? <FontPicker value={hero.nameFont} onChange={(v) => set('nameFont', v)} />
                        : <button type="button" onClick={() => set('nameFont', 'Inter')} className="text-[11px] font-medium text-brand-primary hover:opacity-70 transition-opacity">+ Override font</button>
                    }
                </div>

                {/* Size */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 shrink-0">Size</span>
                    <select
                        value={hero.nameSize || ''}
                        onChange={(e) => set('nameSize', e.target.value || null)}
                        className="text-[11px] px-1.5 py-1 border border-gray-200 rounded bg-white text-gray-700"
                    >
                        <option value="">Default</option>
                        {HERO_NAME_SIZES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Weight */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 shrink-0">Weight</span>
                    <select
                        value={hero.nameWeight || ''}
                        onChange={(e) => set('nameWeight', e.target.value || null)}
                        className="text-[11px] px-1.5 py-1 border border-gray-200 rounded bg-white text-gray-700"
                    >
                        <option value="">Default (Bold)</option>
                        {WEIGHT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                {/* Color */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 shrink-0">Color</span>
                    <div className="flex items-center gap-1.5">
                        <input
                            type="color"
                            value={hero.nameColor || '#ffffff'}
                            onChange={(e) => set('nameColor', e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border border-gray-200 p-0.5 shrink-0"
                        />
                        <input
                            type="text"
                            value={hero.nameColor || ''}
                            onChange={(e) => set('nameColor', e.target.value || null)}
                            placeholder="White"
                            className="w-16 text-[10px] font-mono px-1.5 py-1 border border-gray-200 rounded uppercase"
                        />
                        {hero.nameColor && (
                            <button type="button" onClick={() => set('nameColor', null)} className="text-gray-300 hover:text-gray-500 text-sm leading-none shrink-0" title="Reset">×</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tagline Style */}
            {hero.tagline && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tagline Style</p>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500 shrink-0">Color</span>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="color"
                                value={hero.taglineColor || '#ffffffcc'}
                                onChange={(e) => set('taglineColor', e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border border-gray-200 p-0.5 shrink-0"
                            />
                            <input
                                type="text"
                                value={hero.taglineColor || ''}
                                onChange={(e) => set('taglineColor', e.target.value || null)}
                                placeholder="White/80"
                                className="w-16 text-[10px] font-mono px-1.5 py-1 border border-gray-200 rounded uppercase"
                            />
                            {hero.taglineColor && (
                                <button type="button" onClick={() => set('taglineColor', null)} className="text-gray-300 hover:text-gray-500 text-sm leading-none shrink-0" title="Reset">×</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Button */}
            <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Contact Button</h4>
                <div className="space-y-3">
                    <HeroToggle
                        label="Show Contact Button"
                        checked={hero.showContact !== false}
                        onChange={(v) => set('showContact', v)}
                    />
                    {hero.showContact !== false && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 block mb-1">Button Text</label>
                            <input
                                type="text"
                                value={hero.contactText || ''}
                                onChange={(e) => set('contactText', e.target.value)}
                                placeholder="Contact"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Display Options */}
            <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Display Options</h4>
                <div className="space-y-3">
                    <HeroToggle
                        label="Show Rating"
                        checked={hero.showRating !== false}
                        onChange={(v) => set('showRating', v)}
                    />
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-gray-500">Overlay Darkness</label>
                            <span className="text-xs font-mono text-gray-400">{hero.overlayOpacity ?? 70}%</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={hero.overlayOpacity ?? 70}
                            onChange={(e) => set('overlayOpacity', Number(e.target.value))}
                            className="w-full accent-brand-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeroToggle({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-primary' : 'bg-gray-200'}`}
            >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${checked ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'}`} />
            </button>
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

// ── Style Override Section ───────────────────────────────

const WEIGHT_OPTIONS = [
    { value: '100', label: 'Thin 100' },
    { value: '200', label: 'ExtraLight 200' },
    { value: '300', label: 'Light 300' },
    { value: '400', label: 'Regular 400' },
    { value: '500', label: 'Medium 500' },
    { value: '600', label: 'SemiBold 600' },
    { value: '700', label: 'Bold 700' },
    { value: '800', label: 'ExtraBold 800' },
    { value: '900', label: 'Black 900' },
];

const TRACKING_OPTIONS = [
    { value: 'tight', label: 'Tight' },
    { value: 'normal', label: 'Normal' },
    { value: 'wide', label: 'Wide' },
    { value: 'wider', label: 'Wider' },
    { value: 'widest', label: 'Widest' },
];

const LEADING_OPTIONS = [
    { value: 'tight', label: 'Tight' },
    { value: 'snug', label: 'Snug' },
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'loose', label: 'Loose' },
];

const TRANSFORM_OPTIONS = [
    { value: 'none', display: 'Aa', title: 'None' },
    { value: 'capitalize', display: 'Ab', title: 'Capitalize' },
    { value: 'uppercase', display: 'AB', title: 'Uppercase' },
    { value: 'lowercase', display: 'ab', title: 'Lowercase' },
];

const RADIUS_OPTIONS = [
    { value: 'sharp', label: 'Sharp' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'pill', label: 'Pill' },
];

function StyleOverrideSection({ widget, onStyleChange }) {
    const [open, setOpen] = useState(true);
    const style = widget.style || {};

    const set = (key, val) => onStyleChange(key, val);
    const clear = (key) => onStyleChange(key, null);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between group"
            >
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Style Overrides</h4>
                <ChevronDown size={13} className={`text-gray-300 group-hover:text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="mt-3 space-y-4">
                    {/* Colors */}
                    <StyleSubSection title="Colors">
                        <StyleColorRow label="Background" value={style.backgroundColor} onChange={(v) => set('backgroundColor', v)} onClear={() => clear('backgroundColor')} />
                        <StyleColorRow label="Primary / Brand" value={style.brandColor} onChange={(v) => set('brandColor', v)} onClear={() => clear('brandColor')} />
                        <StyleColorRow label="Secondary / Accent" value={style.secondaryColor} onChange={(v) => set('secondaryColor', v)} onClear={() => clear('secondaryColor')} />
                        <StyleColorRow label="Heading Text" value={style.textColor} onChange={(v) => set('textColor', v)} onClear={() => clear('textColor')} />
                        <StyleColorRow label="Muted Text" value={style.mutedTextColor} onChange={(v) => set('mutedTextColor', v)} onClear={() => clear('mutedTextColor')} />
                    </StyleSubSection>

                    {/* Headings Typography */}
                    <StyleSubSection title="Heading Typography">
                        <StyleFontRow label="Font" value={style.headingFont} onChange={(v) => set('headingFont', v)} onClear={() => clear('headingFont')} />
                        <StyleSelectRow label="Weight" value={style.headingWeight} options={WEIGHT_OPTIONS} onChange={(v) => set('headingWeight', v)} onClear={() => clear('headingWeight')} />
                        <StylePillsRow label="Tracking" value={style.headingLetterSpacing} options={TRACKING_OPTIONS} onChange={(v) => set('headingLetterSpacing', v)} onClear={() => clear('headingLetterSpacing')} />
                        <StylePillsRow label="Leading" value={style.headingLineHeight} options={LEADING_OPTIONS} onChange={(v) => set('headingLineHeight', v)} onClear={() => clear('headingLineHeight')} />
                        <StyleTransformRow label="Transform" value={style.headingTransform} onChange={(v) => set('headingTransform', v)} onClear={() => clear('headingTransform')} />
                    </StyleSubSection>

                    {/* Body Typography */}
                    <StyleSubSection title="Body Typography">
                        <StyleFontRow label="Font" value={style.bodyFont} onChange={(v) => set('bodyFont', v)} onClear={() => clear('bodyFont')} />
                        <StyleSelectRow label="Weight" value={style.bodyWeight} options={WEIGHT_OPTIONS.slice(0, 7)} onChange={(v) => set('bodyWeight', v)} onClear={() => clear('bodyWeight')} />
                        <StylePillsRow label="Tracking" value={style.bodyLetterSpacing} options={TRACKING_OPTIONS} onChange={(v) => set('bodyLetterSpacing', v)} onClear={() => clear('bodyLetterSpacing')} />
                        <StylePillsRow label="Leading" value={style.bodyLineHeight} options={LEADING_OPTIONS} onChange={(v) => set('bodyLineHeight', v)} onClear={() => clear('bodyLineHeight')} />
                    </StyleSubSection>

                    {/* Shape */}
                    <StyleSubSection title="Shape">
                        <StylePillsRow label="Button Radius" value={style.borderRadius} options={RADIUS_OPTIONS} onChange={(v) => set('borderRadius', v)} onClear={() => clear('borderRadius')} />
                    </StyleSubSection>
                </div>
            )}
        </div>
    );
}

function StyleSubSection({ title, children }) {
    return (
        <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            {children}
        </div>
    );
}

function StyleColorRow({ label, value, onChange, onClear }) {
    if (!value) {
        return (
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{label}</span>
                <button
                    type="button"
                    onClick={() => onChange('#008080')}
                    className="text-[11px] font-medium text-brand-primary hover:opacity-70 transition-opacity"
                >
                    + Override
                </button>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <div className="flex items-center gap-1.5">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-gray-200 p-0.5 shrink-0"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-16 text-[10px] font-mono px-1.5 py-1 border border-gray-200 rounded uppercase"
                />
                <button type="button" onClick={onClear} className="text-gray-300 hover:text-gray-500 text-sm leading-none shrink-0" title="Reset to theme">×</button>
            </div>
        </div>
    );
}

function StyleFontRow({ label, value, onChange, onClear }) {
    if (!value) {
        return (
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{label}</span>
                <button
                    type="button"
                    onClick={() => onChange('Inter')}
                    className="text-[11px] font-medium text-brand-primary hover:opacity-70 transition-opacity"
                >
                    + Override
                </button>
            </div>
        );
    }
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">{label}</span>
                <button type="button" onClick={onClear} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                    Reset ×
                </button>
            </div>
            <FontPicker value={value} onChange={onChange} />
        </div>
    );
}

function StyleSelectRow({ label, value, options, onChange, onClear }) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <div className="flex items-center gap-1 min-w-0">
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value || null)}
                    className="text-[11px] px-1.5 py-1 border border-gray-200 rounded bg-white text-gray-700 min-w-0 flex-1"
                >
                    <option value="">From theme</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {value && (
                    <button type="button" onClick={onClear} className="text-gray-300 hover:text-gray-500 text-sm leading-none shrink-0" title="Reset to theme">×</button>
                )}
            </div>
        </div>
    );
}

function StylePillsRow({ label, value, options, onChange, onClear }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">{label}</span>
                {value && (
                    <button type="button" onClick={onClear} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                        Reset ×
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={onClear}
                    className={`px-2 py-1 text-[10px] font-medium rounded border transition-colors ${
                        !value ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                    }`}
                >
                    Default
                </button>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`px-2 py-1 text-[10px] font-medium rounded border transition-colors ${
                            value === opt.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function StyleTransformRow({ label, value, onChange, onClear }) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <div className="flex gap-1">
                <button
                    type="button"
                    title="Default (from theme)"
                    onClick={onClear}
                    className={`px-2 py-1 text-[11px] font-bold rounded border transition-colors ${
                        !value ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                    }`}
                >
                    —
                </button>
                {TRANSFORM_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        title={opt.title}
                        onClick={() => onChange(opt.value)}
                        className={`px-2 py-1 text-[11px] font-bold rounded border transition-colors ${
                            value === opt.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ textTransform: opt.value === 'none' ? undefined : opt.value }}
                    >
                        {opt.display}
                    </button>
                ))}
            </div>
        </div>
    );
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
