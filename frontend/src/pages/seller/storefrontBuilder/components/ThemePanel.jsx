import React from 'react';
import useBuilderStore from '../store/useBuilderStore.js';
import FontPicker from './FontPicker.jsx';
import { useTranslation } from 'react-i18next';

const HEADING_WEIGHTS = [
    { value: '100', i18nKey: 'builder.weights.thin',       label: 'Thin 100' },
    { value: '200', i18nKey: 'builder.weights.extraLight',  label: 'ExtraLight 200' },
    { value: '300', i18nKey: 'builder.weights.light',       label: 'Light 300' },
    { value: '400', i18nKey: 'builder.weights.regular',     label: 'Regular 400' },
    { value: '500', i18nKey: 'builder.weights.medium',      label: 'Medium 500' },
    { value: '600', i18nKey: 'builder.weights.semiBold',    label: 'SemiBold 600' },
    { value: '700', i18nKey: 'builder.weights.bold',        label: 'Bold 700' },
    { value: '800', i18nKey: 'builder.weights.extraBold',   label: 'ExtraBold 800' },
    { value: '900', i18nKey: 'builder.weights.black',       label: 'Black 900' },
];

const BODY_WEIGHTS = [
    { value: '100', i18nKey: 'builder.weights.thin',       label: 'Thin 100' },
    { value: '200', i18nKey: 'builder.weights.extraLight',  label: 'ExtraLight 200' },
    { value: '300', i18nKey: 'builder.weights.light',       label: 'Light 300' },
    { value: '400', i18nKey: 'builder.weights.regular',     label: 'Regular 400' },
    { value: '500', i18nKey: 'builder.weights.medium',      label: 'Medium 500' },
    { value: '600', i18nKey: 'builder.weights.semiBold',    label: 'SemiBold 600' },
    { value: '700', i18nKey: 'builder.weights.bold',        label: 'Bold 700' },
];

const TRACKING_OPTIONS = [
    { value: 'tight',   i18nKey: 'builder.tracking.tight',   label: 'Tight' },
    { value: 'normal',  i18nKey: 'builder.tracking.normal',  label: 'Normal' },
    { value: 'wide',    i18nKey: 'builder.tracking.wide',    label: 'Wide' },
    { value: 'wider',   i18nKey: 'builder.tracking.wider',   label: 'Wider' },
    { value: 'widest',  i18nKey: 'builder.tracking.widest',  label: 'Widest' },
];

const LEADING_OPTIONS = [
    { value: 'tight',   i18nKey: 'builder.leading.snug',     label: 'Tight' },
    { value: 'snug',    i18nKey: 'builder.leading.snug',     label: 'Snug' },
    { value: 'normal',  i18nKey: 'builder.leading.normal',   label: 'Normal' },
    { value: 'relaxed', i18nKey: 'builder.leading.relaxed',  label: 'Relaxed' },
    { value: 'loose',   i18nKey: 'builder.leading.loose',    label: 'Loose' },
];

const RADIUS_OPTIONS = [
    { value: 'sharp',   i18nKey: 'builder.radius.sharp',   label: 'Sharp' },
    { value: 'rounded', i18nKey: 'builder.radius.rounded', label: 'Rounded' },
    { value: 'pill',    i18nKey: 'builder.radius.pill',    label: 'Pill' },
];

const CARD_STYLES = [
    { value: 'none',   i18nKey: 'builder.cardStyles.flat',   label: 'Flat' },
    { value: 'shadow', i18nKey: 'builder.cardStyles.shadow', label: 'Shadow' },
    { value: 'border', i18nKey: 'builder.cardStyles.border', label: 'Border' },
];

