import React from 'react';
import { Box, Typography, Card, CardContent, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ExpandIcon from '@mui/icons-material/Expand';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
// No need for COLORS import anymore since we use theme directly

const ModelCard = ({ title, description, icon, route, color }) => {
  const router = useRouter();

  return (
    <Card
      sx={{
        height: { xs: 'auto', lg: '15rem' },
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: `1px solid`,
        borderColor: 'divider',
        position: 'relative',
        '&:hover': {
          borderColor: color,
          '& .model-icon': {
            color: color,
          },
          '& .arrow-icon': {
            color: color,
          },
        },
      }}
      onClick={() => router.push(route)}
    >
      {/* Arrow in top right */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          transition: 'color 0.3s ease',
        }}
        className="arrow-icon"
      >
        <ArrowOutwardIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          p: 3,
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            color: 'text.secondary',
            mb: 1,
            ml: -0.9,
            transition: 'color 0.3s ease',
            flexShrink: 0,
          }}
          className="model-icon"
        >
          {icon}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: 'text.primary',
              fontSize: { xs: '1.5rem', lg: '1.25rem' },
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.5,
              fontSize: '0.9rem',
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const HomePage = () => {
  const theme = useTheme();

  // Chart colors are now directly in theme
  const chartColors = theme.colors.chart;

  // Functional colors are now directly in theme
  const functionalColors = theme.colors.functional;

  const modelCards = [
    {
      title: 'Allocation Model',
      description:
        'Optimize TVL allocation across multiple DEX liquidity pools using modern portfolio theory, Kelly Criterion, and Risk Parity methodologies.',
      icon: <DataUsageIcon sx={{ fontSize: 48 }} />,
      route: '/allocation',
      color: chartColors[0], // Blue
    },
    {
      title: 'Liquidity Model',
      description:
        'Manage protocol cash reserves and security buffers using Basel III regulations and optimal cash holdings theory.',
      icon: <WaterDropIcon sx={{ fontSize: 48 }} />,
      route: '/liquidity',
      color: chartColors[1], // Green
    },
    {
      title: 'Slippage Model',
      description:
        'Optimize transaction costs and protect against MEV using dynamic slippage mechanisms and optimal design theory.',
      icon: <ExpandIcon sx={{ fontSize: 48 }} />,
      route: '/slippage',
      color: chartColors[2], // Orange
    },
  ];

  return (
    <Box sx={{ pb: 4 }}>
      {/* Overview Section */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}
      >
        Overview
      </Typography>

      <Card sx={{ mb: 6, bgcolor: 'background.paper' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="body2"
            paragraph
            sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}
          >
            This site is an extension of <strong>BTR's documentation</strong>,
            dedicated to protocol risk models methodologies and visualization.
            The interactive tools presented here reflect the{' '}
            <strong>V1 implementation of LibRisk</strong> on-chain smart
            contract, providing comprehensive analysis and simulation
            capabilities for BTR's sophisticated risk management framework.
          </Typography>
          <Typography
            variant="body2"
            paragraph
            sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}
          >
            Each model implements cutting-edge financial theory and quantitative
            methodologies, from TVL allocation optimization across liquidity
            pools to MEV protection mechanisms, enabling users to understand and
            experiment with the mathematical foundations underlying BTR's
            protocol design. These models represent the mathematical foundations
            of BTR's V1 protocol implementation.
          </Typography>

          {/* External Links */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Link
              href="https://btr.supply/docs"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: functionalColors.link,
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Full Documentation <LaunchIcon fontSize="small" />
            </Link>
            <Link
              href="https://github.com/btr-supply/contracts/blob/main/evm/src/libraries/LibRisk.sol"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: functionalColors.link,
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Smart Contract Code <LaunchIcon fontSize="small" />
            </Link>
          </Box>
        </CardContent>
      </Card>

      {/* Model Navigation Cards */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, mb: 4, color: 'text.primary' }}
      >
        Explore Models
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          justifyContent: 'space-between',
        }}
      >
        {modelCards.map((model, index) => (
          <Box key={index} sx={{ flex: { xs: 'none', md: '1' } }}>
            <ModelCard {...model} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
