import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { useLoadingStore } from '../store/useLoadingStore';

// BTR Logo Animation - reveals white text from left to right with skewed clipping to match italic text
const fillAnimation = keyframes`
  0% {
    clip-path: polygon(0% 0%, 15% 0%, 0% 100%, -15% 100%);
  }
  100% {
    clip-path: polygon(0% 0%, 115% 0%, 100% 100%, -15% 100%);
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
        animation: `${fillAnimation} 2.5s cubic-bezier(0, .5, 0.5, 1)`,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      BTR
    </Typography>
  </Box>
);

// Minimal Page Loader that preserves header visibility
export const PageLoader = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '80px', // Leave space for header
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
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
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default PageLoader;
