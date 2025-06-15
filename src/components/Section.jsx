import React from 'react';
import { Box } from '@mui/material';
import { SectionTitle } from './Typography';
import { SPACING } from '../constants';

// Section layout component with flexbox - uses centralized spacing and title
export const Section = ({ title, children, sx = {}, id }) => (
  <Box sx={{ mb: SPACING.section.margin, ...sx }} id={id}>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </Box>
);
