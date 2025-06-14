import React from 'react';
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
// KaTeX removed - using native MathML instead
import { bpToPercent } from '../models.js';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import {
  BarChart,
  LineChart,
  PieChart,
  DoughnutChart,
  ChartsReferenceLine,
} from './ui/ChartComponents';
import { useSliderDebounce } from '../hooks/useDebounce';
import { getTitleIcon } from '../utils/componentUtils';
// No need for COLORS import anymore since we use theme directly

// Utility function to safely get chart colors
const getChartColors = (theme) => {
  return theme.colors?.chart || theme.chartColors || [];
};

// Server-side AsciiMath to MathML component
export const MathFormula = ({ children, inline = false }) => {
  if (!children) return null;

  let mathML = '';
  try {
    // Import asciimath2ml synchronously for server-side rendering
    const { asciiToMathML } = require('asciimath2ml');
    mathML = asciiToMathML(children, inline);
  } catch (error) {
    console.error('Error converting math:', error);
    mathML = `<span style="color: red;">Error: ${children}</span>`;
  }

  if (inline) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: mathML }}
        style={{ fontFamily: 'var(--font-stix-two-math), Times, serif' }}
      />
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        overflowX: 'auto',
        overflowY: 'visible',
        fontFamily: 'var(--font-stix-two-math), Times, serif',
        textAlign: 'center',
        '& math': {
          fontSize: '1.1em',
          display: 'block',
          margin: '0.5em 0',
        },
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: mathML }} />
    </Paper>
  );
};

