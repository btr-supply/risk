import React from 'react';
import { Box, Typography } from '@mui/material';
import { SPACING } from '@constants';

export const FormulaLegend = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box
      sx={{
        mt: SPACING.lg,
        p: SPACING.lg,
        borderRadius: SPACING.borderRadius,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          mb: SPACING.sm,
          display: 'block',
        }}
      >
        Where
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: SPACING.xs }}>
        {items.map((item, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              lineHeight: 1.3,
            }}
            dangerouslySetInnerHTML={{
              __html: `${item.symbol} = ${item.text}`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

FormulaLegend.displayName = 'FormulaLegend';
