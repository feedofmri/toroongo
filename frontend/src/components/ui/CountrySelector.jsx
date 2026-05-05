import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

// Countries grouped by language
export const COUNTRY_GROUPS = [
    {
        key: 'BD',
        label: 'Bangladesh',
        flag: '🇧🇩',
        currency: 'BDT',
        currencyName: 'Bangladeshi Taka (৳)',
        lang: 'bn',
    },
    {
        key: 'IN',
        label: 'India',
        flag: '🇮🇳',
        currency: 'INR',
        currencyName: 'Indian Rupee (₹)',
        lang: 'hi',
    },
    {
        key: 'NP',
        label: 'Nepal',
        flag: '🇳🇵',
        currency: 'NPR',
        currencyName: 'Nepali Rupee (रू)',
        lang: 'ne',
    },
    {
        key: 'ID',
        label: 'Indonesia',
        flag: '🇮🇩',
        currency: 'IDR',
        currencyName: 'Indonesian Rupiah (Rp)',
        lang: 'id',
    },
    {
        key: 'MY',
        label: 'Malaysia',
        flag: '🇲🇾',
        currency: 'MYR',
        currencyName: 'Malaysian Ringgit (RM)',
        lang: 'ms',
    },
];

// Arabic-speaking countries
export const ARABIC_COUNTRIES = [
    { key: 'AE', label: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', currencyName: 'UAE Dirham (د.إ)' },
    { key: 'SA', label: 'Saudi Arabia',         flag: '🇸🇦', currency: 'SAR', currencyName: 'Saudi Riyal (ر.س)' },
    { key: 'QA', label: 'Qatar',                flag: '🇶🇦', currency: 'QAR', currencyName: 'Qatari Riyal (ر.ق)' },
    { key: 'KW', label: 'Kuwait',               flag: '🇰🇼', currency: 'KWD', currencyName: 'Kuwaiti Dinar (د.ك)' },
    { key: 'EG', label: 'Egypt',                flag: '🇪🇬', currency: 'EGP', currencyName: 'Egyptian Pound (ج.م)' },
    { key: 'JO', label: 'Jordan',               flag: '🇯🇴', currency: 'JOD', currencyName: 'Jordanian Dinar (د.ا)' },
];

/**
 * CountrySelector
 * value: { country, currency_code, country_custom_name }
 * onChange: (value) => void
 */
export default function CountrySelector({ value = {}, onChange, className = '' }) {
    const [showArabicList, setShowArabicList] = useState(
        ARABIC_COUNTRIES.some(c => c.key === value.country)
    );

    const select = (country, currency_code, country_custom_name = null) => {
        onChange({ country, currency_code, country_custom_name });
        setShowArabicList(false);
    };

    const selectArabic = () => {
        setShowArabicList(true);
        if (!ARABIC_COUNTRIES.some(c => c.key === value.country)) {
            onChange({ country: 'AE', currency_code: 'AED', country_custom_name: null });
        }
    };

    const isOthers = value.country === 'OTHER';
    const isArabic = ARABIC_COUNTRIES.some(c => c.key === value.country);

    const btnClass = (active) =>
        `flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 w-full
        ${active
            ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/20'
            : 'border-border-soft hover:border-gray-300 bg-white'}`;

    return (
        <div className={`space-y-3 ${className}`}>
            <p className="text-xs font-medium text-text-muted">Your Country</p>

            {/* Main 5 countries */}
            <div className="grid grid-cols-1 gap-2">
                {COUNTRY_GROUPS.map(c => (
                    <button key={c.key} type="button"
                        className={btnClass(value.country === c.key)}
                        onClick={() => select(c.key, c.currency, null)}
                    >
                        <span className="text-2xl leading-none">{c.flag}</span>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${value.country === c.key ? 'text-brand-primary' : 'text-text-primary'}`}>
                                {c.label}
                            </p>
                            <p className="text-[11px] text-text-muted">{c.currencyName}</p>
                        </div>
                        {value.country === c.key && (
                            <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                        )}
                    </button>
                ))}

                {/* Arabic group */}
                <button type="button"
                    className={btnClass(isArabic)}
                    onClick={selectArabic}
                >
                    <Globe size={22} className={isArabic ? 'text-brand-primary' : 'text-text-muted'} />
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isArabic ? 'text-brand-primary' : 'text-text-primary'}`}>
                            Arabic-Speaking Countries
                        </p>
                        <p className="text-[11px] text-text-muted">UAE, Saudi Arabia, Qatar, Kuwait, Egypt, Jordan</p>
                    </div>
                    <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${isArabic ? 'rotate-180 text-brand-primary' : 'text-text-muted'}`} />
                </button>

                {/* Arabic sub-list */}
                {showArabicList && (
                    <div className="ml-4 space-y-2 animate-fade-in">
                        {ARABIC_COUNTRIES.map(c => (
                            <button key={c.key} type="button"
                                className={btnClass(value.country === c.key)}
                                onClick={() => select(c.key, c.currency, null)}
                            >
                                <span className="text-xl leading-none">{c.flag}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${value.country === c.key ? 'text-brand-primary' : 'text-text-primary'}`}>
                                        {c.label}
                                    </p>
                                    <p className="text-[11px] text-text-muted">{c.currencyName}</p>
                                </div>
                                {value.country === c.key && (
                                    <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Others */}
                <button type="button"
                    className={btnClass(isOthers)}
                    onClick={() => {
                        setShowArabicList(false);
                        onChange({ country: 'OTHER', currency_code: 'USD', country_custom_name: value.country_custom_name || '' });
                    }}
                >
                    <Globe size={22} className={isOthers ? 'text-brand-primary' : 'text-text-muted'} />
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isOthers ? 'text-brand-primary' : 'text-text-primary'}`}>
                            Others
                        </p>
                        <p className="text-[11px] text-text-muted">Any other country · US Dollar ($)</p>
                    </div>
                    {isOthers && <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />}
                </button>
            </div>

            {/* Custom country name for Others */}
            {isOthers && (
                <input
                    type="text"
                    placeholder="Enter your country name"
                    value={value.country_custom_name || ''}
                    onChange={e => onChange({ ...value, country_custom_name: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
                        focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors
                        placeholder:text-text-muted/50"
                />
            )}

            {/* Selected currency display */}
            {value.currency_code && (
                <div className="flex items-center gap-2 p-3 bg-surface-bg rounded-xl border border-border-soft">
                    <span className="text-xs text-text-muted">Your currency will be set to</span>
                    <span className="text-xs font-bold text-brand-primary">{value.currency_code}</span>
                </div>
            )}
        </div>
    );
}