// Section layout component with flexbox
export const Section = ({ title, children, sx = {}, id }) => (
  <Box sx={{ mb: 5, ...sx }} id={id}>
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
        pb: 1.5,
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

// Parameter control card
export const ParameterCard = ({ title, children, action }) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '1.25rem',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {getTitleIcon(title)}
          {title}
        </Typography>
        {action && <Box>{action}</Box>}
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
  allChildrenArray.forEach((child) => {
    if (React.isValidElement(child) && child.type === FormulaLegend) {
      legendElement = child;
    } else {
      descriptiveContent.push(child);
    }
  });

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {getTitleIcon(title)}
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Render descriptive paragraphs first */}
          {descriptiveContent}

          {/* Then the formula */}
          {formula && <MathFormula>{formula}</MathFormula>}

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
  marks = [],
  color = 'primary',
  logarithmic = false,
  debounceDelay = 150, // Configurable debounce delay
}) => {
  const theme = useTheme();

  // Use slider debounce hook for immediate visual feedback with debounced state updates
  const [displayValue, handleSliderChange] = useSliderDebounce(
    value,
    onChange,
    debounceDelay
  );

  // Get color from theme based on color prop
  const getSliderColor = () => {
    const chartColors = getChartColors(theme);

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
        return chartColors[1]; // Green from chart colors
      default:
        return theme.palette.primary.main;
    }
  };

  const sliderColor = getSliderColor();

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
    }),
  };

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
            ...(marks.length > 0 && { mb: 2.5 }), // Only add margin when marks are present
          }}
        >
          <Slider
            value={getSliderValue()}
            onChange={handleSliderChangeWrapper}
            min={getSliderMin()}
            max={getSliderMax()}
            step={logarithmic ? 0.1 : step}
            valueLabelDisplay="auto"
            valueLabelFormat={getValueLabelFormat}
            size="small"
            marks={marks}
            sx={{
              ...sliderSx,
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
            height: '20px', // Fixed height to match slider component height
          }}
        >
          <Chip
            label={`${formatValue(displayValue)}${unit}`}
            size="small"
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 600,
              fontSize: '0.875rem',
              width: '100%',
              height: { xs: '18px', sm: '20px' },
              '& .MuiChip-label': {
                px: { xs: 0.25, sm: 1 },
                py: { xs: 0, sm: 0.25 },
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
              },
              ...(color !== 'primary' && {
                borderColor: sliderColor,
                color: sliderColor,
                backgroundColor: `${sliderColor}15`,
              }),
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
  type = 'number',
}) => (
  <TextField
    label={label}
    value={value}
    onChange={(e) => {
      const newValue =
        type === 'number' ? Number(e.target.value) : e.target.value;
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
      },
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
  <Card
    elevation={0}
    sx={{
      height: '100%',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent
      sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '1.25rem',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {getTitleIcon(title)}
          {title}
        </Typography>
        {action && <Box>{action}</Box>}
      </Box>

      {controls && <Box sx={{ mb: 2.5 }}>{controls}</Box>}

      <Box
        sx={{
          width: '100%',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </CardContent>
  </Card>
);

// Chart container with consistent styling and proper sizing
export const ChartContainer = ({ children, height = '100%' }) => (
  <Box
    sx={{
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
      },
    }}
  >
    {children}
  </Box>
);

// Metric display chip
export const MetricChip = ({
  label,
  value,
  color = 'primary',
  formatValue = (v) => v,
}) => (
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

// Export formatters from utils instead of duplicating them
export {
  toDollarsAuto as formatCurrency,
  formatBasisPoints as formatBp,
  toFloatAuto as formatNumber,
} from '../utils/format';

// Formula Legend component
export const FormulaLegend = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mt: 1.5 }}>
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', display: 'block' }}
      >
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
export const SimulationResult = ({
  prefix,
  values,
  separator = ' | ',
  highlighted,
  colors,
}) => {
  const theme = useTheme();

  const formatDisplayValue = (item, index) => {
    const isHighlighted = highlighted && highlighted === item.key;
    const itemColor =
      colors && colors[item.key]
        ? colors[item.key]
        : isHighlighted
          ? theme.palette.primary.main
          : 'text.primary';

    const valueStyle = {
      fontFamily: 'monospace',
      fontWeight: 700,
      fontSize: { xs: '0.65rem', sm: '0.75rem' },
      color: itemColor,
    };

    const labelStyle = {
      fontFamily: 'monospace',
      fontWeight: 400,
      fontSize: { xs: '0.65rem', sm: '0.75rem' },
      color: 'text.secondary',
    };

    if (item.label) {
      return (
        <span key={index}>
          <Box component="span" sx={labelStyle}>
            {item.label}:{' '}
          </Box>
          <Box component="span" sx={valueStyle}>
            {item.value}
          </Box>
        </span>
      );
    } else {
      return (
        <Box key={index} component="span" sx={valueStyle}>
          {item.value}
        </Box>
      );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 0.75, sm: 1 },
        mt: 1,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        overflowX: 'auto',
        overflowY: 'visible',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          fontSize: { xs: '0.65rem', sm: '0.75rem' },
          lineHeight: 1.2,
          color: 'text.primary',
          whiteSpace: 'nowrap',
          minWidth: 'fit-content',
        }}
      >
        {prefix && (
          <Box
            component="span"
            sx={{
              fontWeight: 400,
              color: 'text.secondary',
              mr: 0.5,
            }}
          >
            {prefix}
          </Box>
        )}
        {values.map((item, index) => (
          <React.Fragment key={index}>
            {formatDisplayValue(item, index)}
            {index < values.length - 1 && (
              <Box
                component="span"
                sx={{
                  mx: 0.5,
                  color: 'text.secondary',
                  fontWeight: 400,
                }}
              >
                {separator}
              </Box>
            )}
          </React.Fragment>
        ))}
      </Typography>
    </Paper>
  );
};

// Smart Link component for internal navigation and anchors
export const SmartLink = ({ to, children, sx = {}, ...props }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();

    // Handle anchor links within the same page
    if (to.startsWith('#')) {
      const element = document.getElementById(to.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Handle navigation to other pages with optional anchors
    if (to.includes('#')) {
      const [path, anchor] = to.split('#');
      router.push(path);
      // Wait for navigation to complete, then scroll to anchor
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      router.push(to);
    }
  };

  const linkStyles = {
    color: theme.colors.functional.link,
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      color: theme.colors.functional.linkHover,
    },
    ...sx,
  };

  return (
    <Box component="span" onClick={handleClick} sx={linkStyles} {...props}>
      {children}
    </Box>
  );
};

// Export chart components
export { BarChart, LineChart, PieChart, DoughnutChart, ChartsReferenceLine };
