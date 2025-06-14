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
          scrollbarColor: colors.grey700,
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
            background: colors.grey700,
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
          height: 4,
        },
        thumb: {
          width: 16,
          height: 16,
          backgroundColor: colors.blue,
          border: `2px solid ${colors.blue}`,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 0 0 8px rgba(0, 122, 255, 0.16)`,
          },
          '&:before': {
            display: 'none',
          },
        },
        track: {
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.blue,
        },
        rail: {
          height: 4,
          borderRadius: 2,
          backgroundColor: `${colors.grey600} !important`,
          '&.MuiSlider-rail': {
            backgroundColor: `${colors.grey600} !important`,
          },
          '&:before': {
            backgroundColor: `${colors.grey600} !important`,
          },
        },
        valueLabel: {
          backgroundColor: colors.grey900,
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
          color: colors.white,
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
          color: colors.grey300,
          '&.Mui-selected': {
            color: colors.white,
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

// Export theme as default
export default theme;
