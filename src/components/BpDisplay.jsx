import React from 'react';
import { bpformatPercent } from '@/models.js';

// Basis point display helper
export const BpDisplay = ({ value, decimals = 2 }) => (
  <span style={{ fontFamily: 'monospace' }}>
    {bpformatPercent(value).toFixed(decimals)}%
  </span>
);
