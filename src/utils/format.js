// Comprehensive formatting utilities - converted from user's TypeScript version

export function toRaw(s) {
  return s
    .replace(/[^0-9A-Za-zÀ-ÖØ-öø-ÿ-_.,:;\s]+/g, '')
    .toLowerCase()
    .trim();
}

export function slugify(s, sep = '-') {
  return toRaw(s).replace(/[-_.,;\s]+/gi, sep);
}

export function unslug(s, sep = '-') {
  return capitalize(toRaw(s).replace(sep, ' '));
}

export function capitalize(str) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

export function toHtml(text) {
  if (text.trim().match(/^<[^>]+>/)) {
    return text;
  }
  return text
    .trim()
    .replace(/(?:\r\n|\r|\n)/g, '<br>')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\s\s/g, '&nbsp;&nbsp;');
}

// Currency enum as object
export const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  JPY: 'JPY',
  CNY: 'CNY',
  GBP: 'GBP',
  CHF: 'CHF',
  CAD: 'CAD',
  AUD: 'AUD',
  NZD: 'NZD',
  HKD: 'HKD',
  SGD: 'SGD',
  KRW: 'KRW',
  TWD: 'TWD',
  BRL: 'BRL',
  INR: 'INR',
  RUB: 'RUB',
  MXN: 'MXN',
};

export const SYMBOL_BY_ISO = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.JPY]: '¥',
  [Currency.CNY]: '¥',
  [Currency.GBP]: '£',
  [Currency.CHF]: 'CHF',
  [Currency.CAD]: 'C$',
  [Currency.AUD]: 'A$',
  [Currency.NZD]: 'NZ$',
  [Currency.HKD]: 'HK$',
  [Currency.SGD]: 'S$',
  [Currency.KRW]: '₩',
  [Currency.TWD]: 'NT$',
  [Currency.BRL]: 'R$',
  [Currency.INR]: '₹',
  [Currency.RUB]: '₽',
  [Currency.MXN]: '$',
};

// FormatterType enum as object
export const FormatterType = {
  NUMBER: 'number',
  COMPACT: 'compact',
  CURRENCY: '$',
  CURRENCY_COMPACT: '$compact',
  PERCENT: 'percent',
  TIME: 'time',
  DATETIME: 'datetime',
  DATE: 'date',
  CHRONO: 'chrono',
  STRING: 'string',
  SLUG: 'slug',
  UNSLUG: 'unslug',
  HTML: 'html',
  LINK: 'link',
  IMAGE: 'image',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
};

// Mock implementations of missing utilities (these should be imported from actual files)
const round = (num, decimals = 2) =>
  Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
const getDigits = (num) =>
  Math.abs(num) < 1 ? Math.ceil(Math.log10(1 / Math.abs(num))) : 0;
const truncateTrailingZeroes = (num) => parseFloat(num.toString());

export function toUS(n = 0, minDigits = 2, maxDigits = 2) {
  if (maxDigits < minDigits) maxDigits = minDigits;
  return n.toLocaleString('en-US', {
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: minDigits,
  });
}

export function toPercent(
  n = 0,
  scale = 2,
  signed = false,
  hidePercentSign = false
) {
  const sign = signed && n > 0 ? '+' : '';
  if (n >= 2) {
    return round(n, scale) + 'x';
  }
  return (
    sign +
    ((n * 100).toLocaleString('en-US', {
      maximumFractionDigits: scale,
      minimumFractionDigits: Math.min(scale, 2),
    }) || '00.00') +
    (hidePercentSign ? '' : '%')
  );
}

export function toFloat(n = 0, signed = true, minDigits = 2, maxDigits = 2) {
  const sign = n < 0 ? '-' : signed ? '+' : '';
  return sign + toUS(Math.abs(n), minDigits, maxDigits);
}

export const COMPACT_FORMATTER = Intl.NumberFormat('en', {
  notation: 'compact',
});

export function toFloatCompact(n = 0, signed = true) {
  const sign = n < 0 ? '-' : signed ? '+' : '';
  return sign + COMPACT_FORMATTER.format(Math.abs(n));
}

export function toFloatAuto(n = 0, signed = true, precision = 4) {
  if (Math.abs(n) > 5_000_000) {
    return toFloatCompact(n, signed);
  } else if (n != 0.0 && Math.abs(n) < 0.001) {
    precision = Math.min(precision, getDigits(n) + 2);
    return round(n, precision).toExponential();
  }
  return toFloat(n, signed, Math.min(2, precision), precision);
}

export function toCurrencyCompact(
  n = 0,
  currency = Currency.USD,
  signed = false
) {
  const sign = n < 0 ? '-' : signed ? '+' : '';
  return sign + SYMBOL_BY_ISO[currency] + COMPACT_FORMATTER.format(Math.abs(n));
}

export function toDollarsCompact(n = 0, signed = false) {
  return toCurrencyCompact(n, Currency.USD, signed);
}

export function toFloatNoTrailing(n = 0, signed = true, maxDigits = 3) {
  return toFloat(n, signed, 0, maxDigits);
}

export function toDollarsNoTrailing(n = 0, signed = false, maxDigits = 3) {
  const sign = n < 0 ? '-' : signed ? '+' : '';
  return sign + '$' + toFloatNoTrailing(n, false, maxDigits);
}

export const precisionByCurrency = {
  [Currency.EUR]: 2,
  [Currency.USD]: 2,
  [Currency.CHF]: 2,
  [Currency.CAD]: 2,
  [Currency.AUD]: 2,
  [Currency.NZD]: 2,
  [Currency.HKD]: 2,
  [Currency.SGD]: 2,
  [Currency.JPY]: 4,
};

