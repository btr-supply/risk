import React, { memo, useMemo } from 'react';
import { CardContent, Typography, Slider, Box, Chip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import GamepadIcon from '@mui/icons-material/Gamepad';
import { useTheme } from '@mui/material/styles';
import { BaseCard, CardTitle } from '../ui';
import { MathFormula } from '../index';

// Memoized helper function for icons
const getTitleIcon = memo((title) => {
  switch (title) {
    case 'Methodology':
      return <SchoolIcon sx={{ mr: 1, fontSize: '1.25rem' }} />;
    case 'Parameters':
      return <SettingsIcon sx={{ mr: 1, fontSize: '1.25rem' }} />;
    case 'Simulation':
      return <GamepadIcon sx={{ mr: 1, fontSize: '1.25rem' }} />;
    default:
      return null;
  }
});
getTitleIcon.displayName = 'GetTitleIcon';

// Optimized ParameterCard with memoization
export const OptimizedParameterCard = memo(({ title, children, action }) => {
  const titleIcon = useMemo(() => getTitleIcon(title), [title]);

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
  const titleIcon = useMemo(() => getTitleIcon(title), [title]);

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
          {formula && <MathFormula formula={formula} />}
          {legendElement}
        </Box>
      </CardContent>
    </BaseCard>
  );
});

// Optimized MetricChip with memoization
export const OptimizedMetricChip = memo(
  ({ label, value, color = 'primary', formatValue = (v) => v }) => {
    const formattedValue = useMemo(
      () => formatValue(value),
      [value, formatValue]
    );

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

// Optimized ParameterSlider with memoization and reduced re-renders
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
  }) => {
    const theme = useTheme();

    const sliderStyles = useMemo(
      () => ({
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
      }),
      [theme, color]
    );

    const formattedValue = useMemo(
      () => formatValue(value),
      [value, formatValue]
    );

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
          value={value}
          onChange={(_, newValue) => onChange(newValue)}
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
              display: 'block',
              mt: 1,
              color: 'text.secondary',
              lineHeight: 1.3,
              fontSize: '0.75rem',
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
