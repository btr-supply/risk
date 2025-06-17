#!/usr/bin/env bun

/**
 * Performance Check Script
 * Validates modern browser optimization settings and configurations
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PERFORMANCE_CHECKS = [
  {
    name: 'Browser Support Configuration',
    check: checkBrowserslistConfig,
    critical: true,
  },
  {
    name: 'Next.js Optimization Settings',
    check: checkNextConfig,
    critical: true,
  },
  {
    name: 'Cloudflare Headers Configuration',
    check: checkCloudflareHeaders,
    critical: false,
  },
  {
    name: 'Package Dependencies',
    check: checkPackageDependencies,
    critical: false,
  },
  {
    name: 'Build Output Structure',
    check: checkBuildOutput,
    critical: false,
  },
];

function checkBrowserslistConfig() {
  const issues = [];
  const recommendations = [];

  if (!existsSync('.browserslistrc')) {
    issues.push('Missing .browserslistrc file');
    recommendations.push('Create .browserslistrc to target modern browsers');
    return { issues, recommendations };
  }

  const config = readFileSync('.browserslistrc', 'utf8');

  // Check for modern browser targeting
  if (config.includes('ie') && !config.includes('not ie')) {
    issues.push('Internet Explorer support detected');
    recommendations.push('Remove IE support to reduce bundle size');
  }

  if (!config.includes('not dead')) {
    recommendations.push('Add "not dead" to exclude unsupported browsers');
  }

  if (
    !config.includes('chrome') ||
    !config.includes('firefox') ||
    !config.includes('safari')
  ) {
    recommendations.push('Specify minimum versions for major browsers');
  }

  return { issues, recommendations };
}

function checkNextConfig() {
  const issues = [];
  const recommendations = [];

  if (!existsSync('next.config.mjs')) {
    issues.push('Missing next.config.mjs file');
    return { issues, recommendations };
  }

  const config = readFileSync('next.config.mjs', 'utf8');

  // Check for modern optimizations
  const optimizations = [
    { pattern: 'swcMinify', name: 'SWC Minification' },
    { pattern: 'legacyBrowsers.*false', name: 'Legacy Browsers Disabled' },
    { pattern: 'optimizePackageImports', name: 'Package Import Optimization' },
    { pattern: 'splitChunks', name: 'Bundle Splitting' },
    { pattern: 'usedExports.*true', name: 'Tree Shaking' },
    { pattern: 'removeConsole', name: 'Console Removal' },
  ];

  optimizations.forEach((opt) => {
    if (!new RegExp(opt.pattern).test(config)) {
      recommendations.push(`Enable ${opt.name} for better performance`);
    }
  });

  // Check for modern features
  if (!config.includes('es6') && !config.includes('es2015')) {
    recommendations.push('Target ES6+ for smaller bundles');
  }

  if (!config.includes('TerserPlugin')) {
    recommendations.push('Add Terser plugin for enhanced minification');
  }

  return { issues, recommendations };
}

function checkCloudflareHeaders() {
  const issues = [];
  const recommendations = [];

  if (!existsSync('public/_headers')) {
    issues.push('Missing Cloudflare headers configuration');
    recommendations.push('Create public/_headers for compression and caching');
    return { issues, recommendations };
  }

  const headers = readFileSync('public/_headers', 'utf8');

  // Check for compression headers
  if (!headers.includes('Accept-Encoding')) {
    recommendations.push('Add Accept-Encoding headers for compression');
  }

  if (!headers.includes('brotli') && !headers.includes('br')) {
    recommendations.push('Enable Brotli compression for better performance');
  }

  if (!headers.includes('Cache-Control')) {
    recommendations.push('Add Cache-Control headers for static assets');
  }

  // Check for chunk-specific caching
  const chunkPatterns = ['react-', 'mui-', 'chart-', 'vendor-'];
  const missingChunks = chunkPatterns.filter(
    (pattern) => !headers.includes(pattern)
  );

  if (missingChunks.length > 0) {
    recommendations.push(
      `Add specific headers for chunks: ${missingChunks.join(', ')}`
    );
  }

  return { issues, recommendations };
}

function checkPackageDependencies() {
  const issues = [];
  const recommendations = [];

  if (!existsSync('package.json')) {
    issues.push('Missing package.json file');
    return { issues, recommendations };
  }

  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

  // Check for performance-related dev dependencies
  const performanceDeps = ['terser-webpack-plugin', 'webpack-bundle-analyzer'];

  performanceDeps.forEach((dep) => {
    if (!pkg.devDependencies?.[dep]) {
      recommendations.push(`Add ${dep} for better build optimization`);
    }
  });

  // Check for modern scripts
  const performanceScripts = [
    'bundle:analyze',
    'build:production',
    'performance:check',
  ];

  performanceScripts.forEach((script) => {
    if (!pkg.scripts?.[script]) {
      recommendations.push(`Add ${script} script for performance monitoring`);
    }
  });

  return { issues, recommendations };
}

function checkBuildOutput() {
  const issues = [];
  const recommendations = [];

  if (!existsSync('dist')) {
    issues.push('No build output found');
    recommendations.push('Run "bun run build" to generate optimized bundle');
    return { issues, recommendations };
  }

  // Check for chunk files
  const distFiles = [];
  try {
    const fs = require('fs');
    function scanDir(dir) {
      const items = fs.readdirSync(dir);
      items.forEach((item) => {
        const path = join(dir, item);
        if (fs.statSync(path).isDirectory()) {
          scanDir(path);
        } else if (item.endsWith('.js')) {
          distFiles.push(item);
        }
      });
    }
    scanDir('dist');
  } catch (e) {
    // Ignore scan errors
  }

  // Check for expected chunks
  const expectedChunks = ['react', 'mui', 'chart', 'vendor'];
  const foundChunks = expectedChunks.filter((chunk) =>
    distFiles.some((file) => file.includes(chunk))
  );

  if (foundChunks.length < expectedChunks.length) {
    const missing = expectedChunks.filter(
      (chunk) => !foundChunks.includes(chunk)
    );
    recommendations.push(`Missing expected chunks: ${missing.join(', ')}`);
  }

  return { issues, recommendations };
}

function runPerformanceCheck() {
  console.log('🔍 BTR Risk UI - Performance Check');
  console.log('='.repeat(50));

  let totalIssues = 0;
  let criticalIssues = 0;

  PERFORMANCE_CHECKS.forEach((check) => {
    console.log(`\n📋 ${check.name}:`);

    try {
      const result = check.check();

      if (result.issues.length > 0) {
        console.log('  ❌ Issues:');
        result.issues.forEach((issue) => {
          console.log(`     • ${issue}`);
          totalIssues++;
          if (check.critical) criticalIssues++;
        });
      } else {
        console.log('  ✅ No issues found');
      }

      if (result.recommendations.length > 0) {
        console.log('  💡 Recommendations:');
        result.recommendations.forEach((rec) => {
          console.log(`     • ${rec}`);
        });
      }
    } catch (error) {
      console.log(`  ⚠️  Check failed: ${error.message}`);
      totalIssues++;
      if (check.critical) criticalIssues++;
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log('📊 Performance Check Summary:');
  console.log(`  Total Issues: ${totalIssues}`);
  console.log(`  Critical Issues: ${criticalIssues}`);

  if (criticalIssues === 0) {
    console.log('  ✅ All critical optimizations are in place!');
  } else {
    console.log('  ❌ Critical optimizations needed for best performance');
  }

  console.log('\n🚀 Next Steps:');
  console.log('  1. Run "bun run build:modern" for optimized build');
  console.log('  2. Run "bun run bundle:analyze" to check bundle sizes');
  console.log('  3. Deploy to Cloudflare Pages for compression benefits');
  console.log('  4. Monitor Core Web Vitals after deployment');

  return { totalIssues, criticalIssues };
}

// Run the performance check
const result = runPerformanceCheck();
process.exit(result.criticalIssues > 0 ? 1 : 0);
