import React, { Suspense, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Toolbar,
  Typography,
  Container,
  Card,
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { theme } from './constants';
import Footer from './components/Footer';
import { Navigation } from './components/Navigation';
import { RouteLoadingOverlay } from './components/Loader';

// BTR Logo component
const BTRLogo = ({ onClick }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mr: { xs: 1, sm: 3 },
      cursor: 'pointer',
      '&:hover': { opacity: 0.8 },
    }}
    onClick={onClick}
  >
    <Typography
      variant="h6"
      component="div"
      sx={{
        ml: 2.5,
        fontWeight: 800,
        fontSize: { xs: '2rem', sm: '2.9rem' },
        fontStyle: 'italic',
        color: 'text.primary',
      }}
    >
      BTR
    </Typography>
    <Typography
      variant="h6"
      component="div"
      sx={{
        ml: 1,
        fontWeight: 400,
        fontSize: { xs: '2rem', sm: '2.9rem' },
        fontStyle: 'italic',
        color: 'text.tertiary',
      }}
    >
      RISK
    </Typography>
  </Box>
);

function AppContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    // Force document height recalculation
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
  }, [pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        // Ensure each page calculates its own height
        height: 'auto',
        // Reset scroll context for each page
        position: 'relative',
        overflow: 'auto',
      }}
      key={pathname} // Force re-render on route change
    >
      {/* Header with Paper styling to match other sections */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          py: 1,
        }}
      >
        <Container maxWidth="lg">
          <Card
            elevation={0}
            sx={{
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6) !important',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Toolbar
              sx={{
                minHeight: '56px !important',
                px: 3,
                borderBottom: 0,
              }}
            >
              <BTRLogo onClick={() => router.push('/')} />
              <Box sx={{ flexGrow: 1 }} />
              <Navigation />
            </Toolbar>
          </Card>
        </Container>
      </Box>

      {/* Main Content - positioned with padding for fixed header */}
      <Container
        maxWidth="lg"
        sx={{
          pt: 12, // Top padding for fixed header
          pb: 4, // Normal bottom padding
          flexGrow: 1,
          position: 'relative',
          minHeight: '50vh',
          // Ensure content area adapts to page size
          height: 'auto',
          // Clear any inherited height constraints
          maxHeight: 'none',
        }}
      >
        <Suspense fallback={<RouteLoadingOverlay />}>
          <Box
            key={`content-${pathname}`}
            sx={{
              height: 'auto',
              minHeight: 'auto',
              // Ensure content doesn't inherit fixed heights
              flex: 'none',
            }}
          >
            {children}
          </Box>
        </Suspense>
      </Container>

      {/* Footer - normal positioning at bottom of content */}
      <Footer />
    </Box>
  );
}

function App({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  );
}

export default App;
