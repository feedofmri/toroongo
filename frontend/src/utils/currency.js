import i18n from 'i18next';
import { api } from '../services/api';

// How many units of each currency equal 1 USD
export const CURRENCY_RATES = {
    USD: 1,
    BDT: 120,
    INR: 85,
    NPR: 135,
    IDR: 16000,
    MYR: 4.7,
    AED: 3.67,
    SAR: 3.75,
    QAR: 3.64,
    KWD: 0.31,
    EGP: 48.0,
    JOD: 0.71,
};

export const CURRENCY_INFO = {
    USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
    BDT: { symbol: '৳', code: 'BDT', name: 'Bangladeshi Taka' },
    INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
    NPR: { symbol: 'रू', code: 'NPR', name: 'Nepali Rupee' },
    IDR: { symbol: 'Rp', code: 'IDR', name: 'Indonesian Rupiah' },
    MYR: { symbol: 'RM', code: 'MYR', name: 'Malaysian Ringgit' },
    AED: { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham' },
    SAR: { symbol: 'ر.س', code: 'SAR', name: 'Saudi Riyal' },
    QAR: { symbol: 'ر.ق', code: 'QAR', name: 'Qatari Riyal' },
    KWD: { symbol: 'د.ك', code: 'KWD', name: 'Kuwaiti Dinar' },
    EGP: { symbol: 'ج.م', code: 'EGP', name: 'Egyptian Pound' },
    JOD: { symbol: 'د.ا', code: 'JOD', name: 'Jordanian Dinar' },
};

// Default currency per i18n language (fallback when user has no profile)
const LANG_TO_CURRENCY = {
    en: 'USD',
    bn: 'BDT',
    hi: 'INR',
    ne: 'NPR',
    id: 'IDR',
    ms: 'MYR',
    ar: 'AED',
};

// Map country codes to our supported currencies
export const COUNTRY_TO_CURRENCY = {
    BD: 'BDT',
    IN: 'INR',
    NP: 'NPR',
    ID: 'IDR',
    MY: 'MYR',
    AE: 'AED',
    SA: 'SAR',
    QA: 'QAR',
    KW: 'KWD',
    EG: 'EGP',
    JO: 'JOD',
};

const CURRENCY_STORAGE_KEY = 'toroongo_currency_code';
const CURRENCY_MANUAL_KEY = 'toroongo_currency_manual';

export function getBuyerCurrencyCode() {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (saved && CURRENCY_RATES[saved]) return saved;
    const lang = i18n.language?.split('-')[0] || 'en';
    return LANG_TO_CURRENCY[lang] || 'USD';
}

export function setBuyerCurrencyCode(code, isManual = false) {
    if (CURRENCY_RATES[code]) {
        localStorage.setItem(CURRENCY_STORAGE_KEY, code);
        if (isManual) {
            localStorage.setItem(CURRENCY_MANUAL_KEY, 'true');
        }
    }
}

// Convert amount from fromCode currency to toCode currency
export function convertCurrency(amount, fromCode = 'USD', toCode = 'USD') {
    const fromRate = CURRENCY_RATES[fromCode] || 1;
    const toRate = CURRENCY_RATES[toCode] || 1;
    return (amount / fromRate) * toRate;
}

// Format a price that is stored in sellerCurrencyCode, displayed in buyer's currency
// sellerCurrencyCode defaults to USD for backward compatibility
export const formatPrice = (amount, sellerCurrencyCode = 'USD', decimals = 0) => {
    if (typeof amount !== 'number') {
        const parsed = parseFloat(amount);
        amount = isNaN(parsed) ? 0 : parsed;
    }

    const buyerCode = getBuyerCurrencyCode();
    const converted = convertCurrency(amount, sellerCurrencyCode, buyerCode);
    const info = CURRENCY_INFO[buyerCode] || CURRENCY_INFO.USD;

    const rounded = decimals > 0 ? converted : Math.round(converted);
    return `${info.symbol}${rounded.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
};

// Format a price in a specific currency (no conversion — used for seller views)
export const formatPriceInCurrency = (amount, currencyCode = 'USD', decimals = 0) => {
    if (typeof amount !== 'number') {
        const parsed = parseFloat(amount);
        amount = isNaN(parsed) ? 0 : parsed;
    }

    const info = CURRENCY_INFO[currencyCode] || CURRENCY_INFO.USD;
    const rounded = decimals > 0 ? amount : Math.round(amount);
    return `${info.symbol}${rounded.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
};

// Return just the buyer's currency symbol
export function getBuyerCurrencySymbol() {
    return (CURRENCY_INFO[getBuyerCurrencyCode()] || CURRENCY_INFO.USD).symbol;
}

/**
 * Attempts to detect user's country via IP and set currency accordingly
 * only for guest users who haven't manually set one.
 */
export async function detectAndSetGuestCurrency() {
    const isManual = localStorage.getItem(CURRENCY_MANUAL_KEY) === 'true';
    if (isManual) return; // Respect user's active choice

    try {
        // Use our own backend endpoint to avoid CORS/Mixed Content issues
        const data = await api('/system/detect-location').catch(() => null);
        
        if (data && data.countryCode) {
            const currency = COUNTRY_TO_CURRENCY[data.countryCode] || 'USD';

            // Update if different or not set
            const current = localStorage.getItem(CURRENCY_STORAGE_KEY);
            if (currency !== current) {
                localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
                // Trigger a refresh if the currency changed to update the UI
                if (current) window.location.reload();
            }

            // Also suggest language change if applicable
            const langMap = { BD: 'bn', IN: 'hi', NP: 'ne', ID: 'id', MY: 'ms', AE: 'ar' };
            if (langMap[data.countryCode]) {
                return {
                    suggestedLang: langMap[data.countryCode],
                    country: data.country || data.countryCode
                };
            }
        }
    } catch (e) {
        // Fallback silently
    }
}
