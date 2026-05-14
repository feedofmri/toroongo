import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

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
                <p className="text-sm text-gray-400">{t('builder.panel.clickToSelect')}</p>
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
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">{t('builder.panel.content')}</h4>
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">{t('builder.panel.layout')}</h4>
                <div className="space-y-3">
                    <LayoutSelect
                        label={t('builder.panel.paddingTop')}
                        value={widget.layout.paddingTop}
                        options={['small', 'medium', 'large']}
                        onChange={(v) => handleLayoutChange('paddingTop', v)}
                    />
                    <LayoutSelect
                        label={t('builder.panel.paddingBottom')}
                        value={widget.layout.paddingBottom}
                        options={['small', 'medium', 'large']}
                        onChange={(v) => handleLayoutChange('paddingBottom', v)}
                    />
                    <LayoutSelect
                        label={t('builder.panel.containerWidth')}
                        value={widget.layout.containerWidth}
                        options={['boxed', 'full']}
                        onChange={(v) => handleLayoutChange('containerWidth', v)}
                    />
                    <LayoutToggle
                        label={t('builder.panel.hideOnMobile')}
                        checked={widget.layout.hideOnMobile}
                        onChange={(v) => handleLayoutChange('hideOnMobile', v)}
                    />
                    <LayoutToggle
                        label={t('builder.panel.hideOnDesktop')}
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
                    {t('builder.panel.duplicate')}
                </button>
                <button
                    onClick={() => { removeWidget(widget.id); }}
                    className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                    {t('builder.panel.delete')}
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
    const { t }      = useTranslation();

    const set = (key, val) => updateHero({ [key]: val });

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">{t('builder.panel.storeBanner')}</span>
                <button onClick={onClose} className="ml-auto text-xs text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Banner Image */}
            <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">{t('builder.panel.bannerImage')}</h4>
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">{t('builder.panel.textContent')}</h4>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">{t('builder.panel.storeName')}</label>
                        <input
                            type="text"
                            value={hero.storeName || ''}
                            onChange={(e) => set('storeName', e.target.value || null)}
                            placeholder={user?.store_name || user?.name || t('builder.panel.fromProfile')}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                        />
                        <p className="mt-1 text-[10px] text-gray-400">{t('builder.panel.storeNameHint')}</p>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">{t('builder.panel.tagline')}</label>
                        <input
                            type="text"
                            value={hero.tagline || ''}
                            onChange={(e) => set('tagline', e.target.value || null)}
                            placeholder={t('builder.panel.taglinePlaceholder')}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                        />
                    </div>
                </div>
            </div>

            {/* Store Name Style */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('builder.panel.storeNameStyle')}</p>

                {/* Font */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500">{t('builder.panel.font')}</span>
                        {hero.nameFont && (
                            <button type="button" onClick={() => set('nameFont', null)} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">{t('builder.panel.resetFont')} ×</button>
                        )}
                    </div>
                    {hero.nameFont
                        ? <FontPicker value={hero.nameFont} onChange={(v) => set('nameFont', v)} />
                        : <button type="button" onClick={() => set('nameFont', 'Inter')} className="text-[11px] font-medium text-brand-primary hover:opacity-70 transition-opacity">+ {t('builder.panel.overrideFont')}</button>
                    }
                </div>

                {/* Size */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 shrink-0">{t('builder.panel.size')}</span>
                    <select
                        value={hero.nameSize || ''}
                        onChange={(e) => set('nameSize', e.target.value || null)}
                        className="text-[11px] px-1.5 py-1 border border-gray-200 rounded bg-white text-gray-700"
                    >
                        <option value="">{t('builder.panel.default')}</option>
                        {HERO_NAME_SIZES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Weight */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 shrink-0">{t('builder.panel.weight')}</span>
                    <select
                        value={hero.nameWeight || ''}
                        onChange={(e) => set('nameWeight', e.target.value || null)}
                        className="text-[11px] px-1.5 py-1 border border-gray-200 rounded bg-white text-gray-700"
                    >
                        <option value="">{t('builder.panel.defaultBold')}</option>
                        {WEIGHT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{t(o.i18nKey, o.label)}</option>
                        ))}
                    </select>
                </div>

                {/* Color */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 shrink-0">{t('builder.panel.color')}</span>
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
                            placeholder="#ffffff"
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
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('builder.panel.taglineStyle')}</p>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500 shrink-0">{t('builder.panel.color')}</span>
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">{t('builder.panel.contactButton')}</h4>
                <div className="space-y-3">
                    <HeroToggle
                        label={t('builder.panel.showContactButton')}
                        checked={hero.showContact !== false}
                        onChange={(v) => set('showContact', v)}
                    />
                    {hero.showContact !== false && (
                        <div>
                            <label className="text-xs font-medium text-gray-500 block mb-1">{t('builder.panel.buttonText')}</label>
                            <input
                                type="text"
                                value={hero.contactText || ''}
                                onChange={(e) => set('contactText', e.target.value)}
                                placeholder={t('storefront.contact')}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Display Options */}
            <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">{t('builder.panel.displayOptions')}</h4>
                <div className="space-y-3">
                    <HeroToggle
                        label={t('builder.panel.showRating')}
                        checked={hero.showRating !== false}
                        onChange={(v) => set('showRating', v)}
                    />
                    <HeroToggle
                        label={t('builder.panel.hideBanner', 'Hide Header Banner')}
                        checked={hero.hideBanner === true}
                        onChange={(v) => set('hideBanner', v)}
                    />
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-gray-500">{t('builder.panel.overlayDarkness')}</label>
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
    const { t } = useTranslation();
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
                    <Plus size={12} /> {t('builder.panel.add')}
                </button>
            </div>
            <div className="space-y-1.5">
                {value.length === 0 && (
                    <p className="text-[11px] text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
                        {t('builder.panel.noItems')}
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
                                    <Trash2 size={11} /> {t('builder.panel.removeItem')}
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
    { value: '100', label: 'Thin 100',       i18nKey: 'builder.weights.thin' },
    { value: '200', label: 'ExtraLight 200',  i18nKey: 'builder.weights.extraLight' },
    { value: '300', label: 'Light 300',       i18nKey: 'builder.weights.light' },
    { value: '400', label: 'Regular 400',     i18nKey: 'builder.weights.regular' },
    { value: '500', label: 'Medium 500',      i18nKey: 'builder.weights.medium' },
    { value: '600', label: 'SemiBold 600',    i18nKey: 'builder.weights.semiBold' },
    { value: '700', label: 'Bold 700',        i18nKey: 'builder.weights.bold' },
    { value: '800', label: 'ExtraBold 800',   i18nKey: 'builder.weights.extraBold' },
    { value: '900', label: 'Black 900',       i18nKey: 'builder.weights.black' },
];

const TRACKING_OPTIONS = [
    { value: 'tight',   label: 'Tight',   i18nKey: 'builder.tracking.tight' },
    { value: 'normal',  label: 'Normal',  i18nKey: 'builder.tracking.normal' },
    { value: 'wide',    label: 'Wide',    i18nKey: 'builder.tracking.wide' },
    { value: 'wider',   label: 'Wider',   i18nKey: 'builder.tracking.wider' },
    { value: 'widest',  label: 'Widest',  i18nKey: 'builder.tracking.widest' },
];

const LEADING_OPTIONS = [
    { value: 'tight',   label: 'Tight',   i18nKey: 'builder.tracking.tight' },
    { value: 'snug',    label: 'Snug',    i18nKey: 'builder.leading.snug' },
    { value: 'normal',  label: 'Normal',  i18nKey: 'builder.leading.normal' },
    { value: 'relaxed', label: 'Relaxed', i18nKey: 'builder.leading.relaxed' },
    { value: 'loose',   label: 'Loose',   i18nKey: 'builder.leading.loose' },
];

const TRANSFORM_OPTIONS = [
    { value: 'none',       display: 'Aa', i18nKey: null },
    { value: 'capitalize', display: 'Ab', i18nKey: 'builder.transform.capitalize' },
    { value: 'uppercase',  display: 'AB', i18nKey: 'builder.transform.uppercase' },
    { value: 'lowercase',  display: 'ab', i18nKey: 'builder.transform.lowercase' },
];

const RADIUS_OPTIONS = [
    { value: 'sharp',   label: 'Sharp',   i18nKey: 'builder.radius.sharp' },
    { value: 'rounded', label: 'Rounded', i18nKey: 'builder.radius.rounded' },
    { value: 'pill',    label: 'Pill',    i18nKey: 'builder.radius.pill' },
];

function StyleOverrideSection({ widget, onStyleChange }) {
    const { t } = useTranslation();
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t('builder.panel.styleOverrides')}</h4>
                <ChevronDown size={13} className={`text-gray-300 group-hover:text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="mt-3 space-y-4">
                    {/* Colors */}
                    <StyleSubSection title={t('builder.panel.colors')}>
                        <StyleColorRow label={t('builder.panel.background')} value={style.backgroundColor} onChange={(v) => set('backgroundColor', v)} onClear={() => clear('backgroundColor')} overrideLabel={t('builder.panel.overrideTheme')} />
                        <StyleColorRow label={t('builder.panel.primaryBrand')} value={style.brandColor} onChange={(v) => set('brandColor', v)} onClear={() => clear('brandColor')} overrideLabel={t('builder.panel.overrideTheme')} />
                        <StyleColorRow label={t('builder.panel.secondaryAccent')} value={style.secondaryColor} onChange={(v) => set('secondaryColor', v)} onClear={() => clear('secondaryColor')} overrideLabel={t('builder.panel.overrideTheme')} />
                        <StyleColorRow label={t('builder.panel.headingText')} value={style.textColor} onChange={(v) => set('textColor', v)} onClear={() => clear('textColor')} overrideLabel={t('builder.panel.overrideTheme')} />
                        <StyleColorRow label={t('builder.panel.mutedText')} value={style.mutedTextColor} onChange={(v) => set('mutedTextColor', v)} onClear={() => clear('mutedTextColor')} overrideLabel={t('builder.panel.overrideTheme')} />
                    </StyleSubSection>

                    {/* Headings Typography */}
                    <StyleSubSection title={t('builder.panel.headingTypography')}>
                        <StyleFontRow label={t('builder.panel.font')} value={style.headingFont} onChange={(v) => set('headingFont', v)} onClear={() => clear('headingFont')} overrideLabel={t('builder.panel.overrideTheme')} resetLabel={t('builder.panel.resetFont')} />
                        <StyleSelectRow label={t('builder.panel.weight')} value={style.headingWeight} options={WEIGHT_OPTIONS} onChange={(v) => set('headingWeight', v)} onClear={() => clear('headingWeight')} fromThemeLabel={t('builder.panel.fromTheme')} />
                        <StylePillsRow label={t('builder.panel.tracking')} value={style.headingLetterSpacing} options={TRACKING_OPTIONS} onChange={(v) => set('headingLetterSpacing', v)} onClear={() => clear('headingLetterSpacing')} defaultLabel={t('builder.panel.default')} />
                        <StylePillsRow label={t('builder.panel.leading')} value={style.headingLineHeight} options={LEADING_OPTIONS} onChange={(v) => set('headingLineHeight', v)} onClear={() => clear('headingLineHeight')} defaultLabel={t('builder.panel.default')} />
                        <StyleTransformRow label={t('builder.panel.transform')} value={style.headingTransform} onChange={(v) => set('headingTransform', v)} onClear={() => clear('headingTransform')} />
                    </StyleSubSection>

                    {/* Body Typography */}
                    <StyleSubSection title={t('builder.panel.bodyTypography')}>
                        <StyleFontRow label={t('builder.panel.font')} value={style.bodyFont} onChange={(v) => set('bodyFont', v)} onClear={() => clear('bodyFont')} overrideLabel={t('builder.panel.overrideTheme')} resetLabel={t('builder.panel.resetFont')} />
                        <StyleSelectRow label={t('builder.panel.weight')} value={style.bodyWeight} options={WEIGHT_OPTIONS.slice(0, 7)} onChange={(v) => set('bodyWeight', v)} onClear={() => clear('bodyWeight')} fromThemeLabel={t('builder.panel.fromTheme')} />
                        <StylePillsRow label={t('builder.panel.tracking')} value={style.bodyLetterSpacing} options={TRACKING_OPTIONS} onChange={(v) => set('bodyLetterSpacing', v)} onClear={() => clear('bodyLetterSpacing')} defaultLabel={t('builder.panel.default')} />
                        <StylePillsRow label={t('builder.panel.leading')} value={style.bodyLineHeight} options={LEADING_OPTIONS} onChange={(v) => set('bodyLineHeight', v)} onClear={() => clear('bodyLineHeight')} defaultLabel={t('builder.panel.default')} />
                    </StyleSubSection>

                    {/* Shape */}
                    <StyleSubSection title={t('builder.panel.shape')}>
                        <StylePillsRow label={t('builder.panel.buttonRadius')} value={style.borderRadius} options={RADIUS_OPTIONS} onChange={(v) => set('borderRadius', v)} onClear={() => clear('borderRadius')} defaultLabel={t('builder.panel.default')} />
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

function StyleColorRow({ label, value, onChange, onClear, overrideLabel = 'Override' }) {
    if (!value) {
        return (
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{label}</span>
                <button
                    type="button"
                    onClick={() => onChange('#008080')}
                    className="text-[11px] font-medium text-brand-primary hover:opacity-70 transition-opacity"
                >
                    + {overrideLabel}
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

function StyleFontRow({ label, value, onChange, onClear, overrideLabel = 'Override', resetLabel = 'Reset' }) {
    if (!value) {
        return (
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{label}</span>
                <button
                    type="button"
                    onClick={() => onChange('Inter')}
                    className="text-[11px] font-medium text-brand-primary hover:opacity-70 transition-opacity"
                >
                    + {overrideLabel}
                </button>
            </div>
        );
    }
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">{label}</span>
                <button type="button" onClick={onClear} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                    {resetLabel} ×
                </button>
            </div>
            <FontPicker value={value} onChange={onChange} />
        </div>
    );
}

function StyleSelectRow({ label, value, options, onChange, onClear, fromThemeLabel = 'From theme' }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <div className="flex items-center gap-1 min-w-0">
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value || null)}
                    className="text-[11px] px-1.5 py-1 border border-gray-200 rounded bg-white text-gray-700 min-w-0 flex-1"
                >
                    <option value="">{fromThemeLabel}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.i18nKey ? t(opt.i18nKey, opt.label) : opt.label}</option>
                    ))}
                </select>
                {value && (
                    <button type="button" onClick={onClear} className="text-gray-300 hover:text-gray-500 text-sm leading-none shrink-0" title="Reset to theme">×</button>
                )}
            </div>
        </div>
    );
}

function StylePillsRow({ label, value, options, onChange, onClear, defaultLabel = 'Default' }) {
    const { t } = useTranslation();
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">{label}</span>
                {value && (
                    <button type="button" onClick={onClear} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                        ×
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
                    {defaultLabel}
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
                        {opt.i18nKey ? t(opt.i18nKey, opt.label) : opt.label}
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
