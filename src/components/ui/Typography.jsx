import React from 'react';
import { Typography as MuiTypography } from '@mui/material';

// Base heading styles shared across components
const baseHeadingStyles = {
  fontWeight: 700,
  fontStyle: 'italic',
  textTransform: 'uppercase',
  color: 'text.primary',
};

export const SectionTitle = ({ children, sx = {}, ...props }) => (
  <MuiTypography
    variant="h4"
    gutterBottom
    sx={{
      ...baseHeadingStyles,
      mb: 3,
      fontSize: '1.75rem',
      pb: 1.5,
      ...sx,
    }}
    {...props}
  >
    {children}
  </MuiTypography>
);

export const CardTitle = ({ children, sx = {}, icon, ...props }) => (
  <MuiTypography
    variant="h5"
    sx={{
      ...baseHeadingStyles,
      mb: 2.5,
      fontSize: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      ...sx,
    }}
    {...props}
  >
    {icon && React.cloneElement(icon, { sx: { mr: 1, fontSize: '1.25rem' } })}
    {children}
  </MuiTypography>
);

export const PageTitle = ({ children, sx = {}, ...props }) => (
  <MuiTypography
    variant="h1"
    sx={{
      ...baseHeadingStyles,
      fontSize: { xs: '2rem', sm: '2.9rem' },
      ...sx,
    }}
    {...props}
  >
    {children}
  </MuiTypography>
);

// Re-export MUI Typography for cases where custom variants aren't needed
export { Typography as MuiTypography } from '@mui/material';
