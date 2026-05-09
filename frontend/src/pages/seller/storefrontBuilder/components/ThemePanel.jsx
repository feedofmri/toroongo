import React from 'react';
import useBuilderStore from '../store/useBuilderStore.js';
import FontPicker from './FontPicker.jsx';

const HEADING_WEIGHTS = [
    { value: '100', label: 'Thin (100)' },
    { value: '200', label: 'Extra Light (200)' },
    { value: '300', label: 'Light (300)' },
    { value: '400', label: 'Regular (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'SemiBold (600)' },
    { value: '700', label: 'Bold (700)' },
    { value: '800', label: 'Extra Bold (800)' },
    { value: '900', label: 'Black (900)' },
];

const BODY_WEIGHTS = [
    { value: '100', label: 'Thin (100)' },
    { value: '200', label: 'Extra Light (200)' },
    { value: '300', label: 'Light (300)' },
    { value: '400', label: 'Regular (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'SemiBold (600)' },
    { value: '700', label: 'Bold (700)' },
];

const TRACKING_OPTIONS = [
    { value: 'tight',   label: 'Tight' },
    { value: 'normal',  label: 'Normal' },
    { value: 'wide',    label: 'Wide' },
    { value: 'wider',   label: 'Wider' },
    { value: 'widest',  label: 'Widest' },
];

const LEADING_OPTIONS = [
    { value: 'tight',   label: 'Tight' },
    { value: 'snug',    label: 'Snug' },
    { value: 'normal',  label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'loose',   label: 'Loose' },
];

const RADIUS_OPTIONS = [
    { value: 'sharp', label: 'Sharp (0px)' },
    { value: 'rounded', label: 'Rounded (8px)' },
    { value: 'pill', label: 'Pill (Full)' },
];

const CARD_STYLES = [
    { value: 'none', label: 'Flat (No Border)' },
    { value: 'shadow', label: 'Drop Shadow' },
    { value: 'border', label: 'Solid Border' },
];

export default function ThemePanel() {
    const theme = useBuilderStore((s) => s.theme);
    const updateTheme = useBuilderStore((s) => s.updateTheme);

    const handleChange = (key, value) => updateTheme({ [key]: value });

    return (
        <div className="space-y-6">
            {/* Colors */}
            <Section title="Colors">
                <ColorField label="Primary / Brand" value={theme.brandColor} onChange={(v) => handleChange('brandColor', v)} />
                <ColorField label="Secondary / Accent" value={theme.secondaryColor} onChange={(v) => handleChange('secondaryColor', v)} />
                <ColorField label="Background" value={theme.backgroundColor} onChange={(v) => handleChange('backgroundColor', v)} />
                <ColorField label="Heading Text" value={theme.textColor} onChange={(v) => handleChange('textColor', v)} />
                <ColorField label="Body / Muted Text" value={theme.mutedTextColor} onChange={(v) => handleChange('mutedTextColor', v)} />
            </Section>

            {/* Typography */}
            <Section title="Typography">
                <SubSection title="Headings">
                    <FontPicker label="Font" value={theme.headingFont} onChange={(v) => handleChange('headingFont', v)} />
                    <WeightSelect label="Weight" value={theme.headingWeight || '700'} options={HEADING_WEIGHTS} onChange={(v) => handleChange('headingWeight', v)} />
                    <TransformToggle label="Transform" value={theme.headingTransform || 'none'} onChange={(v) => handleChange('headingTransform', v)} />
                    <OptionPills label="Tracking" value={theme.headingLetterSpacing || 'normal'} options={TRACKING_OPTIONS} onChange={(v) => handleChange('headingLetterSpacing', v)} />
                    <OptionPills label="Leading" value={theme.headingLineHeight || 'tight'} options={LEADING_OPTIONS} onChange={(v) => handleChange('headingLineHeight', v)} />
                </SubSection>
                <SubSection title="Body Text">
                    <FontPicker label="Font" value={theme.bodyFont} onChange={(v) => handleChange('bodyFont', v)} />
                    <WeightSelect label="Weight" value={theme.bodyWeight || '400'} options={BODY_WEIGHTS} onChange={(v) => handleChange('bodyWeight', v)} />
                    <RangeField label="Size" value={theme.baseFontSize} min={12} max={22} unit="px" onChange={(v) => handleChange('baseFontSize', parseInt(v))} />
                    <OptionPills label="Tracking" value={theme.bodyLetterSpacing || 'normal'} options={TRACKING_OPTIONS} onChange={(v) => handleChange('bodyLetterSpacing', v)} />
                    <OptionPills label="Leading" value={theme.bodyLineHeight || 'relaxed'} options={LEADING_OPTIONS} onChange={(v) => handleChange('bodyLineHeight', v)} />
                </SubSection>
            </Section>

            {/* UI Shape */}
            <Section title="UI Shape">
                <RadioGroup label="Button / Input Radius" value={theme.borderRadius} options={RADIUS_OPTIONS} onChange={(v) => handleChange('borderRadius', v)} />
                <RadioGroup label="Widget Corner Radius" value={theme.widgetRadius || 'rounded'} options={RADIUS_OPTIONS} onChange={(v) => handleChange('widgetRadius', v)} />
                <RadioGroup label="Product Card Style" value={theme.cardStyle} options={CARD_STYLES} onChange={(v) => handleChange('cardStyle', v)} />
            </Section>

            {/* Header */}
            <Section title="Header">
                <RadioGroup
                    label="Color Scheme"
                    value={theme.headerStyle}
                    options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
                    onChange={(v) => handleChange('headerStyle', v)}
                />
                <RadioGroup
                    label="Logo Position"
                    value={theme.logoPosition}
                    options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }]}
                    onChange={(v) => handleChange('logoPosition', v)}
                />
                <ToggleField label="Sticky Header" checked={theme.stickyHeader} onChange={(v) => handleChange('stickyHeader', v)} />
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
                        {opt.label}
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
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 min-w-0 flex-1"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

function OptionPills({ label, value, options, onChange }) {
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
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function TransformToggle({ label, value, onChange }) {
    const options = [
        { value: 'none',       display: 'Aa',  title: 'None' },
        { value: 'capitalize', display: 'Ab',  title: 'Capitalize' },
        { value: 'uppercase',  display: 'AB',  title: 'Uppercase' },
        { value: 'lowercase',  display: 'ab',  title: 'Lowercase' },
    ];
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <div className="flex gap-1">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        title={opt.title}
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
