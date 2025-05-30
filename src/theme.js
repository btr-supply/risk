import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007AFF', // Apple blue
      light: '#5AC8FA',
      dark: '#0051D5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF3B30', // Apple red
      light: '#FF6B6B',
      dark: '#D70015',
      contrastText: '#ffffff',
    },
    success: {
      main: '#34C759', // Apple green
      light: '#63E884',
      dark: '#248A3D',
    },
    warning: {
      main: '#FF9500', // Apple orange
      light: '#FFB340',
      dark: '#D77800',
    },
    error: {
      main: '#FF3B30', // Apple red
      light: '#FF6B6B',
      dark: '#D70015',
    },
    info: {
      main: '#5AC8FA', // Apple light blue
      light: '#7ED7FB',
      dark: '#32A6E8',
    },
    background: {
      default: '#000000', // True black for deep contrast
      paper: '#1C1C1E', // Apple dark gray
      formula: '#141416', // Darker than paper for formula/simulation containers
    },
    text: {
      primary: '#FFFFFF', // Pure white
      secondary: '#B0B0B5', // Lighter grey (was '#8E8E93')
      tertiary: '#555555', // Apple separator
    },
    grey: {
      50: '#F2F2F7',
      100: '#E5E5EA',
      200: '#D1D1D6',
      300: '#C7C7CC',
      400: '#AEAEB2',
      500: '#8E8E93',
      600: '#636366',
      700: '#48484A',
      800: '#3A3A3C',
      900: '#2C2C2E',
    },
    divider: '#3A3A3C', // Apple separator
  },

  // Enhanced color palette - Apple UI inspired with vivid contrasts
  colors: {
    // Core sentiment colors
    sentiment: {
      bullish: '#34C759', // Green
      bearish: '#FF3B30', // Red
      neutral: '#8E8E93', // Gray
      caution: '#FF9500', // Orange
    },

    // Chart colors - vivid and well-contrasted for data visualization
    chart: [
      '#007AFF', // Apple blue
      '#34C759', // Apple green
      '#FF9500', // Apple orange
      '#FF3B30', // Apple red
      '#5856D6', // Apple purple
      '#AF52DE', // Apple magenta
      '#5AC8FA', // Apple light blue
      '#FFCC00', // Apple yellow
      '#FF6482', // Apple pink
      '#30D158', // Apple mint
      '#64D2FF', // Apple cyan
      '#BF5AF2', // Apple violet
      '#FF375F', // Apple crimson
      '#32D74B', // Apple lime
      '#FFD60A', // Apple gold
    ],

    // Washed-off colors with 50% transparency for reference lines
    washedOff: {
      green: 'rgba(76, 175, 80, 0.5)', // Green with 50% transparency
      orange: 'rgba(255, 152, 0, 0.5)', // Orange with 50% transparency  
      warning: 'rgba(255, 87, 34, 0.5)', // Warning red-orange with 50% transparency
      danger: 'rgba(211, 47, 47, 0.5)', // Danger red with 50% transparency
    },

    // Functional colors
    functional: {
      link: '#007AFF',
      linkHover: '#5AC8FA',
      focus: '#007AFF',
      border: '#3A3A3C',
      borderLight: '#48484A',
      surface: '#1C1C1E',
      surfaceVariant: '#2C2C2E',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Status colors
    status: {
      online: '#34C759',
      offline: '#8E8E93',
      away: '#FF9500',
      busy: '#FF3B30',
    },

    // Alert colors with transparency
    alert: {
      success: {
        background: 'rgba(52, 199, 89, 0.15)',
        border: '#34C759',
        text: '#34C759',
      },
      warning: {
        background: 'rgba(255, 149, 0, 0.15)',
        border: '#FF9500',
        text: '#FF9500',
      },
      error: {
        background: 'rgba(255, 59, 48, 0.15)',
        border: '#FF3B30',
        text: '#FF3B30',
      },
      info: {
        background: 'rgba(90, 200, 250, 0.15)',
        border: '#5AC8FA',
        text: '#5AC8FA',
      },
    },

    // Gradient colors
    gradients: {
      primary: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
      success: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
      warning: 'linear-gradient(135deg, #FF9500 0%, #FFCC00 100%)',
      error: 'linear-gradient(135deg, #FF3B30 0%, #FF6482 100%)',
    },
  },

  // Legacy chartColors for backward compatibility - using new chart colors
  chartColors: [
    '#007AFF', // Apple blue
    '#34C759', // Apple green
    '#FF9500', // Apple orange
    '#FF3B30', // Apple red
    '#5856D6', // Apple purple
    '#AF52DE', // Apple magenta
    '#5AC8FA', // Apple light blue
    '#FFCC00', // Apple yellow
    '#FF6482', // Apple pink
    '#30D158', // Apple mint
    '#64D2FF', // Apple cyan
    '#BF5AF2', // Apple violet
    '#FF375F', // Apple crimson
    '#32D74B', // Apple lime
    '#FFD60A', // Apple gold
  ],

  typography: {
    fontFamily: [
      'Inter Variable',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Noto Sans"',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#FFFFFF',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#FFFFFF',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#FFFFFF',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      color: '#FFFFFF',
      marginBottom: '0.75rem !important',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      color: '#FFFFFF',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      lineHeight: 1.2,
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1.125rem',
      fontWeight: 300,
      lineHeight: 1.6,
      color: '#FFFFFF',
    },
    body2: {
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.6,
      color: '#D0D0D5',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1rem',
    },
    caption: {
      fontSize: '0.6875rem',
      fontWeight: 300,
      lineHeight: 1.4,
      color: '#D0D0D5',
    },
  },
  shape: {
    borderRadius: 8, // Apple-style border radius
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFeatureSettings: '"kern"',
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
          backgroundColor: '#34C759',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#30D158',
          },
        },
        outlined: {
          borderColor: '#3A3A3C',
          color: '#FFFFFF',
          '&:hover': {
            borderColor: '#8E8E93',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #3A3A3C',
          boxShadow: 'none',
          backgroundColor: '#1C1C1E',
          '&:hover': {
            borderColor: '#8E8E93',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
          backgroundColor: '#1C1C1E',
          border: '1px solid #3A3A3C',
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
          backgroundColor: '#2C2C2E',
          color: '#8E8E93',
          border: '1px solid #3A3A3C',
          height: 24, // Make chips more compact
        },
        outlined: {
          borderWidth: '1px',
          borderColor: '#3A3A3C',
          color: '#007AFF',
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
          backgroundColor: '#007AFF',
          border: '2px solid #007AFF',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 0 8px rgba(0, 122, 255, 0.16)',
          },
          '&:before': {
            display: 'none',
          },
        },
        track: {
          height: 4,
          borderRadius: 2,
          backgroundColor: '#007AFF',
        },
        rail: {
          height: 4,
          borderRadius: 2,
          backgroundColor: '#2C2C2E',
        },
        valueLabel: {
          backgroundColor: '#2C2C2E',
          borderRadius: 6,
          fontSize: '0.6875rem',
          fontWeight: 500,
          color: '#FFFFFF',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#3A3A3C',
            },
            '&:hover fieldset': {
              borderColor: '#8E8E93',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007AFF',
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#8E8E93',
            '&.Mui-focused': {
              color: '#007AFF',
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF',
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
          color: '#8E8E93',
          '&.Mui-selected': {
            color: '#007AFF',
            fontWeight: 700,
          },
          '&:hover': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #3A3A3C',
          backgroundColor: '#1C1C1E',
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
          maxWidth: '1200px !important', // Centered, not full width
        },
      },
    },
  },
});

export default theme;
