// ===== BTR RISK - CONSOLIDATED THEME AND CONSTANTS =====
// All constants and theme definition in MUI-compatible structure

import { createTheme } from '@mui/material/styles';

// ===== SINGLE SOURCE OF TRUTH FOR ALL COLORS =====
const colors = {
  // normal
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#a82ee6',
  yellow: '#FFCC00',
  red: '#FF3B30',
  // light
  lightBlue: '#5AC8FA',
  lightGreen: '#60eb83',
  lightOrange: '#ffb340',
  lightPurple: '#BF5AF2',
  lightYellow: '#fae05c',
  lightRed: '#FF6B6B',
  // dark
  darkBlue: '#0051D5',
  darkGreen: '#11822d',
  darkOrange: '#d66a00',
  darkPurple: '#6441a5',
  darkRed: '#bd1323',
  darkYellow: '#d6b100',

  // Grey scale
  white: '#f7f7f7',
  grey50: '#F2F2F7',
  grey100: '#E5E5EA',
  grey200: '#D1D1D6',
  grey300: '#C7C7CC',
  grey400: '#AEAEB2',
  grey500: '#8E8E93',
  grey600: '#636366',
  grey700: '#48484A',
  grey800: '#3A3A3C',
  grey900: '#242424',
  black: '#171717',
};

const chartColors = [
  colors.blue,
  colors.green,
  colors.orange,
  colors.purple,
  colors.yellow,
  colors.red,
  colors.lightBlue,
  colors.lightGreen,
  colors.lightOrange,
  colors.lightPurple,
  colors.lightYellow,
  colors.lightRed,
  colors.darkBlue,
  colors.darkGreen,
  colors.darkOrange,
  colors.darkPurple,
  colors.darkYellow,
  colors.darkRed,
];

