'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RouteLoadingOverlay } from '../../src/components/Loader';

// Load the LiquidityModel component with immediate loading feedback
const LiquidityModel = dynamic(
  () =>
    import('../../src/components/pages/LiquidityModel').then((mod) => ({
      default: mod.LiquidityModel,
    })),
  {
    ssr: false,
    loading: () => <RouteLoadingOverlay />,
  }
);

export default function LiquidityPage() {
  return <LiquidityModel />;
}
