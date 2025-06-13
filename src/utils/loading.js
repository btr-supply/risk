// Loading utility that ensures minimum loading time for smooth UX
export const withMinLoadTime = (importPromise, minTime = 1000) => {
  return Promise.all([
    importPromise,
    new Promise((resolve) => setTimeout(resolve, minTime)),
  ]).then(([moduleExports]) => moduleExports);
};
