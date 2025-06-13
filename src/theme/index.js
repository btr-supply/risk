// ===== BTR RISK - COMPREHENSIVE THEME UTILITIES =====
// Single source of truth for all theme-related functionality

import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  LAYOUT,
  TYPOGRAPHY,
  COLORS,
  CHARTS,
  FORM,
  PERFORMANCE,
  ANIMATION,
} from '../constants';
import {
  toChrono,
  formatBasisPoints,
  formatAllocation,
  formatWeight,
  formatChartValue,
  memoizedCurrencyFormatter,
  memoizedPercentFormatter,
  memoizedFloatFormatter,
} from '../utils/format.js';

// ===== THEME COLOR HOOKS =====

// Enhanced cached theme selectors with constants integration
export const useThemeColors = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      background: {
        paper: theme.palette.background.paper,
        default: theme.palette.background.default,
        formula: theme.palette.background.formula,
      },
      text: {
        primary: theme.palette.text.primary,
        secondary: theme.palette.text.secondary,
        tertiary: theme.palette.text.tertiary,
      },
      chart: theme.colors?.chart || theme.chartColors || COLORS.CHART,
      divider: theme.palette.divider,
      border: theme.palette.divider,
      functional: theme.colors?.functional || COLORS.FUNCTIONAL,
      sentiment: COLORS.SENTIMENT,
    }),
    [theme]
  );
};

// Cached chart colors with performance optimization
export const useChartColors = () => {
  const theme = useTheme();

  return useMemo(
    () => theme.colors?.chart || theme.chartColors || COLORS.CHART,
    [theme]
  );
};

// ===== STYLE FACTORY HOOKS =====

// Layout Style Factories
export const useLayoutStyles = () => {
  return useMemo(
    () => ({
      container: {
        maxWidth: LAYOUT.MAX_WIDTH,
        mx: 'auto',
        px: LAYOUT.CONTAINER_PADDING,
      },

      section: {
        mb: LAYOUT.SECTION_SPACING,
        '& + &': {
          mt: LAYOUT.SECTION_SPACING + 1,
        },
      },

      cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: LAYOUT.CARD_SPACING,
        '@media (max-width: 480px)': {
          gridTemplateColumns: '1fr',
        },
      },

      twoColumnGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: LAYOUT.CARD_SPACING,
      },

      flexRow: {
        display: 'flex',
        alignItems: 'center',
        gap: LAYOUT.FIELD_SPACING,
      },

      flexColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: LAYOUT.FIELD_SPACING,
      },
    }),
    []
  );
};

// Card Style Factories
export const useCardStyles = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      base: {
        borderRadius: LAYOUT.BORDER_RADIUS.BASE,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      },

      elevated: {
        borderRadius: LAYOUT.BORDER_RADIUS.BASE,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        boxShadow: COLORS.SHADOWS.MEDIUM,
        '&:hover': {
          boxShadow: COLORS.SHADOWS.HEAVY,
          borderColor: theme.palette.primary.main,
          transition: ANIMATION.TRANSITIONS.DEFAULT,
        },
      },

      fullHeight: {
        borderRadius: LAYOUT.BORDER_RADIUS.BASE,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },

      interactive: {
        borderRadius: LAYOUT.BORDER_RADIUS.BASE,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: ANIMATION.TRANSITIONS.FAST,
        '&:hover': {
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-2px)',
          boxShadow: COLORS.SHADOWS.MEDIUM,
        },
      },
    }),
    [theme]
  );
};

