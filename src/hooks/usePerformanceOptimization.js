import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { PERFORMANCE } from '../constants';

// Enhanced performance hooks to complement useOptimizedState.js
// For input debouncing, use the centralized useDebounce hook from hooks/useDebounce.js

// Simplified stable callbacks - just return the actions directly since they should already be stable
export const useStableCallbacks = (actions) => {
  // If actions are already stable from store/context, no need for additional memoization
  return actions;
};

// Chart data optimization hook to limit data points for performance
export const useOptimizedChartData = (
  rawData,
  maxDataPoints = 500 // Default limit for chart performance
) => {
  return useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length <= maxDataPoints) {
      return rawData;
    }

    // Simple downsampling - take every nth point to reach target
    const step = Math.ceil(rawData.length / maxDataPoints);
    return rawData.filter((_, index) => index % step === 0);
  }, [rawData, maxDataPoints]);
};

// Virtualization helper for large lists
export const useVirtualization = (items, containerHeight, itemHeight = 50) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // buffer
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount, items.length);

    return {
      startIndex: Math.max(0, startIndex),
      endIndex,
      visibleItems: items.slice(Math.max(0, startIndex), endIndex),
    };
  }, [items, containerHeight, itemHeight, scrollTop]);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  // Only enable virtualization if items exceed threshold
  const shouldVirtualize = items.length > PERFORMANCE.VIRTUALIZATION_THRESHOLD;

  return {
    ...visibleRange,
    handleScroll,
    totalHeight: items.length * itemHeight,
    shouldVirtualize,
  };
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return {
    ref: targetRef,
    isIntersecting,
    hasIntersected,
  };
};

// Resize observer hook for responsive components
export const useResizeObserver = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [ref, dimensions];
};

// Idle callback hook for non-critical computations
export const useIdleCallback = (callback, dependencies) => {
  useEffect(() => {
    if (window.requestIdleCallback) {
      const handle = window.requestIdleCallback(callback);
      return () => window.cancelIdleCallback(handle);
    } else {
      // Fallback for browsers without requestIdleCallback
      const handle = setTimeout(callback, 1);
      return () => clearTimeout(handle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies]);
};

// Memory usage optimization hook
export const useMemoryOptimization = (
  data,
  maxCacheSize = PERFORMANCE.MEMOIZATION_CACHE_SIZE
) => {
  const cacheRef = useRef(new Map());

  return useMemo(() => {
    const cache = cacheRef.current;

    // Clear old entries if cache is too large
    if (cache.size > maxCacheSize) {
      const entries = Array.from(cache.entries());
      entries.slice(0, cache.size - maxCacheSize).forEach(([key]) => {
        cache.delete(key);
      });
    }

    const dataKey = JSON.stringify(data);
    if (cache.has(dataKey)) {
      return cache.get(dataKey);
    }

    // Store in cache for future use
    cache.set(dataKey, data);
    return data;
  }, [data, maxCacheSize]);
};

// Export all performance hooks
export const performanceHooks = {
  useStableCallbacks,
  useOptimizedChartData,
  useVirtualization,
  useIntersectionObserver,
  useResizeObserver,
  useIdleCallback,
  useMemoryOptimization,
};
