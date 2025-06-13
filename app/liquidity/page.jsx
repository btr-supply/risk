'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ContentAreaLoader } from '../../src/components/Loader';
import { withMinLoadTime } from '../../src/utils/loading';

// Load the LiquidityModel component with content area loading only
const LiquidityModel = dynamic(
  () =>
    withMinLoadTime(
      import('../../src/components/pages/LiquidityModel').then((mod) => ({
        default: mod.LiquidityModel,
      }))
    ),
  {
    ssr: false,
    loading: () => <ContentAreaLoader message="Loading..." />,
  }
);

export default function LiquidityPage() {
  return <LiquidityModel />;
}
