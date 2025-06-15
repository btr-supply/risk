import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigateWithLoading } from '../hooks/useRouterLoading';

// Smart Link component for internal navigation and anchors
export const SmartLink = ({ to, children, sx = {}, ...props }) => {
  const theme = useTheme();
  const navigateWithLoading = useNavigateWithLoading();

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
      navigateWithLoading(path);
      // Wait for navigation to complete, then scroll to anchor
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigateWithLoading(to);
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
