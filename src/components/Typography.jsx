import React from 'react';
import { Typography, Box } from '@mui/material';
import { SPACING } from '../constants';

// Section title with consistent styling
export const SectionTitle = ({ children, sx = {}, ...props }) => (
  <Typography
    variant="h4"
    gutterBottom
    sx={{
      mb: SPACING.section.titleMargin,
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      fontSize: '1.75rem',
      color: 'text.primary',
      pb: SPACING.md,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

// Card title with icon support
export const CardTitle = ({ children, icon, sx = {}, ...props }) => (
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
      ...sx,
    }}
    {...props}
  >
    {icon && <Box sx={{ mr: SPACING.sm }}>{icon}</Box>}
    {children}
  </Typography>
);

// Page title for main pages
export const PageTitle = ({ children, sx = {}, ...props }) => (
  <Typography
    variant="h2"
    sx={{
      fontWeight: 700,
      fontStyle: 'italic',
      textTransform: 'uppercase',
      fontSize: '2.5rem',
      color: 'text.primary',
      mb: SPACING.xxxl,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

// Wrapped MUI Typography with consistent theme
export const MuiTypography = Typography;