// ===== MUI THEME WITH INTEGRATED CONSTANTS =====
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.blue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.green,
      light: colors.lightGreen,
      dark: colors.darkGreen,
      contrastText: colors.white,
    },
    success: {
      main: colors.green,
      light: colors.lightGreen,
      dark: colors.darkGreen,
    },
    warning: {
      main: colors.orange,
      light: colors.lightOrange,
      dark: colors.darkOrange,
    },
    error: {
      main: colors.red,
      light: colors.lightRed,
      dark: colors.darkRed,
    },
    info: {
      main: colors.blue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
    },
    background: {
      default: colors.black,
      paper: colors.grey900,
      formula: colors.grey900,
    },
    text: {
      primary: colors.white,
      secondary: colors.grey300,
      tertiary: colors.grey500,
      disabled: colors.grey300,
    },
    grey: {
      50: colors.grey50,
      100: colors.grey100,
      200: colors.grey200,
      300: colors.grey300,
      400: colors.grey400,
      500: colors.grey500,
      600: colors.grey600,
      700: colors.grey700,
      800: colors.grey800,
      900: colors.grey900,
    },
    divider: colors.grey700,
  },

  typography: {
    fontFamily: [
      'var(--font-inter)',
      'Inter Variable',
      'Inter',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem', // 48px
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: colors.white,
    },
    h2: {
      fontSize: '2.5rem', // 40px
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: colors.white,
    },
    h3: {
      fontSize: '2rem', // 32px
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: colors.white,
    },
    h4: {
      fontSize: '1.5rem', // 24px
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      color: colors.white,
      marginBottom: '0.75rem !important',
    },
    h5: {
      fontSize: '1.25rem', // 20px
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      color: colors.white,
    },
    h6: {
      fontSize: '1.125rem', // 18px
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      color: colors.white,
    },
    body1: {
      fontSize: '1.125rem', // 18px
      fontWeight: 300,
      lineHeight: 1.6,
      color: colors.white,
    },
    body2: {
      fontSize: '1rem', // 16px
      fontWeight: 300,
      lineHeight: 1.6,
      color: colors.grey300,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1rem',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 300,
      lineHeight: 1.4,
      color: colors.grey300,
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflowY: 'scroll',
        },
        body: {
          fontFeatureSettings: '"kern"',
          overflowX: 'hidden',
          margin: '0',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: colors.grey900,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.grey700,
            borderRadius: '4px',
            '&:hover': {
              background: colors.grey500,
            },
          },
          '&::-webkit-scrollbar-corner': {
            background: colors.grey900,
          },
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.grey700} ${colors.grey900}`,
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: colors.grey900,
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: colors.grey700,
          borderRadius: '4px',
          '&:hover': {
            background: colors.grey500,
          },
        },
        '*::-webkit-scrollbar-corner': {
          background: colors.grey900,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: colors.green,
          color: colors.white,
          '&:hover': {
            backgroundColor: colors.lightGreen,
          },
        },
        outlined: {
          borderColor: colors.grey700,
          color: colors.white,
          '&:hover': {
            borderColor: colors.grey500,
            backgroundColor: colors.grey900,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${colors.grey700}`,
          boxShadow: 'none',
          backgroundColor: colors.grey900,
          '&:hover': {
            borderColor: colors.grey500,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
          backgroundColor: `${colors.black}`,
          border: `1px solid ${colors.grey700}`,
        },
        elevation0: {
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          backgroundColor: colors.grey900,
          color: colors.grey300,
          border: `1px solid ${colors.grey700}`,
          height: 24,
        },
        outlined: {
          borderWidth: '1px',
          borderColor: colors.grey700,
          color: colors.white,
        },
        sizeSmall: {
          height: 20,
          fontSize: '0.75rem',
        },
        label: {
          paddingLeft: 8,
          paddingRight: 8,
        },
        labelSmall: {
          paddingLeft: 6,
          paddingRight: 6,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          // Let ParameterSlider component handle its own styling
          // Only provide minimal defaults for other slider usage
          '& .MuiSlider-rail': {
            backgroundColor: colors.grey600,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: colors.grey700,
            },
            '&:hover fieldset': {
              borderColor: colors.grey500,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.blue,
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.grey300,
            '&.Mui-focused': {
              color: colors.blue,
            },
          },
          '& .MuiInputBase-input': {
            color: colors.white,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderBottom: 'none',
        },
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          fontStyle: 'italic',
          fontSize: '0.875rem',
          minHeight: 48,
          padding: '8px 16px',
          color: colors.grey500, // A darker grey for inactive tabs
          transition: 'color 0.2s ease-in-out',

          '&.Mui-selected': {
            color: `${colors.white} !important`, // Ensure active is white
            fontWeight: 700,
          },

          '&:hover': {
            color: colors.white,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.grey700}`,
          backgroundColor: colors.grey900,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px !important',
          padding: '0 0 !important',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1200px !important',
          paddingLeft: '16px !important',
          paddingRight: '16px !important',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxSizing: 'border-box',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.grey900,
          color: colors.white,
          border: `1px solid ${colors.grey700}`,
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 8px',
          boxShadow: 'none',
        },
        arrow: {
          color: colors.grey900,
          '&:before': {
            border: `1px solid ${colors.grey700}`,
          },
        },
      },
    },
  },

  // Custom theme extensions
  colors: {
    // Chart colors - optimized for data visualization
    chart: chartColors,

    // Functional colors
    functional: {
      border: colors.grey700,
      borderLight: colors.grey500,
      divider: colors.grey700,
      focus: colors.blue,
      link: colors.blue,
      linkHover: colors.lightBlue,
      overlay: colors.grey900,
      surfaceVariant: colors.grey900,
    },

    // Washed off colors for reference lines
    washedOff: {
      blue: colors.lightBlue,
      green: colors.lightGreen,
      orange: colors.lightOrange,
      purple: colors.lightPurple,
      yellow: colors.lightYellow,
      red: colors.lightRed,
    },

    // Sentiment colors for financial data
    sentiment: {
      bullish: colors.green,
      bearish: colors.red,
      neutral: colors.grey300,
      caution: colors.orange,
    },
  },

  // Legacy support
  chartColors,
});

// Layout constants that don't belong in theme
export const LAYOUT = {
  maxWidth: '1400px',
  containerPadding: { xs: 2, sm: 3, md: 4 },
  sectionSpacing: 4,
  cardSpacing: 3,
  fieldSpacing: 2,
};

// Performance constants
export const PERFORMANCE = {
  throttleDelay: 100, // ms
  debounceDelay: 300, // ms
  animationDuration: 200, // ms
};

// Financial constants
export const FINANCIAL = {
  bps: 10000, // Basis points scale
  BPS: 10000, // Backward compatibility - uppercase version
  percentage: 100, // Percentage scale
  precision: {
    currency: 2,
    percentage: 2,
    bps: 0,
    ratio: 4,
  },
};

// Chart constants
export const CHARTS = {
  defaultHeight: '400px',
  compactHeight: '300px',
  largeHeight: '500px',
  dataLimits: {
    maxPoints: 200,
    minPoints: 10,
    defaultPoints: 100,
  },
};

// =====  COMPONENT STYLING UTILITIES =====
// Common styling patterns consolidated to eliminate duplication across components

// =====  COMPREHENSIVE SPACING SYSTEM =====
// All padding, margin, and spacing values centralized for consistency

export const SPACING = {
  // Base unit spacing (MUI units)
  xs: 0.5, // 4px
  sm: 1, // 8px
  md: 1.5, // 12px
  lg: 2, // 16px
  xl: 2.5, // 20px
  xxl: 3, // 24px
  xxxl: 4, // 32px
  huge: 5, // 40px

  // Component-specific spacing
  card: {
    padding: 2.5, // Internal card content padding
    margin: 2, // Between cards
    headerMargin: 2.5, // Below card headers
  },

  section: {
    margin: 5, // Between major sections
    titleMargin: 3, // Below section titles
    padding: { xs: 2, sm: 3, md: 4 }, // Section container padding
  },

  button: {
    padding: '8px 16px', // Standard button padding
    margin: 1, // Between buttons
    groupGap: 1.5, // In button groups
  },

  form: {
    fieldSpacing: 2, // Between form fields
    groupSpacing: 3, // Between form groups
    labelMargin: 1, // Below labels
  },

  layout: {
    container: { xs: 2, sm: 3, md: 4 }, // Container padding
    itemGap: 1.5, // General item spacing
    gridGap: 2, // Grid item spacing
    listItemGap: 1, // List item spacing
  },

  chart: {
    padding: 2, // Chart container padding
    margin: 2, // Between charts
    legendGap: 1.5, // Chart legend spacing
  },

  // Legacy compatibility - keep existing names
  cardPadding: 2.5,
  sectionMargin: 2.5,
  itemGap: 1.5,
  borderRadius: 1,
};

// Common SX patterns - reusable across components
export const COMMON_SX = {
  // Card content layout - used by multiple card types
  cardContent: {
    p: SPACING.card.padding,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  // Card header with title and action - common pattern
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: SPACING.card.headerMargin,
  },

  // Full height card - common pattern
  fullHeightCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  // Common paper/container styling
  paperContainer: {
    borderRadius: SPACING.borderRadius,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
  },

  // Monospace text styling - repeated pattern
  monospace: {
    fontFamily: 'monospace',
    fontWeight: 600,
  },

  // Chart container centering - repeated pattern
  chartCenter: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Responsive text patterns
  responsiveText: {
    small: {
      fontSize: { xs: '0.65rem', sm: '0.75rem' },
    },
    mono: {
      fontFamily: 'monospace',
      fontSize: { xs: '0.65rem', sm: '0.75rem' },
    },
  },
};

// Utility functions for common patterns
export const createFlexColumnSx = (gap = SPACING.layout.itemGap) => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
});

// Additional spacing utilities
export const createFlexRowSx = (gap = SPACING.layout.itemGap) => ({
  display: 'flex',
  flexDirection: 'row',
  gap,
});

export const createGridSx = (gap = SPACING.layout.gridGap) => ({
  display: 'grid',
  gap,
});

export const createButtonGroupSx = (gap = SPACING.button.groupGap) => ({
  display: 'flex',
  gap,
  alignItems: 'center',
});

export const createFormGroupSx = (spacing = SPACING.form.fieldSpacing) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing,
});

// Create consistent card variant styles
export const createCardVariantSx = (variant = 'default', customSx = {}) => {
  const baseCard = {
    ...COMMON_SX.paperContainer,
    ...COMMON_SX.fullHeightCard,
  };

  const variants = {
    parameter: baseCard,
    simulation: {
      ...baseCard,
      '& .MuiCardContent-root': {
        ...COMMON_SX.cardContent,
      },
    },
    description: baseCard,
  };

  return {
    ...(variants[variant] || variants.default),
    ...customSx,
  };
};

// Create consistent content wrapper styles
export const createContentWrapperSx = (variant = 'default') => {
  const base = {
    ...COMMON_SX.cardContent,
  };

  const variants = {
    simulation: {
      ...base,
      ...COMMON_SX.chartCenter,
    },
    parameter: base,
    description: base,
  };

  return variants[variant] || base;
};

// Export theme as default
export default theme;
