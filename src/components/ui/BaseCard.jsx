import React from 'react';
import { Card } from '@mui/material';

const BaseCard = ({ children, sx = {}, elevation = 0, ...props }) => {
  return (
    <Card
      elevation={elevation}
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default BaseCard;
