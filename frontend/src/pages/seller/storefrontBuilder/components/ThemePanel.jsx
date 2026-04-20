import React from 'react';
import useBuilderStore from '../store/useBuilderStore.js';

/**
 * ThemePanel
 * Global theme settings editor: colors, fonts, border-radius, header style, etc.
 */

const FONT_OPTIONS = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
    'Playfair Display', 'Merriweather', 'Raleway', 'Nunito', 'DM Sans',
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
                <SelectField label="Heading Font" value={theme.headingFont} options={FONT_OPTIONS} onChange={(v) => handleChange('headingFont', v)} />
                <SelectField label="Body Font" value={theme.bodyFont} options={FONT_OPTIONS} onChange={(v) => handleChange('bodyFont', v)} />
                <RangeField label="Base Font Size" value={theme.baseFontSize} min={12} max={22} unit="px" onChange={(v) => handleChange('baseFontSize', parseInt(v))} />
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

function SelectField({ label, value, options, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
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
