import { useCallback, useRef, useState, useEffect } from 'react';
import { PERFORMANCE } from '../constants';

// Simple, generic debounce hook for user inputs
export const useDebounce = (callback, delay = PERFORMANCE.DEBOUNCE_DELAY) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

// Hook for sliders that need immediate visual feedback with debounced state updates
export const useSliderDebounce = (
  value,
  onChange,
  delay = PERFORMANCE.THROTTLE_DELAY
) => {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef(null);

  // Update local value when external value changes (controlled by parent)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (newValue) => {
      // Update local state immediately for visual feedback
      setLocalValue(newValue);

      // Debounce the actual state change
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, delay);
    },
    [onChange, delay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [localValue, handleChange];
};

// Cleanup function for unmounting
export const useDebounceCleanup = (timeoutRef) => {
  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [timeoutRef]);
};
