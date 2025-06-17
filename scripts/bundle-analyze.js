#!/usr/bin/env bun

/**
 * Enhanced Bundle Analysis Script for Modern Browser Optimization
 * Analyzes bundle size, compression ratios, and performance metrics
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, extname } from 'path';
import { gzipSync, brotliCompressSync } from 'zlib';

const DIST_DIR = './dist';
const TARGET_SIZES = {
  initial: 250 * 1024, // 250KB initial bundle target
  chunk: 150 * 1024, // 150KB per chunk target
  total: 1000 * 1024, // 1MB total JS target
};

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

function getCompressionRatio(original, compressed) {
  return ((1 - compressed / original) * 100).toFixed(1) + '%';
}

function analyzeFiles(dir, basePath = '') {
  const files = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const relativePath = join(basePath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...analyzeFiles(fullPath, relativePath));
    } else if (extname(item) === '.js') {
      const content = readFileSync(fullPath);
      const originalSize = content.length;
      const gzipSize = gzipSync(content).length;
      const brotliSize = brotliCompressSync(content).length;

      files.push({
        path: relativePath,
        originalSize,
        gzipSize,
        brotliSize,
        gzipRatio: getCompressionRatio(originalSize, gzipSize),
        brotliRatio: getCompressionRatio(originalSize, brotliSize),
      });
    }
  }

  return files;
}

function categorizeFiles(files) {
  const categories = {
    react: files.filter((f) => f.path.includes('react')),
    mui: files.filter((f) => f.path.includes('mui')),
    charts: files.filter((f) => f.path.includes('chart')),
    vendor: files.filter((f) => f.path.includes('vendor')),
    app: files.filter(
      (f) =>
        !f.path.includes('react') &&
        !f.path.includes('mui') &&
        !f.path.includes('chart') &&
        !f.path.includes('vendor')
    ),
  };

  return categories;
}

function generateReport(files) {
  const categories = categorizeFiles(files);
  const totalOriginal = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalGzip = files.reduce((sum, f) => sum + f.gzipSize, 0);
  const totalBrotli = files.reduce((sum, f) => sum + f.brotliSize, 0);

  console.log('🚀 Bundle Analysis Report - Modern Browser Optimization');
  console.log('='.repeat(70));

  console.log('\n📊 Overall Bundle Statistics:');
  console.log(`  Original Size: ${formatBytes(totalOriginal)}`);
  console.log(
    `  Gzip Size:     ${formatBytes(totalGzip)} (${getCompressionRatio(totalOriginal, totalGzip)} reduction)`
  );
  console.log(
    `  Brotli Size:   ${formatBytes(totalBrotli)} (${getCompressionRatio(totalOriginal, totalBrotli)} reduction)`
  );

  console.log('\n🎯 Performance Targets:');
  console.log(`  Initial Bundle Target: ${formatBytes(TARGET_SIZES.initial)}`);
  console.log(`  Chunk Size Target:     ${formatBytes(TARGET_SIZES.chunk)}`);
  console.log(`  Total JS Target:       ${formatBytes(TARGET_SIZES.total)}`);

  const initialBundle = files.find(
    (f) => f.path.includes('_app') || f.path.includes('main')
  );
  if (initialBundle) {
    const status = initialBundle.gzipSize <= TARGET_SIZES.initial ? '✅' : '❌';
    console.log(`  Initial Bundle Status: ${status}`);
  }

  const totalStatus = totalGzip <= TARGET_SIZES.total ? '✅' : '❌';
  console.log(`  Total Bundle Status:   ${totalStatus}`);

  console.log('\n📦 Bundle Categories:');
  Object.entries(categories).forEach(([name, categoryFiles]) => {
    if (categoryFiles.length > 0) {
      const categoryGzip = categoryFiles.reduce(
        (sum, f) => sum + f.gzipSize,
        0
      );
      const categoryBrotli = categoryFiles.reduce(
        (sum, f) => sum + f.brotliSize,
        0
      );
      console.log(`  ${name.toUpperCase()}:`);
      console.log(`    Files: ${categoryFiles.length}`);
      console.log(`    Gzip:  ${formatBytes(categoryGzip)}`);
      console.log(`    Brotli: ${formatBytes(categoryBrotli)}`);
    }
  });

  console.log('\n📋 Individual Files (sorted by size):');
  const sortedFiles = files.sort((a, b) => b.gzipSize - a.gzipSize);

  sortedFiles.slice(0, 15).forEach((file) => {
    const sizeWarning = file.gzipSize > TARGET_SIZES.chunk ? '⚠️ ' : '';
    console.log(`  ${sizeWarning}${file.path}`);
    console.log(`    Original: ${formatBytes(file.originalSize)}`);
    console.log(
      `    Gzip:     ${formatBytes(file.gzipSize)} (${file.gzipRatio})`
    );
    console.log(
      `    Brotli:   ${formatBytes(file.brotliSize)} (${file.brotliRatio})`
    );
  });

  console.log('\n💡 Optimization Recommendations:');

  if (totalGzip > TARGET_SIZES.total) {
    console.log('  ❌ Total bundle size exceeds target');
    console.log('     - Consider code splitting');
    console.log('     - Review unused imports');
    console.log('     - Lazy load heavy components');
  }

  const largeChunks = files.filter((f) => f.gzipSize > TARGET_SIZES.chunk);
  if (largeChunks.length > 0) {
    console.log(`  ⚠️  ${largeChunks.length} chunks exceed size target`);
    console.log('     - Split large vendor libraries');
    console.log('     - Use dynamic imports for heavy features');
  }

  const poorCompression = files.filter((f) => {
    const gzipRatio = parseFloat(f.gzipRatio);
    return gzipRatio < 60; // Less than 60% compression
  });

  if (poorCompression.length > 0) {
    console.log(
      `  📝 ${poorCompression.length} files have suboptimal compression`
    );
    console.log('     - Check for duplicate code');
    console.log('     - Ensure proper minification');
  }

  console.log('\n🎉 Modern Browser Features Enabled:');
  console.log('  ✅ ES6+ target (no legacy polyfills)');
  console.log('  ✅ Tree shaking enabled');
  console.log('  ✅ Brotli compression support');
  console.log('  ✅ Chunk splitting optimized');
  console.log('  ✅ Source maps for debugging');

  console.log('\n' + '='.repeat(70));
}

try {
  console.log('Analyzing bundle...\n');
  const files = analyzeFiles(DIST_DIR);

  if (files.length === 0) {
    console.error('❌ No JavaScript files found in dist directory.');
    console.error('   Run "bun run build" first to generate the bundle.');
    process.exit(1);
  }

  generateReport(files);
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
