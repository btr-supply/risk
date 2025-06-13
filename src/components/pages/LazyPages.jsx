import { lazy } from 'react';

// Lazy load the heavy page components
export const LazyAllocationModel = lazy(() => import('./AllocationModel'));
export const LazyLiquidityModel = lazy(() => import('./LiquidityModel'));
export const LazySlippageModel = lazy(() => import('./SlippageModel'));

// HomePage is small enough to keep as regular import
export { default as HomePage } from './HomePage';
