#!/usr/bin/env bun

/**
 * Source Map Verification Script
 * Verifies that source maps are generated and properly configured
 */

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const DIST_DIR = './dist';
const CHUNKS_DIR = join(DIST_DIR, '_next/static/chunks');

async function checkSourceMaps() {
  console.log('🔍 Verifying source map generation...\n');

  try {
    // Check if dist directory exists
    await stat(DIST_DIR);
    console.log('✅ Build directory found');

    // Check chunks directory
    await stat(CHUNKS_DIR);
    console.log('✅ Chunks directory found');

    // Find all JS files and their corresponding source maps
    const files = await readdir(CHUNKS_DIR);
    const jsFiles = files.filter(
      (file) => file.endsWith('.js') && !file.endsWith('.js.map')
    );
    const mapFiles = files.filter((file) => file.endsWith('.js.map'));

    console.log(`\n📊 Build Statistics:`);
    console.log(`   JavaScript files: ${jsFiles.length}`);
    console.log(`   Source map files: ${mapFiles.length}`);

    // Check vendor chunks specifically
    const vendorChunks = jsFiles.filter((file) => file.includes('vendor'));
    const vendorMaps = mapFiles.filter((file) => file.includes('vendor'));

    console.log(`\n🎯 Vendor Chunks:`);
    console.log(`   Vendor JS files: ${vendorChunks.length}`);
    console.log(`   Vendor source maps: ${vendorMaps.length}`);

    // Verify each JS file has a corresponding source map
    const missingMaps = [];
    for (const jsFile of jsFiles) {
      const expectedMapFile = jsFile + '.map';
      if (!mapFiles.includes(expectedMapFile)) {
        missingMaps.push(jsFile);
      }
    }

    if (missingMaps.length === 0) {
      console.log('\n✅ All JavaScript files have corresponding source maps!');
    } else {
      console.log('\n❌ Missing source maps for:');
      missingMaps.forEach((file) => console.log(`   - ${file}`));
    }

    // Show sample source maps
    console.log('\n📋 Sample Source Maps:');
    mapFiles.slice(0, 5).forEach((file) => {
      console.log(`   - ${file}`);
    });

    // Check for large vendor chunks (Lighthouse concern)
    const largeChunks = [];
    for (const jsFile of jsFiles) {
      const filePath = join(CHUNKS_DIR, jsFile);
      const stats = await stat(filePath);
      if (stats.size > 100000) {
        // 100KB+
        largeChunks.push({ file: jsFile, size: Math.round(stats.size / 1024) });
      }
    }

    if (largeChunks.length > 0) {
      console.log('\n📦 Large Chunks (>100KB) with Source Maps:');
      largeChunks.forEach(({ file, size }) => {
        const hasMap = mapFiles.includes(file + '.map');
        console.log(`   - ${file} (${size}KB) ${hasMap ? '✅' : '❌'}`);
      });
    }

    console.log('\n🚀 Source map verification complete!');
    console.log('\n💡 Tips for deployment:');
    console.log('   - Ensure _headers file is deployed with your static files');
    console.log(
      '   - Source maps will help with debugging and Lighthouse scores'
    );
    console.log('   - Maps are cached for 7 days as configured in _headers');
    console.log(
      '   - Run "bun run build:verify" to build and verify source maps'
    );
    console.log(
      '   - This addresses the Lighthouse "Large JavaScript file is missing a source map" audit'
    );
  } catch (error) {
    console.error('❌ Error verifying source maps:', error.message);
    console.log('\n💡 Make sure to run "bun run build" first');
    process.exit(1);
  }
}

checkSourceMaps();
