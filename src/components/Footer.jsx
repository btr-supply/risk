import React from 'react';
import {
  Box,
  Container,
  Card,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';

// Reusable Social Links component
export const SocialLinks = ({
  orientation = 'horizontal',
  size = 'medium',
  spacing = 0.5,
}) => {
  const getIconSize = () => {
    switch (size) {
      case 'xlarge':
        return {
          github: '2.5rem',
          x: '2.5rem',
          telegram: '2.7rem',
        };
      case 'large':
        return {
          github: '2rem',
          x: '2rem',
          telegram: '2.2rem',
        };
      default:
        return {
          github: '1.6rem',
          x: '1.6rem',
          telegram: '1.8rem',
        };
    }
  };

  const iconSizes = getIconSize();

  const socialLinks = [
    {
      icon: <GitHubIcon sx={{ fontSize: iconSizes.github }} />,
      url: 'https://github.com/btr-supply',
      label: 'GitHub',
    },
    {
      icon: <XIcon sx={{ fontSize: iconSizes.x }} />,
      url: 'https://x.com/BTRSupply',
      label: 'X (Twitter)',
    },
    {
      icon: <TelegramIcon sx={{ fontSize: iconSizes.telegram }} />,
      url: 'https://t.me/BTRSupply',
      label: 'Telegram',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: spacing,
        alignItems: 'center',
      }}
    >
      {socialLinks.map((social) => (
        <IconButton
          key={social.label}
          component="a"
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          size={
            size === 'xlarge' ? 'large' : size === 'large' ? 'large' : 'small'
          }
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            },
            transition: 'color 0.2s ease',
            p: size === 'xlarge' ? 1.5 : size === 'large' ? 1 : 0.5,
          }}
          aria-label={social.label}
        >
          {social.icon}
        </IconButton>
      ))}
    </Box>
  );
};

// BTR Logo component (same as header)
const BTRLogo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
    <Typography
      variant="h6"
      component="div"
      sx={{
        fontWeight: 800,
        fontSize: { xs: '1.5rem', sm: '1.75rem' },
        fontStyle: 'italic',
        color: 'text.primary',
      }}
    >
      BTR
    </Typography>
  </Box>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
          <Box
            sx={{
              display: 'flex',
              gap: 0,
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
          >
            <BTRLogo />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                ml: 0.5,
                alignSelf: 'flex-end',
              }}
            >
              © {currentYear}
            </Typography>
          </Box>

          {/* Right side: Social Links */}
          <Box sx={{ mr: 2 }}>
            <SocialLinks />
          </Box>
        </Toolbar>
      </Card>
    </Container>
  );
};

export default Footer;
