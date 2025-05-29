import React, { useState } from 'react';
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
  Card
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import theme from './theme';
import { RiskModelProvider } from './state';
import Footer from './components/Footer';

// Import pages
import AllocationModel from './pages/AllocationModel';
import LiquidityModel from './pages/LiquidityModel';
import SlippageModel from './pages/SlippageModel';

// BTR Logo component
const BTRLogo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 3 } }}>
    {/* <svg width="64" height="64" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="m14.947 166.918 12.956-77.759H61.74q8.916 0 14.594 2.392 5.715 2.393 8.078 6.759 2.4 4.367 1.41 10.289a19.05 19.05 0 0 1-3.277 7.784q-2.477 3.493-6.287 5.923-3.773 2.391-8.421 3.303l-.153.759q5.03.153 8.764 2.506 3.735 2.316 5.488 6.455 1.752 4.1.838 9.568-1.067 6.378-5.22 11.352-4.154 4.974-10.784 7.822t-15.09 2.847zm24.082-16.858h9.908q5.258 0 8.268-2.012 3.05-2.012 3.62-5.885.458-2.733-.457-4.632t-3.086-2.886-5.45-.987H41.62zm4.878-29.463h8.688q2.743 0 5.03-.873 2.286-.873 3.772-2.544 1.486-1.67 1.867-4.025.572-3.645-1.753-5.543-2.286-1.899-6.173-1.898h-8.993zm50.641-14.428 2.896-17.01h67.827l-2.896 17.01h-23.472l-10.06 60.749h-20.882l10.06-60.749zM30.246 79.245h213.106L247 60H33.895zM9 196h213.106l3.648-19.245H12.648z"/>
      <path fill="currentColor" fillRule="evenodd" d="m160.289 166.918 12.956-77.759h33.685q8.688 0 14.67 3.152 5.982 3.151 8.612 9.074t1.257 14.2q-1.371 8.353-6.058 14.087-4.34 5.316-10.907 8.251l11.021 28.995H202.51l-9.427-25.666h-7.304l-4.303 25.666zm42.221-42.98q-2.82.912-6.555.912h-7.425l3.158-18.833h7.468q3.659 0 6.135 1.025 2.477.988 3.544 3.114 1.067 2.088.533 5.429-.532 3.342-2.286 5.392-1.753 2.012-4.572 2.961" clipRule="evenodd"/>
    </svg> */}
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

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`risk-model-tabpanel-${index}`}
      aria-labelledby={`risk-model-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)'); // More explicit breakpoint

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (anchorEl) {
      setAnchorEl(null); // Close mobile menu if open
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileTabSelect = (tabIndex) => {
    setActiveTab(tabIndex);
    setAnchorEl(null); // Close the menu
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
            <BTRLogo />
            <Box sx={{ flexGrow: 1 }} />

            {/* Mobile Navigation */}
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200
                    }
                  }}
                >
                  <MenuItem onClick={() => handleMobileTabSelect(0)}>
                    Allocation
                  </MenuItem>
                  <MenuItem onClick={() => handleMobileTabSelect(1)}>
                    Liquidity
                  </MenuItem>
                  <MenuItem onClick={() => handleMobileTabSelect(2)}>
                    Slippage
                  </MenuItem>
                </Menu>
              </>
            ) : (
              /* Desktop Navigation */
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor="inherit"
                TabIndicatorProps={{
                  sx: {
                    backgroundColor: 'primary.main',
                    height: 3,
                    bottom: -1,
                    borderRadius: '2px 2px 0 0'
                  }
                }}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'uppercase',
                    fontSize: '1rem',
                    fontWeight: 600,
                    minWidth: 'auto',
                    px: { xs: 2, sm: 3 },
                    letterSpacing: '0.02em'
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
        <TabPanel value={activeTab} index={0}>
          <AllocationModel />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <LiquidityModel />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <SlippageModel />
        </TabPanel>
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
        <AppContent />
      </RiskModelProvider>
    </ThemeProvider>
  );
}

export default App;