// Typography Style Factories
export const useTypographyStyles = () => {
  return useMemo(
    () => ({
      heading: {
        fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
        fontStyle: 'italic',
        textTransform: 'uppercase',
        color: 'text.primary',
        lineHeight: TYPOGRAPHY.LINE_HEIGHTS.TIGHT,
      },

      subheading: {
        fontWeight: TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
        fontStyle: 'italic',
        textTransform: 'uppercase',
        color: 'text.primary',
        fontSize: TYPOGRAPHY.FONT_SIZES.HEADING_MEDIUM,
        lineHeight: TYPOGRAPHY.LINE_HEIGHTS.TIGHT,
      },

      body: {
        fontWeight: TYPOGRAPHY.FONT_WEIGHTS.LIGHT,
        lineHeight: TYPOGRAPHY.LINE_HEIGHTS.RELAXED,
        color: 'text.primary',
      },

      caption: {
        fontSize: TYPOGRAPHY.FONT_SIZES.CAPTION,
        fontWeight: TYPOGRAPHY.FONT_WEIGHTS.LIGHT,
        lineHeight: TYPOGRAPHY.LINE_HEIGHTS.NORMAL,
        color: 'text.secondary',
      },

      monospace: {
        fontFamily: 'monospace',
        fontWeight: TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
        fontSize: TYPOGRAPHY.FONT_SIZES.BODY,
      },
    }),
    []
  );
};

// Form Style Factories
export const useFormStyles = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      container: {
        display: 'flex',
        flexDirection: 'column',
        gap: LAYOUT.FIELD_SPACING,
      },

      field: {
        mb: LAYOUT.FIELD_SPACING,
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
          fontSize: TYPOGRAPHY.FONT_SIZES.BODY,
          fontWeight: TYPOGRAPHY.FONT_WEIGHTS.MEDIUM,
        },
        '& .MuiInputBase-root': {
          borderRadius: LAYOUT.BORDER_RADIUS.BASE,
        },
      },

      slider: {
        mb: LAYOUT.FIELD_SPACING + 0.5,
        px: 1,
        '& .MuiSlider-markLabel': {
          fontSize: TYPOGRAPHY.FONT_SIZES.CAPTION,
          fontFamily: 'monospace',
          color: theme.palette.text.secondary,
        },
      },

      helperText: {
        fontSize: TYPOGRAPHY.FONT_SIZES.CAPTION,
        color: theme.palette.text.secondary,
        mt: 0.5,
        lineHeight: TYPOGRAPHY.LINE_HEIGHTS.NORMAL,
      },
    }),
    [theme]
  );
};

// Chart Style Factories
export const useChartStyles = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      container: (height = CHARTS.DEFAULT_HEIGHT) => ({
        width: '100%',
        height,
        minHeight: height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& > div': {
          width: '100% !important',
          height: '100% !important',
        },
        '& svg': {
          width: '100%',
          height: '100%',
        },
      }),

      axis: {
        '& .MuiChartsAxis-root': {
          '& .MuiChartsAxis-tick': {
            fontSize: CHARTS.AXIS.FONT_SIZE,
            fill: theme.palette.text.secondary,
          },
          '& .MuiChartsAxis-label': {
            fontSize: TYPOGRAPHY.FONT_SIZES.CAPTION,
            fontWeight: TYPOGRAPHY.FONT_WEIGHTS.MEDIUM,
            fill: theme.palette.text.primary,
          },
        },
      },

      legend: {
        '& .MuiChartsLegend-root': {
          '& .MuiChartsLegend-label': {
            fontSize: CHARTS.LEGEND.FONT_SIZE,
            fill: theme.palette.text.primary,
          },
        },
      },
    }),
    [theme]
  );
};

