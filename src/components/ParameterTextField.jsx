import React from 'react';
import { TextField, Typography } from '@mui/material';

// Parameter text field for precise input
export const ParameterTextField = ({
  label,
  value,
  onChange,
  min,
  max,
  helperText,
  unit = '',
  type = 'number',
}) => (
  <TextField
    label={label}
    value={value}
    onChange={(e) => {
      const newValue =
        type === 'number' ? Number(e.target.value) : e.target.value;
      if (min !== undefined && newValue < min) return;
      if (max !== undefined && newValue > max) return;
      onChange(newValue);
    }}
    type={type}
    size="small"
    fullWidth
    helperText={helperText}
    InputProps={{
      endAdornment: unit && (
        <Typography variant="body2" color="text.secondary">
          {unit}
        </Typography>
      ),
    }}
    sx={{
      '& .MuiInputBase-root': {
        fontFamily: 'monospace',
        borderRadius: 1,
      },
    }}
  />
);
