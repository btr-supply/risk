'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RouteLoadingOverlay } from '../../src/components/Loader';

// Load the AllocationModel component with immediate loading feedback
const AllocationModel = dynamic(
  () =>
    import('../../src/components/pages/AllocationModel').then((mod) => ({
      default: mod.AllocationModel,
    })),
  {
    ssr: false,
    loading: () => <RouteLoadingOverlay />,
  }
);

export default function AllocationPage() {
  return <AllocationModel />;
}