// Slider Style Factories
export const useSliderStyles = () => {
  const theme = useTheme();

  return useMemo(
    () => ({
      primary: {
        color: theme.palette.primary.main,
        height: FORM.SLIDER.HEIGHT,
        '& .MuiSlider-thumb': {
          height: FORM.SLIDER.THUMB_SIZE,
          width: FORM.SLIDER.THUMB_SIZE,
          backgroundColor: theme.palette.primary.main,
          border: '2px solid currentColor',
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: `0 0 0 8px ${theme.palette.primary.main}33`,
          },
        },
        '& .MuiSlider-track': {
          border: 'none',
          borderRadius: FORM.SLIDER.TRACK_RADIUS,
        },
        '& .MuiSlider-rail': {
          borderRadius: FORM.SLIDER.TRACK_RADIUS,
          opacity: 0.3,
        },
        '& .MuiSlider-mark': {
          backgroundColor: theme.palette.text.secondary,
          height: FORM.SLIDER.MARK_SIZE,
          width: 2,
          '&.MuiSlider-markActive': {
            backgroundColor: theme.palette.primary.main,
          },
        },
      },

      secondary: {
        color: theme.palette.secondary.main,
        height: FORM.SLIDER.HEIGHT,
        '& .MuiSlider-thumb': {
          height: FORM.SLIDER.THUMB_SIZE,
          width: FORM.SLIDER.THUMB_SIZE,
          backgroundColor: theme.palette.secondary.main,
          border: '2px solid currentColor',
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: `0 0 0 8px ${theme.palette.secondary.main}33`,
          },
        },
        '& .MuiSlider-track': {
          border: 'none',
          borderRadius: FORM.SLIDER.TRACK_RADIUS,
        },
        '& .MuiSlider-rail': {
          borderRadius: FORM.SLIDER.TRACK_RADIUS,
          opacity: 0.3,
        },
        '& .MuiSlider-mark': {
          backgroundColor: theme.palette.text.secondary,
          height: FORM.SLIDER.MARK_SIZE,
          width: 2,
          '&.MuiSlider-markActive': {
            backgroundColor: theme.palette.secondary.main,
          },
        },
      },
    }),
    [theme]
  );
};

// ===== FORMATTER HOOKS =====

// Using existing BTR formatting utilities with memoization
export const useFormatters = () => {
  return useMemo(
    () => ({
      // Use existing toDollarsAuto for optimal currency formatting
      currency: memoizedCurrencyFormatter,

      // Use existing toPercent for percentage formatting
      percentage: memoizedPercentFormatter,

      // Use existing formatBasisPoints for basis points
      basisPoints: formatBasisPoints,

      // Use existing toFloatAuto for number formatting
      number: memoizedFloatFormatter,

      // Use existing toChrono for duration formatting
      duration: toChrono,

      // BTR-specific formatters
      allocation: formatAllocation,
      weight: formatWeight,
      chartValue: formatChartValue,
    }),
    []
  );
};

// ===== UNIFIED STYLE FACTORY HOOK =====