export function toCurrencyAuto(
  n = 0,
  currency = Currency.USD,
  signed = false,
  precision
) {
  const unsigned = Math.abs(n);
  const sign = n < 0 ? '-' : signed ? '+' : '';
  if (!precision) {
    precision =
      unsigned < 0.1
        ? getDigits(unsigned) + 1
        : ((unsigned >= 8_000 ? 0 : precisionByCurrency?.[currency]) ?? 4);
  }
  return (
    sign + SYMBOL_BY_ISO[currency] + toFloatAuto(unsigned, false, precision)
  );
}

export function toDollarsAuto(n = 0, signed = false) {
  return toCurrencyAuto(n, Currency.USD, signed);
}

export function toChrono(ms = 0) {
  if (!ms || ms < 0) return '0ms';

  const seconds = ms / 1000;

  if (seconds < 1) {
    return `${Math.round(ms)}ms`;
  }

  if (seconds < 60) {
    return `${round(seconds, 2)}s`;
  }

  if (seconds < 3600) {
    return `${round(seconds / 60, 2)}m`;
  }

  if (seconds < 86400) {
    return `${round(seconds / 3600, 2)}h`;
  }

  if (seconds < 31536000) {
    return `${round(seconds / 86400, 2)}d`;
  }

  return `${round(seconds / 31536000, 2)}y`;
}

export function humanizeSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${round(bytes / Math.pow(1024, i), 2)} ${units[i]}`;
}

export function formatLatency(ms) {
  return ms >= 1000 ? '1s+' : `${ms}ms`;
}

export function toDurationAuto(n = 0, unit = 'ms') {
  if (!n) {
    return '--';
  }
  const units = ['w', 'd', 'h', 'm', 's', 'ms'];
  const divisors = [604800000, 86400000, 3600000, 60000, 1000, 1];
  let ms = n * divisors[units.indexOf(unit)];

  const vals = [];
  for (let i = 1; i < units.length - 1; i++) {
    vals.push(Math.floor(ms / divisors[i]));
    ms %= divisors[i];
  }
  const fmt = (v) => v.toString().padStart(2, '0');
  const [d, h, m, s] = vals;
  if (d > 0) return `${fmt(d)}:${fmt(h)}:${fmt(m)}:${fmt(s)}`;
  if (h + m > 0) return `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
  if (ms + s < 0) return `--`;
  ms = truncateTrailingZeroes(round(ms, 3));
  return s ? `${s}.${ms}s` : `${ms}ms`;
}

// Default formatters mapping
export const DEFAULT_FORMATTER_BY_TYPE = {
  [FormatterType.NUMBER]: (v) => toFloatAuto(v),
  'number:raw': (v) => v.toString(),
  [FormatterType.COMPACT]: (v) => toFloatCompact(v),
  [FormatterType.CURRENCY]: (v) => toDollarsAuto(v),
  [FormatterType.CURRENCY_COMPACT]: (v) => toDollarsCompact(v),
  [FormatterType.PERCENT]: (v) => toPercent(v),
  [FormatterType.CHRONO]: (v) => toChrono(v),
  [FormatterType.STRING]: (v) => v.toString(),
  [FormatterType.SLUG]: (v) => slugify(v),
  [FormatterType.UNSLUG]: (v) => unslug(v),
  [FormatterType.HTML]: (v) => toHtml(v),
  [FormatterType.BOOLEAN]: (v) => v,
  [FormatterType.OBJECT]: (v) => JSON.stringify(v),
};

// Export math utilities
export { round, getDigits, truncateTrailingZeroes };

// ===== BTR-SPECIFIC FORMATTERS =====

// Additional BTR-specific formatters using the base utilities
export const formatBasisPoints = (bp, decimals = 2) =>
  toPercent(bp / 10000, decimals);
export const formatRatio = (ratio, decimals = 4) =>
  toFloatAuto(ratio, false, decimals);
export const formatAllocation = (allocation) => toDollarsAuto(allocation);
export const formatWeight = (weight) => toPercent(weight / 10000, 2);

// Chart-specific formatters
export const formatChartValue = (value, type = 'currency') => {
  switch (type) {
    case 'currency':
      return toDollarsAuto(value);
    case 'percentage':
      return toPercent(value);
    case 'basis-points':
      return formatBasisPoints(value);
    case 'number':
      return toFloatAuto(value);
    default:
      return value?.toString() || '';
  }
};

// ===== PERFORMANCE OPTIMIZATION =====

// Performance-optimized formatter cache
const formatterCache = new Map();

export const getCachedFormatter = (type) => {
  if (formatterCache.has(type)) {
    return formatterCache.get(type);
  }

  const formatter =
    DEFAULT_FORMATTER_BY_TYPE[type] || ((v) => v?.toString() || '');
  formatterCache.set(type, formatter);
  return formatter;
};

// Memoized formatters for heavy usage
export const createMemoizedFormatter = (formatterFn) => {
  const cache = new Map();
  return (value, ...args) => {
    const key = JSON.stringify([value, ...args]);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = formatterFn(value, ...args);
    cache.set(key, result);
    return result;
  };
};

// Pre-memoized common formatters using the efficient BTR utilities
export const memoizedCurrencyFormatter = createMemoizedFormatter(toDollarsAuto);
export const memoizedPercentFormatter = createMemoizedFormatter(toPercent);
export const memoizedFloatFormatter = createMemoizedFormatter(toFloatAuto);

// ===== LEGACY COMPATIBILITY =====

// Legacy compatibility - these should be gradually replaced with the auto formatters
export const formatCurrency = toDollarsAuto;
export const formatNumber = toFloatAuto;
export const formatPercentage = toPercent;
