import React, { memo, useRef } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Chart.js plugin for reference lines
const referenceLinePlugin = {
  id: 'referenceLine',
  afterDraw: (chart, args, options) => {
    if (!options.lines || options.lines.length === 0) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    options.lines.forEach((line) => {
      const { x, y, label, lineStyle = {}, labelStyle = {} } = line;

      ctx.save();

      // Set line style
      ctx.strokeStyle = lineStyle.stroke || '#000';
      ctx.lineWidth = lineStyle.strokeWidth || 1;
      if (lineStyle.strokeDasharray) {
        const dashArray = lineStyle.strokeDasharray.split(' ').map(Number);
        ctx.setLineDash(dashArray);
      }

      ctx.beginPath();

      if (x !== undefined) {
        // Vertical line
        const xScale = chart.scales.x;
        let xPixel;
        if (xScale.type === 'category') {
          const index = xScale.getLabels().indexOf(x);
          xPixel = xScale.getPixelForValue(index);
        } else {
          xPixel = xScale.getPixelForValue(x);
        }
        ctx.moveTo(xPixel, chartArea.top);
        ctx.lineTo(xPixel, chartArea.bottom);

        // Draw label
        if (label) {
          ctx.fillStyle = labelStyle.fill || '#000';
          ctx.font = `${labelStyle.fontSize || '12px'} Arial`;
          ctx.fillText(label, xPixel + 5, chartArea.top + 20);
        }
      }

      if (y !== undefined) {
        // Horizontal line
        const yScale = chart.scales.y;
        const yPixel = yScale.getPixelForValue(y);
        ctx.moveTo(chartArea.left, yPixel);
        ctx.lineTo(chartArea.right, yPixel);

        // Draw label
        if (label) {
          ctx.fillStyle = labelStyle.fill || '#000';
          ctx.font = `${labelStyle.fontSize || '12px'} Arial`;
          ctx.fillText(label, chartArea.left + 5, yPixel - 5);
        }
      }

      ctx.stroke();
      ctx.restore();
    });
  },
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  referenceLinePlugin
);

// Utility function to get theme-appropriate colors
const getThemeColors = (theme) => ({
  text: {
    primary: theme.palette.text.primary, // #FFFFFF (white)
    secondary: theme.palette.text.secondary, // grey300 (#C7C7CC) - updated for better visibility
  },
  grid: theme.palette.grey[700], // grey400 (#AEAEB2) - lighter for better visibility
  background: theme.palette.background.paper,
  border: theme.palette.grey[700], // Consistent border color for tooltips and elements
});

