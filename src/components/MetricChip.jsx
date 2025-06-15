import React, { memo } from 'react';
import { Chip } from '@mui/material';

// Optimized Metric Chip with memoization
export const MetricChip = memo(
  ({ label, value, color = 'primary', formatValue = (v) => v }) => {
    // Only memoize if formatValue is a function, otherwise format directly
    const formattedValue = formatValue(value);

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

MetricChip.displayName = 'MetricChip';
