'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ContentAreaLoader } from '../src/components/Loader';
import { withMinLoadTime } from '../src/utils/loading';

// Load the HomePage component with content area loading only
const HomePage = dynamic(
  () =>
    withMinLoadTime(
      import('../src/components/pages/HomePage').then((mod) => ({
        default: mod.HomePage,
      }))
    ),
  {
    ssr: false,
    loading: () => <ContentAreaLoader message="Loading..." />,
  }
);

export default function Home() {
  return <HomePage />;
}
