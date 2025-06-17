import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { COMMON_SX, SPACING } from '@constants';

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
      ...COMMON_SX.responsiveText.mono,
      fontWeight: 700,
      color: itemColor,
    };

    const labelStyle = {
      ...COMMON_SX.responsiveText.mono,
      fontWeight: 400,
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
        ...COMMON_SX.paperContainer,
        p: { xs: SPACING.xs, sm: SPACING.sm },
        mt: SPACING.sm,
        textAlign: 'center',
        overflowX: 'auto',
        overflowY: 'visible',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          ...COMMON_SX.responsiveText.mono,
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
              mr: SPACING.xs,
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
                  mx: SPACING.xs,
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
