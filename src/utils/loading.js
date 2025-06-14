import { PERFORMANCE } from '../constants';

// Loading utility that prevents ugly flashing while ensuring immediate feedback
// Shows loader immediately, but ensures it stays visible for minimum time
export const withMinLoadTime = (
  importPromise,
  minTime = PERFORMANCE.THROTTLE_DELAY
) => {
  const startTime = Date.now();

  return importPromise.then((moduleExports) => {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minTime - elapsedTime);

    // If content loaded very quickly, add small delay to prevent flash
    if (remainingTime > 0) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(moduleExports), remainingTime);
      });
    }

    // If content took longer than minTime, return immediately
    return moduleExports;
  });
};
