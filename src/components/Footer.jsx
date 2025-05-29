import React from 'react';
import {
  Box,
  Container,
  Card,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';

// BTR Logo component (same as header)
const BTRLogo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
    <Typography variant="h6" component="div" sx={{
      fontWeight: 800,
      fontSize: { xs: '1.5rem', sm: '1.75rem' },
      fontStyle: 'italic',
      color: 'text.primary'
    }}>
      BTR
    </Typography>
  </Box>
);

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <GitHubIcon sx={{ fontSize: '1.6rem' }} />,
      url: 'https://github.com/btr-supply',
      label: 'GitHub',
    },
    {
      icon: <XIcon sx={{ fontSize: '1.6rem' }} />,
      url: 'https://x.com/BTRSupply',
      label: 'X (Twitter)',
    },
    {
      icon: <TelegramIcon sx={{ fontSize: '1.8rem' }} />,
      url: 'https://t.me/BTRSupply',
      label: 'Telegram',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 'auto', py: 1 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar
          sx={{
            minHeight: '56px !important',
            px: 3,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left side: BTR Logo + Copyright */}
          <Box sx={{
            display: 'flex',
            gap: 0,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-end'
          }}>
            <BTRLogo />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                ml: isMobile ? 0 : 0.5,
                alignSelf: 'flex-end',
              }}
            >
              © {currentYear}
            </Typography>
          </Box>

          {/* Right side: Social Links */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              alignItems: 'center',
              mr: 2,
            }}
          >
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  transition: 'color 0.2s ease',
                  p: 0.5,
                }}
                aria-label={social.label}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Toolbar>
      </Card>
    </Container>
  );
};

export default Footer;
