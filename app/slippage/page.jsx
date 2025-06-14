'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RouteLoadingOverlay } from '../../src/components/Loader';

// Load the SlippageModel component with immediate loading feedback
const SlippageModel = dynamic(
  () =>
    import('../../src/components/pages/SlippageModel').then((mod) => ({
      default: mod.SlippageModel,
    })),
  {
    ssr: false,
    loading: () => <RouteLoadingOverlay />,
  }
);

export default function SlippagePage() {
  return <SlippageModel />;
}
