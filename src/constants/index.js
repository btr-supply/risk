// ===== BTR RISK - COMPREHENSIVE CONSTANTS =====
// Single source of truth for all application constants including theming

// ===== PERFORMANCE CONSTANTS =====
export const PERFORMANCE = {
  THROTTLE_DELAY: 100, // ms - for sliders and rapid updates
  DEBOUNCE_DELAY: 300, // ms - for search and input
  ANIMATION_DURATION: 200, // ms - for transitions
  CHART_UPDATE_INTERVAL: 1000, // ms - for real-time updates
  VIRTUALIZATION_THRESHOLD: 100, // items - when to enable virtualization
  MEMOIZATION_CACHE_SIZE: 1000, // max cached items
};

// ===== LAYOUT CONSTANTS =====
export const LAYOUT = {
  MAX_WIDTH: '1400px',
  CONTAINER_PADDING: { xs: 2, sm: 3, md: 4 },
  SECTION_SPACING: 4,
  CARD_SPACING: 3,
  FIELD_SPACING: 2,

  BORDER_RADIUS: {
    SMALL: 4,
    BASE: 8,
    MEDIUM: 12,
    LARGE: 16,
    ROUND: '50%',
  },

  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },

  BREAKPOINTS: {
    XS: 0,
    SM: 600,
    MD: 900,
    LG: 1200,
    XL: 1536,
  },

  Z_INDEX: {
    DRAWER: 1200,
    MODAL: 1300,
    SNACKBAR: 1400,
    TOOLTIP: 1500,
  },
};

// ===== TYPOGRAPHY CONSTANTS =====
export const TYPOGRAPHY = {
  FONT_FAMILY: [
    'Inter Variable',
    'Inter',
    'Helvetica',
    'Arial',
    'sans-serif',
  ].join(','),

  FONT_SIZES: {
    CAPTION: '0.75rem', // 12px
    BODY_SMALL: '0.875rem', // 14px
    BODY: '1rem', // 16px
    BODY_LARGE: '1.125rem', // 18px
    HEADING_SMALL: '1.25rem', // 20px
    HEADING_MEDIUM: '1.5rem', // 24px
    HEADING_LARGE: '2rem', // 32px
    HEADING_XL: '2.5rem', // 40px
    HEADING_XXL: '3rem', // 48px
  },

  FONT_WEIGHTS: {
    LIGHT: 300,
    REGULAR: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
    EXTRABOLD: 800,
  },

  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.4,
    RELAXED: 1.6,
    LOOSE: 1.8,
  },

  LETTER_SPACING: {
    TIGHT: '-0.025em',
    NORMAL: '0',
    WIDE: '0.025em',
    WIDER: '0.05em',
  },
};

