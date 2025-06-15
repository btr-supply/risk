import React from 'react';
import { Paper } from '@mui/material';
import { SPACING, COMMON_SX } from '../constants';

// Server-side AsciiMath to MathML component
export const MathFormula = ({ children, inline = false }) => {
  if (!children) return null;

  let mathML = '';
  try {
    // Import asciimath2ml synchronously for server-side rendering
    const { asciiToMathML } = require('asciimath2ml');
    mathML = asciiToMathML(children, inline);
  } catch (error) {
    console.error('Error converting math:', error);
    mathML = `<span style="color: red;">Error: ${children}</span>`;
  }

  if (inline) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: mathML }}
        style={{ fontFamily: 'var(--font-stix-two-math), Times, serif' }}
      />
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        ...COMMON_SX.paperContainer,
        bgcolor: 'grey.800',
        p: SPACING.lg,
        mt: SPACING.lg,
        overflowX: 'auto',
        overflowY: 'visible',
        fontFamily: 'var(--font-stix-two-math), Times, serif',
        textAlign: 'center',
        '& math': {
          fontSize: '1.1em',
          display: 'block',
          margin: '0.5em 0',
        },
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: mathML }} />
    </Paper>
  );
};