// Enhanced default Chart.js options factory with proper theming
const createDefaultOptions = (type, themeColors, customOptions = {}) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 200,
    },
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
    plugins: {
      legend: {
        display: false, // Disabled by default, can be overridden
        labels: {
          color: themeColors.text.secondary,
          font: {
            family: 'var(--font-inter), Inter',
            size: 12,
          },
          usePointStyle: true, // Use point style instead of squares
          pointStyle: 'circle', // Use circle style for legend
          boxWidth: 6, // Small legend indicators
          boxHeight: 6, // Small legend indicators
          padding: 6, // Add padding between bullets and text
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: themeColors.background,
        titleColor: themeColors.text.primary,
        bodyColor: themeColors.text.secondary,
        borderColor: themeColors.border, // Consistent border color with MuiTooltip
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        usePointStyle: true, // Use point style instead of squares
        boxWidth: 6, // Small tooltip indicators
        boxHeight: 6, // Small tooltip indicators
        boxPadding: 6, // Add padding between bullets and text
        multiKeyBackground: 'transparent', // Remove white background behind color indicators
        mode: 'index',
        intersect: false,
      },
    },
    scales: {},
  };

  // Configure scales based on chart type
  if (['line', 'bar', 'scatter', 'bubble'].includes(type)) {
    // X-axis configuration
    baseOptions.scales.x = {
      grid: {
        display: true,
        color: themeColors.grid, // Chart.js specific grid color
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        color: themeColors.text.secondary, // Chart.js specific tick color
        font: {
          family: 'var(--font-inter), Inter',
          size: 11,
        },
      },
      title: {
        display: false,
        color: themeColors.text.secondary, // Chart.js specific title color
        font: {
          family: 'var(--font-inter), Inter',
          size: 12,
          weight: 500,
        },
      },
    };

    // Y-axis configuration
    baseOptions.scales.y = {
      grid: {
        display: true,
        color: themeColors.grid, // Chart.js specific grid color
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        color: themeColors.text.secondary, // Chart.js specific tick color
        font: {
          family: 'var(--font-inter), Inter',
          size: 11,
        },
      },
      title: {
        display: false,
        color: themeColors.text.secondary, // Chart.js specific title color
        font: {
          family: 'var(--font-inter), Inter',
          size: 12,
          weight: 500,
        },
      },
    };
  }

  // Chart type specific configurations
  if (type === 'bar') {
    // For vertical bars: horizontal grid lines (Y-axis) and vertical grid lines (X-axis)
    baseOptions.scales.x.grid.display = true;
    baseOptions.scales.y.grid.display = true;

    // Remove borders from bar elements by default
    baseOptions.elements = {
      bar: {
        borderRadius: 4, // Rounded bars
        borderWidth: 0, // No border/outline
        borderSkipped: false,
      },
    };
  }

  if (type === 'line') {
    // For line charts: both X and Y grid lines visible
    baseOptions.scales.x.grid.display = true;
    baseOptions.scales.y.grid.display = true;
    // Prevent tilted x-axis labels by default for line charts
    baseOptions.scales.x.ticks.maxRotation = 0;
    baseOptions.scales.x.ticks.minRotation = 0;
    baseOptions.elements = {
      line: {
        tension: 0.1,
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
        borderWidth: 0,
      },
    };
  }

  if (type === 'doughnut' || type === 'pie') {
    // For doughnut/pie charts: no axis scales needed
    delete baseOptions.scales;

    // Configure doughnut-specific options
    if (type === 'doughnut') {
      baseOptions.cutout = '60%'; // Default cutout for doughnut
      baseOptions.spacing = 8; // Default spacing between slices
    }

    // Configure elements for rounded slices and spacing
    baseOptions.elements = {
      arc: {
        borderRadius: 6, // Rounded corners for slices
        borderWidth: 0, // No border by default
        borderColor: 'transparent',
      },
    };

    // Enable legend for pie/doughnut charts
    baseOptions.plugins.legend.display = true;
    baseOptions.plugins.legend.position = 'right';

    // Update layout padding for pie/doughnut
    baseOptions.layout.padding = 20;
  }

  return mergeDeep(baseOptions, customOptions);
};

// Deep merge utility function
const mergeDeep = (target, source) => {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Memoized chart container with consistent styling
export const ChartContainer = memo(({ children, height = '100%', sx = {} }) => (
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
      '& > div': {
        width: '100% !important',
        height: '100% !important',
      },
      '& canvas': {
        width: '100% !important',
        height: '100% !important',
      },
      ...sx,
    }}
  >
    {children}
  </Box>
));

// Pure Chart.js Bar Chart component with proper theming
export const BarChart = memo(
  ({ data, options = {}, height = 400, referenceLines = [], ...props }) => {
    const chartRef = useRef(null);
    const theme = useTheme();
    const themeColors = getThemeColors(theme);

    const defaultOptions = createDefaultOptions('bar', themeColors);

    // Add reference lines to plugin options
    const optionsWithReferences = {
      ...options,
      plugins: {
        ...options.plugins,
        referenceLine: {
          lines: referenceLines,
        },
      },
    };

    // Deep merge custom options with default options
    const finalOptions = mergeDeep(defaultOptions, optionsWithReferences);

    return (
      <ChartContainer height={height} {...props}>
        <Bar
          ref={chartRef}
          data={data}
          options={finalOptions}
          plugins={[referenceLinePlugin]}
        />
      </ChartContainer>
    );
  }
);