// ===== COLOR CONSTANTS =====
export const COLORS = {
  // Apple-inspired color palette
  PALETTE: {
    PRIMARY: '#007AFF', // Apple blue
    PRIMARY_LIGHT: '#5AC8FA',
    PRIMARY_DARK: '#0051D5',

    SECONDARY: '#FF3B30', // Apple red
    SECONDARY_LIGHT: '#FF6B6B',
    SECONDARY_DARK: '#D70015',

    SUCCESS: '#34C759', // Apple green
    SUCCESS_LIGHT: '#63E884',
    SUCCESS_DARK: '#248A3D',

    WARNING: '#FF9500', // Apple orange
    WARNING_LIGHT: '#FFB340',
    WARNING_DARK: '#D77800',

    ERROR: '#FF3B30', // Apple red
    ERROR_LIGHT: '#FF6B6B',
    ERROR_DARK: '#D70015',

    INFO: '#5AC8FA', // Apple light blue
    INFO_LIGHT: '#7ED7FB',
    INFO_DARK: '#32A6E8',
  },

  // Background colors
  BACKGROUND: {
    DEFAULT: '#000000', // True black
    PAPER: '#1C1C1E', // Apple dark gray
    FORMULA: '#141416', // Darker for formulas
    SURFACE: '#1C1C1E',
    SURFACE_VARIANT: '#2C2C2E',
  },

  // Text colors
  TEXT: {
    PRIMARY: '#FFFFFF', // Pure white
    SECONDARY: '#B0B0B5', // Light grey
    TERTIARY: '#555555', // Apple separator
    DISABLED: '#3A3A3C',
  },

  // Chart colors - optimized for data visualization
  CHART: [
    '#007AFF',
    '#34C759',
    '#FF9500',
    '#FF3B30',
    '#5856D6',
    '#AF52DE',
    '#5AC8FA',
    '#FFCC00',
    '#FF6482',
    '#30D158',
    '#64D2FF',
    '#BF5AF2',
    '#FF375F',
    '#32D74B',
    '#FFD60A',
  ],

  // Sentiment colors for financial data
  SENTIMENT: {
    BULLISH: '#34C759', // Green
    BEARISH: '#FF3B30', // Red
    NEUTRAL: '#8E8E93', // Gray
    CAUTION: '#FF9500', // Orange
  },

  // Functional colors
  FUNCTIONAL: {
    BORDER: '#3A3A3C',
    BORDER_LIGHT: '#48484A',
    DIVIDER: '#3A3A3C',
    FOCUS: '#007AFF',
    LINK: '#007AFF',
    LINK_HOVER: '#5AC8FA',
    OVERLAY: 'rgba(0, 0, 0, 0.5)',
  },

  // Shadows
  SHADOWS: {
    LIGHT: '0 1px 3px rgba(0, 0, 0, 0.12)',
    MEDIUM: '0 4px 6px rgba(0, 0, 0, 0.15)',
    HEAVY: '0 10px 25px rgba(0, 0, 0, 0.25)',
    GLOW: '0 0 20px rgba(0, 122, 255, 0.3)',
  },

  // Opacity levels
  OPACITY: {
    DISABLED: 0.38,
    SECONDARY: 0.6,
    HOVER: 0.04,
    SELECTED: 0.08,
    FOCUS: 0.12,
  },

  // Gradients
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
    SUCCESS: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
    WARNING: 'linear-gradient(135deg, #FF9500 0%, #FFCC00 100%)',
    ERROR: 'linear-gradient(135deg, #FF3B30 0%, #FF6482 100%)',
  },
};