export default function ThemePanel() {
    const theme = useBuilderStore((s) => s.theme);
    const updateTheme = useBuilderStore((s) => s.updateTheme);
    const { t } = useTranslation();

    const handleChange = (key, value) => updateTheme({ [key]: value });

    return (
        <div className="space-y-6">
            {/* Colors */}
            <Section title={t('builder.panel.colors')}>
                <ColorField label={t('builder.panel.primaryBrand')} value={theme.brandColor} onChange={(v) => handleChange('brandColor', v)} />
                <ColorField label={t('builder.panel.secondaryAccent')} value={theme.secondaryColor} onChange={(v) => handleChange('secondaryColor', v)} />
                <ColorField label={t('builder.panel.background')} value={theme.backgroundColor} onChange={(v) => handleChange('backgroundColor', v)} />
                <ColorField label={t('builder.panel.headingText')} value={theme.textColor} onChange={(v) => handleChange('textColor', v)} />
                <ColorField label={t('builder.panel.bodyMutedText')} value={theme.mutedTextColor} onChange={(v) => handleChange('mutedTextColor', v)} />
            </Section>

            {/* Typography */}
            <Section title={t('builder.panel.typography')}>
                <SubSection title={t('builder.panel.headings')}>
                    <FontPicker label={t('builder.panel.font')} value={theme.headingFont} onChange={(v) => handleChange('headingFont', v)} />
                    <WeightSelect label={t('builder.panel.weight')} value={theme.headingWeight || '700'} options={HEADING_WEIGHTS} onChange={(v) => handleChange('headingWeight', v)} />
                    <TransformToggle label={t('builder.panel.transform')} value={theme.headingTransform || 'none'} onChange={(v) => handleChange('headingTransform', v)} />
                    <OptionPills label={t('builder.panel.tracking')} value={theme.headingLetterSpacing || 'normal'} options={TRACKING_OPTIONS} onChange={(v) => handleChange('headingLetterSpacing', v)} />
                    <OptionPills label={t('builder.panel.leading')} value={theme.headingLineHeight || 'tight'} options={LEADING_OPTIONS} onChange={(v) => handleChange('headingLineHeight', v)} />
                </SubSection>
                <SubSection title={t('builder.panel.bodyText')}>
                    <FontPicker label={t('builder.panel.font')} value={theme.bodyFont} onChange={(v) => handleChange('bodyFont', v)} />
                    <WeightSelect label={t('builder.panel.weight')} value={theme.bodyWeight || '400'} options={BODY_WEIGHTS} onChange={(v) => handleChange('bodyWeight', v)} />
                    <RangeField label={t('builder.panel.size')} value={theme.baseFontSize} min={12} max={22} unit="px" onChange={(v) => handleChange('baseFontSize', parseInt(v))} />
                    <OptionPills label={t('builder.panel.tracking')} value={theme.bodyLetterSpacing || 'normal'} options={TRACKING_OPTIONS} onChange={(v) => handleChange('bodyLetterSpacing', v)} />
                    <OptionPills label={t('builder.panel.leading')} value={theme.bodyLineHeight || 'relaxed'} options={LEADING_OPTIONS} onChange={(v) => handleChange('bodyLineHeight', v)} />
                </SubSection>
            </Section>

            {/* UI Shape */}
            <Section title={t('builder.panel.uiShape')}>
                <RadioGroup label={t('builder.panel.buttonInputRadius')} value={theme.borderRadius} options={RADIUS_OPTIONS} onChange={(v) => handleChange('borderRadius', v)} />
                <RadioGroup label={t('builder.panel.widgetCornerRadius')} value={theme.widgetRadius || 'rounded'} options={RADIUS_OPTIONS} onChange={(v) => handleChange('widgetRadius', v)} />
                <RadioGroup label={t('builder.panel.productCardStyle')} value={theme.cardStyle} options={CARD_STYLES} onChange={(v) => handleChange('cardStyle', v)} />
            </Section>

            {/* Header */}
            <Section title={t('builder.panel.header')}>
                <RadioGroup
                    label={t('builder.panel.colorScheme')}
                    value={theme.headerStyle}
                    options={[
                        { value: 'light', i18nKey: 'builder.panel.light', label: 'Light' },
                        { value: 'dark',  i18nKey: 'builder.panel.dark',  label: 'Dark'  },
                    ]}
                    onChange={(v) => handleChange('headerStyle', v)}
                />
                <RadioGroup
                    label={t('builder.panel.logoPosition')}
                    value={theme.logoPosition}
                    options={[
                        { value: 'left',   i18nKey: 'builder.panel.left',   label: 'Left'   },
                        { value: 'center', i18nKey: 'builder.panel.center', label: 'Center' },
                    ]}
                    onChange={(v) => handleChange('logoPosition', v)}
                />
                <ToggleField label={t('builder.panel.stickyHeader')} checked={theme.stickyHeader} onChange={(v) => handleChange('stickyHeader', v)} />
            </Section>
        </div>
    );
}

// ── Field Components ──────────────────────────────────────

function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">{title}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function ColorField({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-20 text-xs font-mono px-2 py-1.5 border border-gray-200 rounded-lg uppercase"
                />
            </div>
        </div>
    );
}


function RangeField({ label, value, min, max, unit = '', onChange }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-xs font-mono text-gray-400">{value}{unit}</span>
            </div>
            <input
                type="range"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                className="w-full accent-brand-primary"
            />
        </div>
    );
}

function RadioGroup({ label, value, options, onChange }) {
    const { t } = useTranslation();
    return (
        <div>
            <span className="text-sm text-gray-600 block mb-2">{label}</span>
            <div className="flex gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors
                            ${value === opt.value
                                ? 'bg-brand-primary/10 border-brand-primary/30 text-teal-700'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                    >
                        {opt.i18nKey ? t(opt.i18nKey, opt.label) : opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function SubSection({ title, children }) {
    return (
        <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            {children}
        </div>
    );
}

function WeightSelect({ label, value, options, onChange }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 min-w-0 flex-1"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.i18nKey ? t(opt.i18nKey, opt.label) : opt.label}</option>
                ))}
            </select>
        </div>
    );
}

function OptionPills({ label, value, options, onChange }) {
    const { t } = useTranslation();
    return (
        <div>
            <span className="text-xs text-gray-500 block mb-1.5">{label}</span>
            <div className="flex flex-wrap gap-1">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                            value === opt.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        {opt.i18nKey ? t(opt.i18nKey, opt.label) : opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function TransformToggle({ label, value, onChange }) {
    const { t } = useTranslation();
    const options = [
        { value: 'none',       display: 'Aa',  titleKey: null,                          title: 'None' },
        { value: 'capitalize', display: 'Ab',  titleKey: 'builder.transform.capitalize', title: 'Capitalize' },
        { value: 'uppercase',  display: 'AB',  titleKey: 'builder.transform.uppercase',  title: 'Uppercase' },
        { value: 'lowercase',  display: 'ab',  titleKey: 'builder.transform.lowercase',  title: 'Lowercase' },
    ];
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <div className="flex gap-1">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        title={opt.titleKey ? t(opt.titleKey, opt.title) : opt.title}
                        onClick={() => onChange(opt.value)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
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

function ToggleField({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? 'bg-brand-primary' : 'bg-gray-200'}`}
            >
                <span
                    className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform
                        ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
            </button>
        </div>
    );
}
