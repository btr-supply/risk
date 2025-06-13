/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for better performance
  output: 'export',
  distDir: './dist',
  trailingSlash: true,

  // Optimize bundle splitting
  webpack: (config, { dev, isServer }) => {
    // Optimize chunk splitting for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // React and core dependencies
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            priority: 20,
          },
          // MUI core components
          'mui-core': {
            name: 'mui-core',
            test: /[\\/]node_modules[\\/](@mui\/material|@emotion\/(react|styled))[\\/]/,
            priority: 15,
          },
          // MUI icons and charts (heavy components)
          'mui-icons': {
            name: 'mui-icons',
            test: /[\\/]node_modules[\\/]@mui\/icons-material[\\/]/,
            priority: 10,
          },
          'mui-charts': {
            name: 'mui-charts',
            test: /[\\/]node_modules[\\/]@mui\/x-charts[\\/]/,
            priority: 10,
          },
          // Math rendering
          katex: {
            name: 'katex',
            test: /[\\/]node_modules[\\/]katex[\\/]/,
            priority: 10,
          },
          // Default vendor chunk
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
          },
        },
      };
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
      '@mui/x-charts',
    ],
    // Reduce aggressive preloading to prevent console warnings
    optimisticClientCache: false,
  },

  // Compress output
  compress: true,

  // Generate build ID for better caching
  generateBuildId: async () => {
    return 'btr-risk-' + Date.now();
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