// ===== ANIMATION CONSTANTS =====
export const ANIMATION = {
  DURATION: {
    FAST: '150ms',
    NORMAL: '200ms',
    SLOW: '300ms',
    SLOWER: '500ms',
  },

  EASING: {
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  TRANSITIONS: {
    DEFAULT: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    FAST: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    SLOW: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ===== CHART CONSTANTS =====
export const CHARTS = {
  DEFAULT_HEIGHT: '400px',
  COMPACT_HEIGHT: '300px',
  LARGE_HEIGHT: '500px',

  DATA_LIMITS: {
    MAX_POINTS: 200, // Changed from 100 per user request
    MIN_POINTS: 10,
    DEFAULT_POINTS: 100,
  },

  COLORS: COLORS.CHART,

  MARGINS: {
    TOP: 20,
    RIGHT: 30,
    BOTTOM: 40,
    LEFT: 60,
  },

  GRID: {
    STROKE_WIDTH: 1,
    OPACITY: 0.1,
    COLOR: COLORS.FUNCTIONAL.BORDER,
  },

  AXIS: {
    FONT_SIZE: '0.75rem',
    FONT_FAMILY: 'monospace',
    COLOR: COLORS.TEXT.SECONDARY,
  },

  LEGEND: {
    FONT_SIZE: '0.875rem',
    SPACING: 16,
    ITEM_WIDTH: 120,
  },
};

// ===== FORM CONSTANTS =====
export const FORM = {
  FIELD_SPACING: LAYOUT.FIELD_SPACING,

  INPUT: {
    HEIGHT: 56,
    BORDER_RADIUS: LAYOUT.BORDER_RADIUS.BASE,
    PADDING: '16px',
  },

  SLIDER: {
    HEIGHT: 4,
    THUMB_SIZE: 20,
    MARK_SIZE: 8,
    TRACK_RADIUS: 2,
  },

  VALIDATION: {
    ERROR_COLOR: COLORS.PALETTE.ERROR,
    SUCCESS_COLOR: COLORS.PALETTE.SUCCESS,
    WARNING_COLOR: COLORS.PALETTE.WARNING,
  },
};

// ===== FINANCIAL CONSTANTS =====
export const FINANCIAL = {
  BPS: 10000, // Basis points scale
  PERCENTAGE: 100, // Percentage scale

  PRECISION: {
    CURRENCY: 2,
    PERCENTAGE: 2,
    BPS: 0,
    RATIO: 4,
  },

  FORMATTING: {
    CURRENCY_THRESHOLD: {
      THOUSAND: 1000,
      MILLION: 1000000,
      BILLION: 1000000000,
    },

    DECIMAL_PLACES: {
      CURRENCY: 2,
      PERCENTAGE: 2,
      BPS: 0,
      LARGE_NUMBERS: 1,
    },
  },

  LIMITS: {
    MIN_ALLOCATION: 0,
    MAX_ALLOCATION: 1000000000, // $1B
    MIN_WEIGHT: 0,
    MAX_WEIGHT: 10000, // 100% in BPS
    MIN_SLIPPAGE: 0,
    MAX_SLIPPAGE: 10000, // 100% in BPS
  },
};

// ===== COMPONENT CONSTANTS =====
export const COMPONENTS = {
  CARD: {
    PADDING: LAYOUT.SPACING.MD,
    BORDER_RADIUS: LAYOUT.BORDER_RADIUS.BASE,
    ELEVATION: 1,
  },

  BUTTON: {
    HEIGHT: 40,
    PADDING: '8px 16px',
    BORDER_RADIUS: LAYOUT.BORDER_RADIUS.BASE,
    FONT_WEIGHT: TYPOGRAPHY.FONT_WEIGHTS.MEDIUM,
  },

  CHIP: {
    HEIGHT: 32,
    PADDING: '6px 12px',
    BORDER_RADIUS: LAYOUT.BORDER_RADIUS.LARGE,
    FONT_SIZE: TYPOGRAPHY.FONT_SIZES.BODY_SMALL,
  },

  TOOLTIP: {
    MAX_WIDTH: 300,
    PADDING: '8px 12px',
    BORDER_RADIUS: LAYOUT.BORDER_RADIUS.SMALL,
    FONT_SIZE: TYPOGRAPHY.FONT_SIZES.BODY_SMALL,
  },
};

// ===== DEVELOPMENT CONSTANTS =====
export const DEVELOPMENT = {
  LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  ENABLE_DEVTOOLS: process.env.NODE_ENV === 'development',
  API_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  CACHE_TTL: 300000, // 5 minutes
};

// ===== THEME VARIANTS =====
export const THEME_VARIANTS = {
  DARK: 'dark',
  LIGHT: 'light',
  HIGH_CONTRAST: 'high-contrast',
  AUTO: 'auto',
};

// ===== ACCESSIBILITY CONSTANTS =====
export const A11Y = {
  FOCUS_VISIBLE_OUTLINE: `2px solid ${COLORS.PALETTE.PRIMARY}`,
  MIN_TOUCH_TARGET: 44, // px - minimum touch target size
  MIN_COLOR_CONTRAST: 4.5, // WCAG AA standard
  REDUCED_MOTION_QUERY: '(prefers-reduced-motion: reduce)',
  HIGH_CONTRAST_QUERY: '(prefers-contrast: high)',
};

// ===== RESPONSIVE BREAKPOINTS =====
export const BREAKPOINTS = LAYOUT.BREAKPOINTS;

// ===== LEGACY COMPATIBILITY =====
// Keep these for backward compatibility during migration
export const CHART_DATA_LIMIT = CHARTS.DATA_LIMITS.MAX_POINTS;
export const DEFAULT_CHART_HEIGHT = CHARTS.DEFAULT_HEIGHT;
