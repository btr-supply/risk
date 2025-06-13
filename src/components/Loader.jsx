import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

// BTR Logo Animation - reveals white text from left to right with skewed clipping to match italic text
const fillAnimation = keyframes`
  0% {
    clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
  }
  100% {
    clip-path: polygon(0% 0%, 100% 0%, 85% 100%, -15% 100%);
  }
`;

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

const BTRLoadingLogo = ({ size = '4rem' }) => (
  <Box
    sx={{
      position: 'relative',
      display: 'inline-block',
      overflow: 'visible',
      px: 6, // Increased padding for italic text overflow
      py: 3,
    }}
  >
    {/* Background BTR text (grey) */}
    <Typography
      sx={{
        fontWeight: 800,
        fontSize: size,
        fontStyle: 'italic',
        color: 'text.secondary',
        position: 'relative',
        zIndex: 1,
        animation: `${pulseAnimation} 5s ease-out infinite`,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      BTR
    </Typography>

    {/* Foreground BTR text (white) with skewed animated reveal to match italic slant */}
    <Typography
      sx={{
        fontWeight: 800,
        fontSize: size,
        fontStyle: 'italic',
        color: 'text.primary',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        animation: `${fillAnimation} 3s cubic-bezier(0.23, 1, 0.32, 1) infinite`,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      BTR
    </Typography>
  </Box>
);

// Minimal loading component that can be used in content area
const LoadingFallback = ({ message = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      width: '100%',
      backgroundColor: 'transparent', // Ensure no white background
      px: 3, // Extra padding for container
      py: 0,
    }}
  >
    <BTRLoadingLogo size="6rem" />

    {message && (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          fontSize: '0.875rem',
          opacity: 0.7,
        }}
      >
        {message}
      </Typography>
    )}
  </Box>
);

// Content area overlay loader - covers only the main content container
export const ContentAreaLoader = ({ message = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      width: '100%',
      gap: 0,
      backgroundColor: 'background.default',
      borderRadius: 1,
      position: 'relative',
      zIndex: 1,
      px: 5, // Increased horizontal padding to prevent clipping
      py: 8, // Increased vertical padding for better spacing
    }}
  >
    <BTRLoadingLogo size="7rem" />

    <Typography
      variant="body1"
      sx={{
        color: 'text.secondary',
        fontWeight: 500,
        textAlign: 'center',
        fontSize: '1.1rem',
        maxWidth: '400px',
      }}
    >
      {message}
    </Typography>
  </Box>
);

// Fade in animation for the route loading overlay
const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

// Instant route loading overlay - appears immediately on navigation
// Positioned fixed to viewport to ensure it's always visible
export const RouteLoadingOverlay = ({ message = 'Loading...' }) => {
  const [showLoader, setShowLoader] = React.useState(false);

  // Prevent body scroll when overlay is shown
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    // Small delay to avoid flashing for very fast navigation
    const showTimer = setTimeout(() => {
      setShowLoader(true);
    }, 100);

    // Fix body height to current viewport height and prevent scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    return () => {
      clearTimeout(showTimer);
      // Restore original body styling when component unmounts
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  if (!showLoader) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000, // High z-index to ensure it's above everything
        animation: `${fadeInAnimation} 0.2s ease-out`,
      }}
    >
      {/* Header space - matches the fixed header height */}
      <Box
        sx={{
          height: '88px', // Match the header height (56px + 2*16px padding)
          flexShrink: 0,
        }}
      />

      {/* Main loader content - takes remaining space */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          px: 5,
          py: 8,
        }}
      >
        <BTRLoadingLogo size="7rem" />

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            textAlign: 'center',
            fontSize: '1.1rem',
            maxWidth: '400px',
          }}
        >
          {message}
        </Typography>
      </Box>

      {/* Footer space - matches the footer height */}
      <Box
        sx={{
          height: '88px', // Match the footer height (56px + 2*16px padding)
          flexShrink: 0,
        }}
      />
    </Box>
  );
};

export default LoadingFallback;
