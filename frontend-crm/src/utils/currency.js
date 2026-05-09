export const CURRENCY_INFO = {
  USD: { name: 'US Dollar',          symbol: '$',    rate: 1      },
  BDT: { name: 'Bangladeshi Taka',   symbol: '৳',    rate: 120    },
  INR: { name: 'Indian Rupee',       symbol: '₹',    rate: 85     },
  NPR: { name: 'Nepali Rupee',       symbol: 'रू',   rate: 135    },
  IDR: { name: 'Indonesian Rupiah',  symbol: 'Rp',   rate: 16000  },
  MYR: { name: 'Malaysian Ringgit',  symbol: 'RM',   rate: 4.7    },
  AED: { name: 'UAE Dirham',         symbol: 'د.إ',  rate: 3.67   },
  SAR: { name: 'Saudi Riyal',        symbol: 'ر.س',  rate: 3.75   },
  QAR: { name: 'Qatari Riyal',       symbol: 'ر.ق',  rate: 3.64   },
  KWD: { name: 'Kuwaiti Dinar',      symbol: 'د.ك',  rate: 0.31   },
  EGP: { name: 'Egyptian Pound',     symbol: 'ج.م',  rate: 48     },
  JOD: { name: 'Jordanian Dinar',    symbol: 'د.ا',  rate: 0.71   },
};

const LS_KEY = 'crm_currency_code';

export const getAdminCurrencyCode = () =>
  localStorage.getItem(LS_KEY) || 'USD';

export const setAdminCurrencyCode = (code) =>
  localStorage.setItem(LS_KEY, code);

/** Convert amount from one currency to another using hardcoded rates (routed via USD). */
export function convertCurrency(amount, fromCode, toCode) {
  if (!amount || fromCode === toCode) return Number(amount ?? 0);
  const from = CURRENCY_INFO[fromCode]?.rate ?? 1;
  const to   = CURRENCY_INFO[toCode]?.rate   ?? 1;
  return (Number(amount) / from) * to;
}

/** Format an amount (in fromCode) into the admin's display currency. */
export function fmtAdminPrice(amount, fromCode) {
  const toCode = getAdminCurrencyCode();
  const converted = convertCurrency(amount, fromCode || 'USD', toCode);
  const symbol = CURRENCY_INFO[toCode]?.symbol ?? toCode + ' ';
  return `${symbol}${converted.toFixed(2)}`;
}