// Comprehensive style factory hook for all styling needs
export const useStyleFactories = () => {
  const theme = useTheme();
  const layoutStyles = useLayoutStyles();
  const formStyles = useFormStyles();
  const chartStyles = useChartStyles();
  const sliderStyles = useSliderStyles();

  return useMemo(
    () => ({
      // Layout factories
      layout: layoutStyles,

      // Card factories
      card: (variant = 'base', customSx = {}) => {
        const variants = {
          base: {
            borderRadius: LAYOUT.BORDER_RADIUS.BASE,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden',
          },
          elevated: {
            borderRadius: LAYOUT.BORDER_RADIUS.BASE,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden',
            boxShadow: COLORS.SHADOWS.MEDIUM,
            '&:hover': {
              boxShadow: COLORS.SHADOWS.HEAVY,
              borderColor: theme.palette.primary.main,
              transition: ANIMATION.TRANSITIONS.DEFAULT,
            },
          },
          fullHeight: {
            borderRadius: LAYOUT.BORDER_RADIUS.BASE,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
        };

        return { ...variants[variant], ...customSx };
      },

      // Typography factories
      typography: (typographyVariant = 'body', customSx = {}) => {
        const variants = {
          heading: {
            fontWeight: TYPOGRAPHY.FONT_WEIGHTS.BOLD,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            color: 'text.primary',
            lineHeight: TYPOGRAPHY.LINE_HEIGHTS.TIGHT,
          },
          body: {
            fontWeight: TYPOGRAPHY.FONT_WEIGHTS.LIGHT,
            lineHeight: TYPOGRAPHY.LINE_HEIGHTS.RELAXED,
            color: 'text.primary',
          },
          caption: {
            fontSize: TYPOGRAPHY.FONT_SIZES.CAPTION,
            fontWeight: TYPOGRAPHY.FONT_WEIGHTS.LIGHT,
            lineHeight: TYPOGRAPHY.LINE_HEIGHTS.NORMAL,
            color: 'text.secondary',
          },
          monospace: {
            fontFamily: 'monospace',
            fontWeight: TYPOGRAPHY.FONT_WEIGHTS.SEMIBOLD,
            fontSize: TYPOGRAPHY.FONT_SIZES.BODY,
          },
        };

        return { ...variants[typographyVariant], ...customSx };
      },

      // Form factories
      form: formStyles,

      // Chart factories
      chart: chartStyles,

      // Slider factories
      slider: (color = 'primary') => sliderStyles[color],

      // Animation factories
      animation: {
        fade: (duration = ANIMATION.DURATION.NORMAL) => ({
          transition: `opacity ${duration} ${ANIMATION.EASING.EASE_IN_OUT}`,
        }),

        slide: (duration = ANIMATION.DURATION.NORMAL) => ({
          transition: `transform ${duration} ${ANIMATION.EASING.EASE_OUT}`,
        }),

        scale: (duration = ANIMATION.DURATION.NORMAL) => ({
          transition: `transform ${duration} ${ANIMATION.EASING.BOUNCE}`,
        }),
      },

      // Responsive factories
      responsive: {
        mobile: (styles) => ({
          [`@media (max-width: ${LAYOUT.BREAKPOINTS.SM}px)`]: styles,
        }),

        tablet: (styles) => ({
          [`@media (min-width: ${LAYOUT.BREAKPOINTS.SM}px) and (max-width: ${LAYOUT.BREAKPOINTS.MD}px)`]:
            styles,
        }),

        desktop: (styles) => ({
          [`@media (min-width: ${LAYOUT.BREAKPOINTS.MD}px)`]: styles,
        }),
      },

      // Hover and focus factories
      hover: (baseStyles, hoverStyles) => ({
        ...baseStyles,
        '&:hover': {
          ...hoverStyles,
          transition: ANIMATION.TRANSITIONS.FAST,
        },
      }),

      focus: (baseStyles, focusStyles) => ({
        ...baseStyles,
        '&:focus, &:focus-visible': {
          ...focusStyles,
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }),
    }),
    [theme, layoutStyles, formStyles, chartStyles, sliderStyles]
  );
};

// ===== PERFORMANCE UTILITIES =====

// Performance utility for reducing re-renders in sliders
export const throttleSliderChange = (
  callback,
  delay = PERFORMANCE.THROTTLE_DELAY
) => {
  let timeoutId;
  return (value) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(value), delay);
  };
};

// Debounced input handler
export const debounceInputChange = (
  callback,
  delay = PERFORMANCE.DEBOUNCE_DELAY
) => {
  let timeoutId;
  return (value) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(value), delay);
  };
};

// ===== LEGACY COMPATIBILITY =====

// Legacy exports for backward compatibility during migration
export const createCardSx = (theme, customSx = {}) => ({
  borderRadius: LAYOUT.BORDER_RADIUS.BASE,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  overflow: 'hidden',
  ...customSx,
});

export const createChartSx = (theme, height = CHARTS.DEFAULT_HEIGHT) => ({
  width: '100%',
  height,
  minHeight: height,
  '& .MuiChartsAxis-root': {
    '& .MuiChartsAxis-tick': {
      fontSize: CHARTS.AXIS.FONT_SIZE,
      fill: theme.palette.text.secondary,
    },
  },
});
