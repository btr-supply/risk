import React, { useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Tabs,
  Tab,
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Map paths to tab indices
  const pathToTab = useMemo(
    () => ({
      '/': -1, // Homepage has no active tab
      '/allocation': 0,
      '/liquidity': 1,
      '/slippage': 2,
    }),
    []
  );

  const tabToPaths = useMemo(
    () => ['/allocation', '/liquidity', '/slippage'],
    []
  );
  const activeTab =
    pathToTab[pathname] !== undefined ? pathToTab[pathname] : -1;

  const handleTabChange = useCallback(
    (event, newValue) => {
      // Use router.push for immediate navigation
      router.push(tabToPaths[newValue]);
      if (anchorEl) {
        setAnchorEl(null);
      }
    },
    [router, tabToPaths, anchorEl]
  );

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMobileTabSelect = useCallback(
    (tabIndex) => {
      router.push(tabToPaths[tabIndex]);
      setAnchorEl(null);
    },
    [router, tabToPaths]
  );

  const handleHomeNavigation = useCallback(() => {
    router.push('/');
    handleMenuClose();
  }, [router, handleMenuClose]);

  if (isMobile) {
    return (
      <>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{
            mr: 1,
            p: 1,
          }}
        >
          <MenuIcon sx={{ fontSize: '2rem' }} />
        </IconButton>

        {/* Full Screen Mobile Navigation Overlay */}
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
          {/* Close button */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1,
            }}
          >
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

          {/* Navigation Items */}
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
            <Typography
              variant="h2"
              onClick={handleHomeNavigation}
              sx={{
                fontWeight: 700,
                fontSize: '3rem',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                color: 'text.primary',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Home
            </Typography>

            <Typography
              variant="h2"
              onClick={() => handleMobileTabSelect(0)}
              sx={{
                fontWeight: 700,
                fontSize: '3rem',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                color: 'text.primary',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Allocation
            </Typography>

            <Typography
              variant="h2"
              onClick={() => handleMobileTabSelect(1)}
              sx={{
                fontWeight: 700,
                fontSize: '3rem',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                color: 'text.primary',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Liquidity
            </Typography>

            <Typography
              variant="h2"
              onClick={() => handleMobileTabSelect(2)}
              sx={{
                fontWeight: 700,
                fontSize: '3rem',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                color: 'text.primary',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Slippage
            </Typography>
          </Box>

          {/* Social Links at Bottom */}
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
    /* Desktop Navigation */
    <Tabs
      value={activeTab === -1 ? false : activeTab}
      onChange={handleTabChange}
      textColor="inherit"
      TabIndicatorProps={{
        sx: {
          display: 'none',
        },
      }}
      sx={{
        '& .MuiTab-root': {
          textTransform: 'uppercase',
          fontSize: '1.3rem',
          fontWeight: 700,
          minWidth: 'auto',
          px: 2,
          m: 0,
          letterSpacing: '0.02em',
          '&.Mui-selected': {
            color: 'primary.main',
          },
        },
      }}
    >
      <Tab label="Allocation" />
      <Tab label="Liquidity" />
      <Tab label="Slippage" />
    </Tabs>
  );
};
