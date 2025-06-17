import path from 'path';

// Shared aliases configuration
const aliases = {
  '@': './src',
  '@components': './src/components',
  '@hooks': './src/hooks',
  '@store': './src/store',
  '@utils': './src/utils',
  '@constants': './src/constants',
  '@pages': './src/components/pages',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for better performance
  output: 'export',
  distDir: './dist',
  trailingSlash: false,

  experimental: {
  },

  // Turbopack for development
  turbopack: {
    resolveAlias: aliases,
  },

  experimental: {
    // Other experimental features
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'chart.js',
      'react-chartjs-2',
    ],
    // Enable modern features for smaller bundles
    esmExternals: true,
    // CSS optimization disabled due to critters dependency issue
    // optimizeCss: true,
  },

  // Optimize bundle splitting
  webpack: (config, { dev, isServer }) => {
    // Add path aliases - one-liner mapping from shared aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(
        Object.entries(aliases).map(([key, value]) => [
          key,
          path.resolve(process.cwd(), value),
        ])
      ),
    };

    // Target very modern browsers for smallest bundles (ES2022+) - client side only
    if (!dev && !isServer) {
      config.target = ['web', 'es2022'];
    }




    // Enable source maps in webpack for production
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }

    // Ensure all static assets are properly compressed
    if (!dev) {
      // Add font files to asset handling
      config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]',
        },
      });

      // Optimize asset compression
      config.optimization.minimize = true;
    }

    // Optimize for production builds
    if (!dev && !isServer) {
      // Enhanced bundle splitting for better caching and smaller initial load
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000,
        maxAsyncSize: 244000,
        maxInitialSize: 244000,
        cacheGroups: {
          // Core React bundle (highest priority)
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 40,
            chunks: 'all',
            enforce: true,
          },
          // Chart.js components (isolate large charting library)
          'chart-js': {
            name: 'chart-js',
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            priority: 30,
            chunks: 'all',
            enforce: true,
          },
          // MUI core components (separate from icons for better caching)
          'mui-core': {
            name: 'mui-core',
            test: /[\\/]node_modules[\\/](@mui\/material|@emotion\/(react|styled))[\\/]/,
            priority: 25,
            chunks: 'all',
            maxSize: 150000,
          },
          // MUI icons (separate chunk for lazy loading)
          'mui-icons': {
            name: 'mui-icons',
            test: /[\\/]node_modules[\\/]@mui\/icons-material[\\/]/,
            priority: 20,
            chunks: 'async', // Only load when needed
            maxSize: 100000,
          },
          // Zustand and state management
          state: {
            name: 'state',
            test: /[\\/]node_modules[\\/](zustand|immer)[\\/]/,
            priority: 15,
            chunks: 'all',
          },
          // Math libraries
          math: {
            name: 'math',
            test: /[\\/]node_modules[\\/](asciimath2ml)[\\/]/,
            priority: 10,
            chunks: 'async',
          },
          // Default vendor chunk (smaller libraries)
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
            minChunks: 2,
            maxSize: 150000,
            chunks: 'all',
          },
        },
      };

      // Enhanced tree shaking and minification
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.providedExports = true;

      // Better module concatenation for smaller bundles
      config.optimization.concatenateModules = true;

      // Remove unused modules more aggressively
      config.optimization.innerGraph = true;

      // Mark packages as side-effect free for better tree shaking
      config.module.rules.push({
        test: /[\\/]node_modules[\\/](@mui|chart\.js|react-chartjs-2)[\\/]/,
        sideEffects: false,
      });

      // Module resolution optimization removed - MUI doesn't export esm path
    }
    return config;
  },

  // Image optimization
  images: {
    unoptimized: true, // For static export
    formats: ['image/avif', 'image/webp'], // Modern formats only
  },

  // Enable compression and modern output
  compress: true,
  poweredByHeader: false, // Remove X-Powered-By header
  // SWC minification is enabled by default in Next.js 15+

  // Generate optimized build ID for better caching
  generateBuildId: async () => {
    return 'btr-risk-ui-' + Date.now();
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'BTR Risk Model',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Optimize runtime chunk to reduce preload warnings
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'], // Keep errors and warnings for debugging
          }
        : false,
    // Enable React compiler optimizations for smaller bundles
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },


};

export default nextConfig;
