import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import GamepadIcon from '@mui/icons-material/Gamepad';

// Shared helper function to get icon based on title
export const getTitleIcon = (title) => {
  switch (title) {
    case 'Methodology':
      return <SchoolIcon sx={{ mr: 1, fontSize: '1.25rem' }} />;
    case 'Parameters':
      return <SettingsIcon sx={{ mr: 1, fontSize: '1.25rem' }} />;
    case 'Simulation':
      return <GamepadIcon sx={{ mr: 1, fontSize: '1.25rem' }} />;
    default:
      return null;
  }
};

// Add other shared component utilities here as needed
