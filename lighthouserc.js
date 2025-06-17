export default {
  ci: {
    collect: {
      // Collect performance data from the built static files
      staticDistDir: './dist',
      url: [
        'http://localhost:8080/index.html',
        'http://localhost:8080/allocation/index.html',
        'http://localhost:8080/liquidity/index.html',
        'http://localhost:8080/slippage/index.html',
      ],
      numberOfRuns: 3, // Run 3 times and average the results for stability
    },
    assert: {
      // Performance thresholds - fail if below these scores
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }], // 85% performance score minimum
        'categories:accessibility': ['error', { minScore: 0.95 }], // 95% accessibility score minimum
        'categories:best-practices': ['error', { minScore: 0.9 }], // 90% best practices score minimum
        'categories:seo': ['error', { minScore: 0.9 }], // 90% SEO score minimum

        // Core Web Vitals thresholds (optimized for our bundle size targets)
        'metrics:first-contentful-paint': ['error', { maxNumericValue: 1500 }], // 1.5s FCP
        'metrics:largest-contentful-paint': [
          'error',
          { maxNumericValue: 2500 },
        ], // 2.5s LCP
        'metrics:cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // 0.1 CLS
        'metrics:total-blocking-time': ['error', { maxNumericValue: 200 }], // 200ms TBT

        // Bundle size specific metrics
        'metrics:total-byte-weight': ['warn', { maxNumericValue: 500000 }], // 500KB total warning
        'metrics:unused-javascript': ['warn', { maxNumericValue: 50000 }], // 50KB unused JS warning

        // Modern browser features we've optimized for
        'metrics:server-response-time': ['error', { maxNumericValue: 100 }], // 100ms server response
        'metrics:speed-index': ['error', { maxNumericValue: 3000 }], // 3s speed index
      },
    },
    upload: {
      // Store results locally for trending analysis
      target: 'filesystem',
      outputDir: './lighthouse-results',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
    server: {
      // Use serve package for serving static files during testing
      command: 'bunx serve -p 8080 -s ./dist',
      port: 8080,
      waitForLighthouse: true,
    },
  },
};
