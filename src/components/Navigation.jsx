import React, { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  IconButton,
  Dialog,
  Slide,
  Box,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { SocialLinks } from './Footer';
import { useNavigateWithLoading } from '../hooks/useRouterLoading';

// Navigation data
const NAVIGATION_LINKS = [
  { label: 'Allocation', path: '/allocation' },
  { label: 'Liquidity', path: '/liquidity' },
  { label: 'Slippage', path: '/slippage' },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Utility function to check if a path is active
const isActivePath = (pathname, targetPath) => {
  return pathname === targetPath;
};

// Reusable NavLink component
const NavLink = ({
  label,
  path,
  onClick,
  isMobile = false,
  isActive = false,
}) => (
  <Typography
    variant={isMobile ? 'h2' : 'body1'}
    onClick={() => onClick(path)}
    sx={{
      fontWeight: 700,
      fontSize: isMobile ? '3rem' : '1.3rem',
      fontStyle: 'italic',
      textTransform: 'uppercase',
      letterSpacing: isMobile ? 'normal' : '0.02em',
      color: isActive ? '#FFFFFF' : '#636366', // Pure white for active, darker grey for inactive
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      px: isMobile ? 0 : 2,
      py: isMobile ? 0 : 1,
      '&:hover': {
        color: 'primary.main',
      },
    }}
  >
    {label}
  </Typography>
);

export const Navigation = () => {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigateWithLoading = useNavigateWithLoading();

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMobileNavigation = useCallback(
    (path) => {
      navigateWithLoading(path);
      setAnchorEl(null);
    },
    [navigateWithLoading]
  );

  const handleDesktopNavigation = useCallback(
    (path) => {
      navigateWithLoading(path);
    },
    [navigateWithLoading]
  );

  const handleHomeNavigation = useCallback(() => {
    navigateWithLoading('/');
    handleMenuClose();
  }, [navigateWithLoading, handleMenuClose]);

  if (isMobile) {
    return (
      <>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{ mr: 1, p: 1 }}
        >
          <MenuIcon sx={{ fontSize: '2rem' }} />
        </IconButton>

        <Dialog
          fullScreen
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Transition}
          sx={{
            '& .MuiDialog-paper': {
              bgcolor: 'background.default',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
            <IconButton
              onClick={handleMenuClose}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                p: 1,
                '&:hover': {
                  bgcolor: 'background.paper',
                  borderColor: 'primary.main',
                },
              }}
            >
              <CloseIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
              px: 4,
            }}
          >
            <NavLink
              label="Home"
              path="/"
              onClick={handleHomeNavigation}
              isMobile={true}
              isActive={isActivePath(pathname, '/')}
            />

            {NAVIGATION_LINKS.map((link) => (
              <NavLink
                key={link.path}
                label={link.label}
                path={link.path}
                onClick={handleMobileNavigation}
                isMobile={true}
                isActive={isActivePath(pathname, link.path)}
              />
            ))}
          </Box>

          <Box
            sx={{
              pb: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SocialLinks orientation="horizontal" size="xlarge" spacing={2} />
          </Box>
        </Dialog>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
      {NAVIGATION_LINKS.map((link) => (
        <NavLink
          key={link.path}
          label={link.label}
          path={link.path}
          onClick={handleDesktopNavigation}
          isMobile={false}
          isActive={isActivePath(pathname, link.path)}
        />
      ))}
    </Box>
  );
};
