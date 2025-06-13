'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ContentAreaLoader } from '../../src/components/Loader';
import { withMinLoadTime } from '../../src/utils/loading';

// Load the SlippageModel component with content area loading only
const SlippageModel = dynamic(
  () =>
    withMinLoadTime(
      import('../../src/components/pages/SlippageModel').then((mod) => ({
        default: mod.SlippageModel,
      }))
    ),
  {
    ssr: false,
    loading: () => <ContentAreaLoader message="Loading..." />,
  }
);

export default function SlippagePage() {
  return <SlippageModel />;
}
