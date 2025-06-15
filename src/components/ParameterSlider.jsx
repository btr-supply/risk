import React, { memo } from 'react';
import { Box, Typography, Slider, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useStateDebounce } from '../hooks/useDebounce';

// Color system using existing MUI theme palette
const getSliderColorScheme = (theme, color) => {
  const paletteColor = theme.palette[color] || theme.palette.primary;

  return {
    main: paletteColor.main,
    light: paletteColor.light,
    washed: `${paletteColor.main}15`, // 15% opacity for background
  };
};

// Create comprehensive slider styles with proper tooltip styling
const createSliderStyles = (
  theme,
  colorScheme,
  readOnly = false,
  hideThumb = false
) => ({
  color: colorScheme.main,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    height: 8,
    backgroundColor: colorScheme.main,
  },
  '& .MuiSlider-rail': {
    height: 8,
    opacity: 0.3,
    backgroundColor: theme.colors.grey600,
  },
  '& .MuiSlider-thumb': {
    height: readOnly || hideThumb ? 0 : 20,
    width: readOnly || hideThumb ? 0 : 20,
    backgroundColor: colorScheme.main,
    border: `2px solid ${colorScheme.main}`,
    boxShadow:
      readOnly || hideThumb ? 'none' : `0 2px 8px ${colorScheme.main}25`,
    ...(readOnly || hideThumb ? { display: 'none' } : {}),
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow:
        readOnly || hideThumb
          ? 'none'
          : `0 0 0 8px ${colorScheme.main}16, 0 3px 12px ${colorScheme.main}35`,
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '6px 8px',
    backgroundColor: theme.palette.background.paper, // Same as Chart.js tooltips
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.grey[700]}`, // Same as Chart.js tooltips
    borderRadius: 0.7, // Same as Chart.js tooltips
    boxShadow: 'none',
    '&::before': {
      display: 'none',
    },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translateY(-100%) scale(1)',
    },
  },
  '& .MuiSlider-mark': {
    backgroundColor: theme.colors.grey500,
    height: 12,
    width: 2,
    '&.MuiSlider-markActive': {
      backgroundColor: colorScheme.main,
    },
  },
  '& .MuiSlider-markLabel': {
    fontSize: '0.75rem',
    color: theme.colors.grey300,
  },
});

// Create chip styles that match the slider color
const createChipStyles = (colorScheme) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  fontSize: '0.875rem',
  borderColor: colorScheme.main,
  color: colorScheme.main,
  backgroundColor: colorScheme.washed,
  '&:hover': {
    backgroundColor: colorScheme.washed,
    borderColor: colorScheme.light,
  },
});

// Optimized Parameter Slider with consistent styling and proper color theming
export const ParameterSlider = memo(
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
    color = 'primary', // 'primary', 'secondary', 'success', 'warning', 'error' - uses theme.palette colors
    logarithmic = false,
    debounceDelay = 150,
    variant = 'default', // 'default', 'compact', 'inline'
    readOnly = false, // Makes slider read-only (no thumb, no interaction)
    hideThumb = false, // Hides thumb but keeps interaction
  }) => {
    const theme = useTheme();

    // Use slider debounce hook for immediate visual feedback with debounced state updates
    const [displayValue, handleSliderChange] = useStateDebounce(
      value,
      onChange,
      debounceDelay
    );

    // Get color scheme for consistent theming
    const colorScheme = getSliderColorScheme(theme, color);
    const sliderStyles = createSliderStyles(
      theme,
      colorScheme,
      readOnly,
      hideThumb
    );
    const chipStyles = createChipStyles(colorScheme);

    // Handle logarithmic scaling
    const getSliderValue = () => {
      if (logarithmic) {
        return Math.log10(displayValue);
      }
      return displayValue;
    };

    const getSliderMin = () => {
      if (logarithmic) {
        return Math.log10(min);
      }
      return min;
    };

    const getSliderMax = () => {
      if (logarithmic) {
        return Math.log10(max);
      }
      return max;
    };

    const handleSliderChangeWrapper = (_, newValue) => {
      if (logarithmic) {
        const linearValue = Math.pow(10, newValue);
        handleSliderChange(Math.round(linearValue));
      } else {
        handleSliderChange(newValue);
      }
    };

    const getValueLabelFormat = (sliderVal) => {
      if (logarithmic) {
        const linearValue = Math.pow(10, sliderVal);
        return formatValue(Math.round(linearValue));
      }
      return formatValue(sliderVal);
    };

    // Format current value
    const formattedValue = formatValue(displayValue);

    // Compact variant for use inside tables or tight spaces
    if (variant === 'compact') {
      return (
        <Box sx={{ width: '100%' }}>
          <Slider
            value={getSliderValue()}
            onChange={readOnly ? undefined : handleSliderChangeWrapper}
            min={getSliderMin()}
            max={getSliderMax()}
            step={logarithmic ? 0.1 : step}
            marks={marks}
            valueLabelDisplay={readOnly ? 'off' : 'auto'}
            valueLabelFormat={getValueLabelFormat}
            disabled={readOnly}
            sx={sliderStyles}
          />
        </Box>
      );
    }

    // Inline variant with value display next to slider
    if (variant === 'inline') {
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
            value={getSliderValue()}
            onChange={readOnly ? undefined : handleSliderChangeWrapper}
            min={getSliderMin()}
            max={getSliderMax()}
            step={logarithmic ? 0.1 : step}
            marks={marks}
            valueLabelDisplay={readOnly ? 'off' : 'auto'}
            valueLabelFormat={getValueLabelFormat}
            disabled={readOnly}
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

    // Default variant with full styling
    return (
      <Box>
        {label && (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: '1.125rem',
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
        )}
        {helperText && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.95rem', display: 'block', mb: 1 }}
          >
            {helperText}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              flex: 1,
              pr: 1,
              display: 'flex',
              alignItems: 'center',
              ...(marks.length > 0 && { mb: 2.5 }),
            }}
          >
            <Slider
              value={getSliderValue()}
              onChange={readOnly ? undefined : handleSliderChangeWrapper}
              min={getSliderMin()}
              max={getSliderMax()}
              step={logarithmic ? 0.1 : step}
              valueLabelDisplay={readOnly ? 'off' : 'auto'}
              valueLabelFormat={getValueLabelFormat}
              marks={marks}
              disabled={readOnly}
              sx={{
                ...sliderStyles,
                width: '100%',
              }}
            />
          </Box>
          <Box
            sx={{
              minWidth: { xs: '65px', sm: '85px' },
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '20px',
            }}
          >
            <Chip
              label={`${formattedValue}${unit}`}
              size="small"
              variant="outlined"
              sx={{
                ...chipStyles,
                width: '100%',
                height: { xs: '18px', sm: '20px' },
                '& .MuiChip-label': {
                  px: { xs: 0.25, sm: 1 },
                  py: { xs: 0, sm: 0.25 },
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }
);

ParameterSlider.displayName = 'ParameterSlider';
