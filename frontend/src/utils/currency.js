import i18n from 'i18next';

const CURRENCY_CONFIG = {
    en: { symbol: '$', multiplier: 1, code: 'USD' },
    bn: { symbol: '৳', multiplier: 110, code: 'BDT' },
    hi: { symbol: '₹', multiplier: 83, code: 'INR' },
    ne: { symbol: 'रू', multiplier: 133, code: 'NPR' },
    id: { symbol: 'Rp', multiplier: 15600, code: 'IDR' },
    ms: { symbol: 'RM', multiplier: 4.7, code: 'MYR' },
    ar: { symbol: 'د.إ', multiplier: 3.67, code: 'AED' },
};

export const formatPrice = (amount, decimals = 0) => {
    if (typeof amount !== 'number') {
        const parsed = parseFloat(amount);
        amount = isNaN(parsed) ? 0 : parsed;
    }

    const lang = i18n.language?.split('-')[0] || 'en';
    const config = CURRENCY_CONFIG[lang] || CURRENCY_CONFIG.en;

    const convertedAmount = Math.round(amount * config.multiplier);

    return `${config.symbol}${convertedAmount.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })}`;
};
