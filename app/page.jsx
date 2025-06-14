'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ContentAreaLoader } from '../src/components/Loader';
import { withMinLoadTime } from '../src/utils/loading';

// Load the HomePage component with anti-flash loading
const HomePage = dynamic(
  () =>
    withMinLoadTime(
      import('../src/components/pages/HomePage').then((mod) => ({
        default: mod.default,
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
