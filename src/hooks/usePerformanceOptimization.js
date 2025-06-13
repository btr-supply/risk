import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { PERFORMANCE } from '../constants';

// Enhanced performance hooks to complement useOptimizedState.js

// Stable callbacks hook to prevent recreation of functions on every render
export const useStableCallbacks = (actions) => {
  return useMemo(() => {
    const stableActions = {};
    Object.entries(actions).forEach(([key, action]) => {
      stableActions[key] = action;
    });
    return stableActions;
  }, [actions]);
};

// Throttled state hook for high-frequency updates (sliders, inputs)
export const useThrottledState = (
  initialValue,
  delay = PERFORMANCE.THROTTLE_DELAY
) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef(null);

  const throttledSetValue = useCallback(
    (newValue) => {
      setValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(newValue);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, debouncedValue, throttledSetValue];
};

// Debounced value hook for search inputs and validation
export const useDebouncedValue = (
  value,
  delay = PERFORMANCE.DEBOUNCE_DELAY
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Chart data optimization hook to limit data points for performance
export const useOptimizedChartData = (
  rawData,
  maxDataPoints = PERFORMANCE.CHART_DATA_LIMIT
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

// Memoized computation hook with dependency optimization
export const useComputedValue = (
  computeFunction,
  dependencies,
  enabled = true
) => {
  return useMemo(() => {
    if (!enabled) return null;
    return computeFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, computeFunction, ...dependencies]);
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

  return {
    ...visibleRange,
    handleScroll,
    totalHeight: items.length * itemHeight,
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
export const useMemoryOptimization = (data, maxCacheSize = 100) => {
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
  useThrottledState,
  useDebouncedValue,
  useOptimizedChartData,
  useComputedValue,
  useVirtualization,
  useIntersectionObserver,
  useResizeObserver,
  useIdleCallback,
  useMemoryOptimization,
};
