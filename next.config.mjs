/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for better performance
  output: 'export',
  distDir: './dist',
  trailingSlash: true,

  // Optimize bundle splitting
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: `${isServer ? 'server' : 'client'}.html`,
        })
      );
    }

    // Enable source maps in webpack for production
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }

    // Optimize for production builds
    if (!dev && !isServer) {
      // Bundle splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // React and core dependencies
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 30,
            chunks: 'all',
          },
          // Chart.js components
          'chart-js': {
            name: 'chart-js',
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            priority: 20,
            chunks: 'all',
          },
          // MUI core components
          'mui-core': {
            name: 'mui-core',
            test: /[\\/]node_modules[\\/](@mui\/material|@emotion\/(react|styled))[\\/]/,
            priority: 15,
            chunks: 'all',
          },
          // MUI icons (separate for better caching)
          'mui-icons': {
            name: 'mui-icons',
            test: /[\\/]node_modules[\\/]@mui\/icons-material[\\/]/,
            priority: 10,
            chunks: 'all',
          },
          // Default vendor chunk (smaller libraries)
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
            minChunks: 2,
            maxSize: 200000,
          },
        },
      };

      // Tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Mark packages as side-effect free for better tree shaking
      config.module.rules.push({
        test: /[\\/]node_modules[\\/](@mui)[\\/]/,
        sideEffects: false,
      });
    }
    return config;
  },

  // Image optimization
  images: {
    unoptimized: true, // For static export
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'chart.js',
      'react-chartjs-2',
    ],
    // Reduce aggressive preloading to prevent console warnings
    optimisticClientCache: false,
  },

  // Compress output
  compress: true,

  // Generate build ID for better caching
  generateBuildId: async () => {
    return 'btr-risk-ui-' + Date.now();
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'BTR Risk Model',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Disable aggressive preloading to reduce console warnings
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Optimize runtime chunk to reduce preload warnings
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error'],
          }
        : false,
  },
};

export default nextConfig;
