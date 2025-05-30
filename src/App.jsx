import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Card,
  Dialog,
  Slide
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import theme from './theme';
import { RiskModelProvider } from './state';
import Footer, { SocialLinks } from './components/Footer';

// Import pages
import HomePage from './pages/HomePage';
import AllocationModel from './pages/AllocationModel';
import LiquidityModel from './pages/LiquidityModel';
import SlippageModel from './pages/SlippageModel';

// BTR Logo component
const BTRLogo = ({ onClick }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mr: { xs: 1, sm: 3 },
      cursor: 'pointer',
      '&:hover': { opacity: 0.8 }
    }}
    onClick={onClick}
  >
    <Typography variant="h6" component="div" sx={{
      ml: 2.5,
      fontWeight: 800,
      fontSize: { xs: '2rem', sm: '2.9rem' },
      fontStyle: 'italic',
      color: 'text.primary'
    }}>
      BTR
    </Typography>
    <Typography variant="h6" component="div" sx={{
      ml: 1,
      fontWeight: 400,
      fontSize: { xs: '2rem', sm: '2.9rem' },
      fontStyle: 'italic',
      color: 'text.tertiary'
    }}>
      RISK
    </Typography>
  </Box>
);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Map paths to tab indices
  const pathToTab = {
    '/': -1, // Homepage has no active tab
    '/allocation': 0,
    '/liquidity': 1,
    '/slippage': 2
  };

  const tabToPaths = ['/allocation', '/liquidity', '/slippage'];
  const activeTab = pathToTab[location.pathname] !== undefined ? pathToTab[location.pathname] : -1;

  const handleTabChange = (event, newValue) => {
    navigate(tabToPaths[newValue]);
    if (anchorEl) {
      setAnchorEl(null);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileTabSelect = (tabIndex) => {
    navigate(tabToPaths[tabIndex]);
    setAnchorEl(null);
  };

  const tabLabels = ['Allocation', 'Liquidity', 'Slippage'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header with Paper styling to match other sections */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          py: 1
        }}
      >
        <Card elevation={0} sx={{
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <Toolbar sx={{
            minHeight: '56px !important',
            px: 3,
            borderBottom: 0
          }}>
            <BTRLogo onClick={() => navigate('/')} />
            <Box sx={{ flexGrow: 1 }} />

            {/* Mobile Navigation */}
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                  sx={{
                    mr: 1,
                    p: 1
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
                    }
                  }}
                >
                  {/* Close button */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    zIndex: 1 
                  }}>
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
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <CloseIcon sx={{ fontSize: '2rem' }} />
                    </IconButton>
                  </Box>

                  {/* Navigation Items */}
                  <Box sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 4,
                    px: 4
                  }}>
                    <Typography
                      variant="h2"
                      onClick={() => {
                        navigate('/');
                        handleMenuClose();
                      }}
                      sx={{
                        fontWeight: 700,
                        fontSize: '3rem',
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        color: 'text.primary',
                        cursor: 'pointer',
                        transition: 'color 0.3s ease',
                        '&:hover': {
                          color: 'primary.main'
                        }
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
                          color: 'primary.main'
                        }
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
                          color: 'primary.main'
                        }
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
                          color: 'primary.main'
                        }
                      }}
                    >
                      Slippage
                    </Typography>
                  </Box>

                  {/* Social Links at Bottom */}
                  <Box sx={{ 
                    pb: 6,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <SocialLinks 
                      orientation="horizontal"
                      size="xlarge"
                      spacing={2}
                    />
                  </Box>
                </Dialog>
              </>
            ) : (
              /* Desktop Navigation */
              <Tabs
                value={activeTab >= 0 ? activeTab : false}
                onChange={handleTabChange}
                textColor="inherit"
                TabIndicatorProps={{
                  sx: {
                    display: 'none'
                  }
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
                      color: 'primary.main'
                    }
                  }
                }}
              >
                <Tab label="Allocation" />
                <Tab label="Liquidity" />
                <Tab label="Slippage" />
              </Tabs>
            )}
          </Toolbar>
        </Card>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/allocation" element={<AllocationModel />} />
          <Route path="/liquidity" element={<LiquidityModel />} />
          <Route path="/slippage" element={<SlippageModel />} />
        </Routes>
      </Container>

      <Footer />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RiskModelProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </RiskModelProvider>
    </ThemeProvider>
  );
}

export default App;
