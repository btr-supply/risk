import React from 'react';
import { Card, CardContent, Box } from '@mui/material';
import { CardTitle } from './Typography';

// Enhanced BaseCard with variant support and common patterns
const BaseCard = ({
  children,
  title,
  action,
  variant = 'default',
  sx = {},
  elevation = 0,
  withContent = true,
  contentSx = {},
  ...props
}) => {
  const cardSx = {
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    ...(variant === 'parameter' && {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }),
    ...(variant === 'simulation' && {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }),
    ...sx,
  };

  const defaultContentSx = {
    ...(variant === 'parameter' && {
      p: 2.5,
      flexGrow: 1,
    }),
    ...(variant === 'simulation' && {
      p: 2.5,
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    }),
    ...contentSx,
  };

  const cardContent = (
    <>
      {(title || action) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
          }}
        >
          {title && <CardTitle>{title}</CardTitle>}
          {action && <Box>{action}</Box>}
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          ...(variant === 'simulation' && {
            width: '100%',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }),
        }}
      >
        {children}
      </Box>
    </>
  );

  return (
    <Card elevation={elevation} sx={cardSx} {...props}>
      {withContent ? (
        <CardContent sx={defaultContentSx}>{cardContent}</CardContent>
      ) : (
        cardContent
      )}
    </Card>
  );
};

export default BaseCard;
