import React, { memo, useMemo } from 'react';
import { CardContent, Typography, Slider, Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BaseCard, CardTitle } from '../ui';
import { MathFormula } from '../index';
import { useSliderDebounce } from '../../hooks/useDebounce';
import { getTitleIcon } from '../../utils/componentUtils';

// Theme factory for slider styles - moved outside component for better performance
const createSliderStyles = (theme, color) => ({
  color:
    color === 'primary'
      ? theme.palette.primary.main
      : color === 'secondary'
        ? theme.palette.secondary.main
        : color,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    height: 8,
  },
  '& .MuiSlider-rail': {
    height: 8,
    opacity: 0.3,
    backgroundColor: theme.palette.grey[600],
  },
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: 'currentColor',
    border: '2px solid currentColor',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 42,
    height: 42,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: 'currentColor',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
  '& .MuiSlider-mark': {
    backgroundColor: theme.palette.grey[500],
    height: 12,
    width: 2,
    '&.MuiSlider-markActive': {
      backgroundColor: 'currentColor',
    },
  },
  '& .MuiSlider-markLabel': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
});

// Optimized ParameterCard with memoization
export const OptimizedParameterCard = memo(({ title, children, action }) => {
  // Direct call to getTitleIcon - no useMemo needed for simple function calls
  const titleIcon = getTitleIcon(title);

  return (
    <BaseCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
          }}
        >
          <CardTitle icon={titleIcon}>{title}</CardTitle>
          {action && <Box>{action}</Box>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {children}
        </Box>
      </CardContent>
    </BaseCard>
  );
});

// Optimized DescriptionCard with memoization
export const OptimizedDescriptionCard = memo(({ title, children, formula }) => {
  // Direct call to getTitleIcon
  const titleIcon = getTitleIcon(title);

  const { descriptiveContent, legendElement } = useMemo(() => {
    const allChildrenArray = React.Children.toArray(children);
    const descriptiveContent = [];
    let legendElement = null;

    allChildrenArray.forEach((child) => {
      if (
        React.isValidElement(child) &&
        child.type?.displayName === 'FormulaLegend'
      ) {
        legendElement = child;
      } else {
        descriptiveContent.push(child);
      }
    });

    return { descriptiveContent, legendElement };
  }, [children]);

  return (
    <BaseCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <CardTitle icon={titleIcon}>{title}</CardTitle>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {descriptiveContent}
          {formula && <MathFormula>{formula}</MathFormula>}
          {legendElement}
        </Box>
      </CardContent>
    </BaseCard>
  );
});

// Optimized MetricChip with memoization
export const OptimizedMetricChip = memo(
  ({ label, value, color = 'primary', formatValue }) => {
    // Only memoize if formatValue is a function, otherwise format directly
    const formattedValue = formatValue ? formatValue(value) : value;

    return (
      <Chip
        label={`${label}: ${formattedValue}`}
        color={color}
        variant="outlined"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 600,
          '& .MuiChip-label': {
            fontSize: '0.875rem',
          },
        }}
      />
    );
  }
);

// Optimized ParameterSlider with immediate visual feedback and debounced state updates
export const OptimizedParameterSlider = memo(
  ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    formatValue = (v) => v.toLocaleString(),
    helperText,
    unit = '',
    marks = [],
    color = 'primary',
    debounceDelay = 150, // Configurable debounce delay
  }) => {
    const theme = useTheme();

    // Use slider debounce hook for immediate visual feedback with debounced state updates
    const [displayValue, handleSliderChange] = useSliderDebounce(
      value,
      onChange,
      debounceDelay
    );

    // Use theme factory instead of complex useMemo
    const sliderStyles = createSliderStyles(theme, color);

    // Simple format call - no memoization needed for basic formatting
    const formattedValue = formatValue(displayValue);

    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              fontSize: '0.875rem',
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '0.875rem',
            }}
          >
            {formattedValue}
            {unit}
          </Typography>
        </Box>

        <Slider
          value={displayValue}
          onChange={(_, newValue) => handleSliderChange(newValue)}
          min={min}
          max={max}
          step={step}
          marks={marks}
          valueLabelDisplay="auto"
          valueLabelFormat={(sliderVal) => `${formatValue(sliderVal)}${unit}`}
          sx={sliderStyles}
        />

        {helperText && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              mt: 0.5,
              display: 'block',
            }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }
);

// Set display names for debugging
OptimizedParameterCard.displayName = 'OptimizedParameterCard';
OptimizedDescriptionCard.displayName = 'OptimizedDescriptionCard';
OptimizedMetricChip.displayName = 'OptimizedMetricChip';
OptimizedParameterSlider.displayName = 'OptimizedParameterSlider';
