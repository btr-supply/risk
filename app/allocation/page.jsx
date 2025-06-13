'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ContentAreaLoader } from '../../src/components/Loader';
import { withMinLoadTime } from '../../src/utils/loading';

// Load the AllocationModel component with content area loading only
const AllocationModel = dynamic(
  () =>
    withMinLoadTime(
      import('../../src/components/pages/AllocationModel').then((mod) => ({
        default: mod.AllocationModel,
      }))
    ),
  {
    ssr: false,
    loading: () => <ContentAreaLoader message="Loading..." />,
  }
);

export default function AllocationPage() {
  return <AllocationModel />;
}