// Pure Chart.js Line Chart component with proper theming
export const LineChart = memo(
  ({ data, options = {}, height = 400, referenceLines = [], ...props }) => {
    const chartRef = useRef(null);
    const theme = useTheme();
    const themeColors = getThemeColors(theme);

    const defaultOptions = createDefaultOptions('line', themeColors);

    // Add reference lines to plugin options
    const optionsWithReferences = {
      ...options,
      plugins: {
        ...options.plugins,
        referenceLine: {
          lines: referenceLines,
        },
      },
    };

    // Deep merge custom options with default options
    const finalOptions = mergeDeep(defaultOptions, optionsWithReferences);

    return (
      <ChartContainer height={height} {...props}>
        <Line
          ref={chartRef}
          data={data}
          options={finalOptions}
          plugins={[referenceLinePlugin]}
        />
      </ChartContainer>
    );
  }
);

// Pure Chart.js Pie Chart component with proper theming
export const PieChart = memo(
  ({ data, options = {}, height = 400, referenceLines = [], ...props }) => {
    const chartRef = useRef(null);
    const theme = useTheme();
    const themeColors = getThemeColors(theme);

    const defaultOptions = createDefaultOptions('pie', themeColors);

    // Add reference lines to plugin options
    const optionsWithReferences = {
      ...options,
      plugins: {
        ...options.plugins,
        referenceLine: {
          lines: referenceLines,
        },
      },
    };

    // Deep merge custom options with default options
    const finalOptions = mergeDeep(defaultOptions, optionsWithReferences);

    return (
      <ChartContainer height={height} {...props}>
        <Pie
          ref={chartRef}
          data={data}
          options={finalOptions}
          plugins={[referenceLinePlugin]}
        />
      </ChartContainer>
    );
  }
);

// Pure Chart.js Doughnut Chart component with proper theming and enhanced spacing
export const DoughnutChart = memo(
  ({
    data,
    options = {},
    height = 400,
    cutout = '60%',
    spacing = 8, // Increased default gap between slices
    borderWidth = 0, // Default to no border
    borderColor = 'transparent', // Transparent border fallback
    referenceLines = [],
    ...props
  }) => {
    const chartRef = useRef(null);
    const theme = useTheme();
    const themeColors = getThemeColors(theme);

    const defaultOptions = createDefaultOptions('doughnut', themeColors);

    // Override doughnut-specific options
    const doughnutOptions = {
      cutout: cutout,
      spacing: spacing,
      elements: {
        arc: {
          borderRadius: 6, // Rounded corners for slices
          borderWidth: borderWidth,
          borderColor: borderColor,
        },
      },
    };

    // Add reference lines to plugin options
    const optionsWithReferences = {
      ...options,
      plugins: {
        ...options.plugins,
        referenceLine: {
          lines: referenceLines,
        },
      },
    };

    // Deep merge custom options with default options
    const finalOptions = mergeDeep(
      mergeDeep(defaultOptions, doughnutOptions),
      optionsWithReferences
    );

    return (
      <ChartContainer height={height} {...props}>
        <Doughnut
          ref={chartRef}
          data={data}
          options={finalOptions}
          plugins={[referenceLinePlugin]}
        />
      </ChartContainer>
    );
  }
);

// Helper component for reference lines (processed by LineChart)
export const ChartsReferenceLine = () => {
  // This component returns null - it's processed by the LineChart component
  return null;
};

// Display names for debugging
ChartContainer.displayName = 'ChartContainer';
BarChart.displayName = 'BarChart';
LineChart.displayName = 'LineChart';
PieChart.displayName = 'PieChart';
DoughnutChart.displayName = 'DoughnutChart';
ChartsReferenceLine.displayName = 'ChartsReferenceLine';
