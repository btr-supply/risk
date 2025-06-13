import React, { memo } from 'react';
import { Box } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';

// Memoized chart container with consistent styling
export const MemoizedChartContainer = memo(
  ({ children, height = '100%', sx = {} }) => (
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
        ...sx,
      }}
    >
      {children}
    </Box>
  )
);

// Memoized chart components with default styling
export const MemoizedBarChart = memo(({ colors, ...props }) => (
  <BarChart
    colors={colors}
    margin={{ top: 20, bottom: 60, left: 80, right: 20 }}
    {...props}
  />
));

export const MemoizedLineChart = memo(({ colors, ...props }) => (
  <LineChart
    colors={colors}
    margin={{ top: 20, bottom: 60, left: 80, right: 20 }}
    {...props}
  />
));

export const MemoizedPieChart = memo(({ colors, ...props }) => (
  <PieChart
    colors={colors}
    margin={{ top: 20, bottom: 60, left: 20, right: 20 }}
    {...props}
  />
));

MemoizedChartContainer.displayName = 'MemoizedChartContainer';
MemoizedBarChart.displayName = 'MemoizedBarChart';
MemoizedLineChart.displayName = 'MemoizedLineChart';
MemoizedPieChart.displayName = 'MemoizedPieChart';
