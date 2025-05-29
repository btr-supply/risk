import React, { useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Slider,
  TextField,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { bpToPercent } from '../models.js';
import { useTheme } from '@mui/material/styles';

// KaTeX component for rendering formulas
export const MathFormula = ({ formula }) => {
  const ref = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (formula && ref.current) {
      try {
        katex.render(formula, ref.current, {
          displayMode: true,
          throwOnError: true,
          errorColor: theme.colors.alert.error.text,
          strict: 'warn',
          trust: true,
          fleqn: false,
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        ref.current.innerHTML = `<div style="color: ${theme.colors.alert.error.text}; font-family: monospace; padding: 10px; border: 1px solid ${theme.colors.alert.error.border}; border-radius: 4px;">Formula rendering error: ${err.message}<br><br>Formula: ${formula}</div>`;
      }
    }
  }, [formula, theme]);

  if (!formula) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 2,
        backgroundColor: 'background.default',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        fontFamily: '',
        overflowX: 'auto',
        overflowY: 'visible',
        '& .katex-display': {
          margin: '0.5em 0',
          overflow: 'visible',
          whiteSpace: 'nowrap',
        }
      }}
    >
      <div ref={ref} />
    </Paper>
  );
};

// Section layout component with flexbox
export const Section = ({ title, children, sx = {} }) => (
  <Box sx={{ mb: 5, ...sx }}>
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        mb: 3,
        fontWeight: 700,
        fontStyle: 'italic',
        textTransform: 'uppercase',
        fontSize: '1.75rem',
        color: 'text.primary',
        pb: 1.5
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

// Parameter control card
export const ParameterCard = ({ title, children, action }) => (
  <Card elevation={0} sx={{
    height: '100%',
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '1.25rem',
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>
        {action && (
          <Box>
            {action}
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {children}
      </Box>
    </CardContent>
  </Card>
);

// Description card
export const DescriptionCard = ({ title, children, formula }) => {
  const allChildrenArray = React.Children.toArray(children);
  const descriptiveContent = [];
  let legendElement = null;

  // Separate legend from other children (descriptive paragraphs)
  allChildrenArray.forEach(child => {
    if (React.isValidElement(child) && child.type === FormulaLegend) {
      legendElement = child;
    } else {
      descriptiveContent.push(child);
    }
  });

  return (
    <Card elevation={0} sx={{
      height: '100%',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mb: 2.5,
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '1.25rem',
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Render descriptive paragraphs first */}
          {descriptiveContent}

          {/* Then the formula */}
          {formula && (
            <MathFormula formula={formula} />
          )}

          {/* Then the legend */}
          {legendElement}
        </Box>
      </CardContent>
    </Card>
  );
};

// Parameter slider with label and value display
export const ParameterSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue = (v) => v.toLocaleString(),
  helperText,
  unit = '',
  logarithmic = false,
  marks = [],
  color = 'primary'
}) => {
  const theme = useTheme();

  // Get color from theme based on color prop
  const getSliderColor = () => {
    switch (color) {
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'green':
        return theme.colors.chart[1]; // Green from chart colors
      default:
        return theme.palette.primary.main;
    }
  };

  const sliderColor = getSliderColor();

  // Handle logarithmic scaling
  const getSliderValue = () => {
    if (logarithmic) {
      return Math.log10(value);
    }
    return value;
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

  const handleSliderChange = (_, newValue) => {
    if (logarithmic) {
      const linearValue = Math.pow(10, newValue);
      onChange(Math.round(linearValue));
    } else {
      onChange(newValue);
    }
  };

  const getValueLabelFormat = (sliderVal) => {
    if (logarithmic) {
      const linearValue = Math.pow(10, sliderVal);
      return formatValue(Math.round(linearValue));
    }
    return formatValue(sliderVal);
  };

  // Create slider styles with dynamic color
  const sliderSx = {
    height: 4,
    '& .MuiSlider-thumb': {
      width: 16,
      height: 16,
      backgroundColor: sliderColor,
      border: `2px solid ${sliderColor}`,
      boxShadow: 'none',
      '&:hover': {
        boxShadow: `0 0 0 8px ${sliderColor}16`,
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-track': {
      height: 4,
      borderRadius: 2,
      backgroundColor: sliderColor,
    },
    '& .MuiSlider-rail': {
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.functional.surfaceVariant,
    },
    '& .MuiSlider-valueLabel': {
      backgroundColor: theme.colors.functional.surfaceVariant,
      borderRadius: 6,
      fontSize: '0.6875rem',
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    // Add mark styles only if marks are present
    ...(marks.length > 0 && {
      '& .MuiSlider-mark': {
        backgroundColor: theme.palette.text.secondary,
        height: 6,
        width: 1,
      },
      '& .MuiSlider-markLabel': {
        fontSize: '0.6875rem',
        fontFamily: 'monospace',
        color: theme.palette.text.secondary,
        top: '18px',
      },
    })
  };

  return (
    <Box>
      {label && (
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.125rem', color: 'text.primary', mb: 0.5 }}>
          {label}
        </Typography>
      )}
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.95rem', display: 'block', mb: 1 }}>
          {helperText}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          flex: 1,
          pr: 1,
          ...(marks.length > 0 && { mb: 2.5 }) // Only add margin when marks are present
        }}>
          <Slider
            value={getSliderValue()}
            onChange={handleSliderChange}
            min={getSliderMin()}
            max={getSliderMax()}
            step={logarithmic ? 0.1 : step}
            valueLabelDisplay="auto"
            valueLabelFormat={getValueLabelFormat}
            size="small"
            marks={marks}
            sx={sliderSx}
          />
        </Box>
        <Box sx={{ minWidth: '85px', flexShrink: 0, display: 'flex', alignItems: 'center', height: '32px' }}>
          <Chip
            label={`${formatValue(value)}${unit}`}
            size="small"
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 600,
              fontSize: '0.875rem',
              width: '100%',
              height: '24px',
              ...(color !== 'primary' && {
                borderColor: sliderColor,
                color: sliderColor,
                backgroundColor: `${sliderColor}15`
              })
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

// Parameter text field for precise input
export const ParameterTextField = ({
  label,
  value,
  onChange,
  min,
  max,
  helperText,
  unit = '',
  type = 'number'
}) => (
  <TextField
    label={label}
    value={value}
    onChange={(e) => {
      const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
      if (min !== undefined && newValue < min) return;
      if (max !== undefined && newValue > max) return;
      onChange(newValue);
    }}
    type={type}
    size="small"
    fullWidth
    helperText={helperText}
    InputProps={{
      endAdornment: unit && (
        <Typography variant="body2" color="text.secondary">
          {unit}
        </Typography>
      ),
    }}
    sx={{
      '& .MuiInputBase-root': {
        fontFamily: 'monospace',
        borderRadius: 1,
      }
    }}
  />
);

// Basis point display helper
export const BpDisplay = ({ value, decimals = 2 }) => (
  <span style={{ fontFamily: 'monospace' }}>
    {bpToPercent(value).toFixed(decimals)}%
  </span>
);

// Simulation control card for interactive charts
export const SimulationCard = ({ title, children, controls, action }) => (
  <Card elevation={0} sx={{
    height: '100%',
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '1.25rem',
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>
        {action && (
          <Box>
            {action}
          </Box>
        )}
      </Box>

      {controls && (
        <Box sx={{ mb: 2.5 }}>
          {controls}
        </Box>
      )}

      <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </Box>
    </CardContent>
  </Card>
);

// Chart container with consistent styling and proper sizing
export const ChartContainer = ({ children, height = '100%' }) => (
  <Box sx={{
    width: '100%',
    height,
    minHeight: '300px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0px',
    '& .MuiChartsAxis-root': {
      '& .MuiChartsAxis-tick': {
        fontSize: '0.6875rem',
        fill: 'text.secondary',
      },
      '& .MuiChartsAxis-label': {
        fontSize: '0.75rem',
        fontWeight: 500,
        fill: 'text.primary',
      },
    },
    '& .MuiChartsLegend-root': {
      '& .MuiChartsLegend-label': {
        fontSize: '0.75rem',
        fill: 'text.primary',
      },
    },
    '& > div': {
      width: '100% !important',
      height: '100% !important',
    },
    '& svg': {
      width: '100%',
      height: '100%',
    }
  }}>
    {children}
  </Box>
);

// Metric display chip
export const MetricChip = ({ label, value, color = 'primary', formatValue = (v) => v }) => (
  <Chip
    label={`${label}: ${formatValue(value)}`}
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

// Format number as currency
export const formatCurrency = (value, decimals = 0) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(decimals)}`;
};

// Format basis points as percentage
export const formatBp = (bp, decimals = 2) => `${bpToPercent(bp).toFixed(decimals)}%`;

// Format number with appropriate suffixes
export const formatNumber = (value, decimals = 0) => {
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(decimals);
};

// Formula Legend component
export const FormulaLegend = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mt: 1.5 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        Where:
      </Typography>
      {items.map((item, index) => (
        <Typography
          key={index}
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            pl: 2,
            lineHeight: 1.2,
            mb: 0,
          }}
          dangerouslySetInnerHTML={{ __html: `${item.symbol} = ${item.text}` }}
        />
      ))}
    </Box>
  );
};

// Consistent simulation result display
export const SimulationResult = ({ prefix, values, separator = ' | ', highlighted }) => {
  const theme = useTheme();

  const formatDisplayValue = (item, index) => {
    const isHighlighted = highlighted && highlighted === item.key;
    const valueStyle = {
      fontFamily: 'monospace',
      fontWeight: 700,
      fontSize: { xs: '0.7rem', sm: '0.8rem' },
      color: isHighlighted ? theme.palette.primary.main : 'text.primary'
    };

    const labelStyle = {
      fontFamily: 'monospace',
      fontWeight: 400,
      fontSize: { xs: '0.7rem', sm: '0.8rem' },
      color: 'text.secondary'
    };

    if (item.label) {
      return (
        <span key={index}>
          <Box component="span" sx={labelStyle}>{item.label}: </Box>
          <Box component="span" sx={valueStyle}>{item.value}</Box>
        </span>
      );
    } else {
      return <Box key={index} component="span" sx={valueStyle}>{item.value}</Box>;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 1.25 },
        mt: 1,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        textAlign: 'center'
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          fontSize: { xs: '0.7rem', sm: '0.8rem' },
          lineHeight: 1.2,
          color: 'text.primary',
          whiteSpace: 'nowrap'
        }}
      >
        {prefix && (
          <Box component="span" sx={{
            fontWeight: 400,
            color: 'text.secondary',
            mr: 0.5
          }}>
            {prefix}
          </Box>
        )}
        {values.map((item, index) => (
          <React.Fragment key={index}>
            {formatDisplayValue(item, index)}
            {index < values.length - 1 && (
              <Box component="span" sx={{
                mx: 0.5,
                color: 'text.secondary',
                fontWeight: 400
              }}>
                {separator}
              </Box>
            )}
          </React.Fragment>
        ))}
      </Typography>
    </Paper>
  );
};


