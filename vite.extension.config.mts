/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { build, defineConfig, mergeConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';

import baseConfig from './vite.shared.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';
const distDir = path.resolve(__dirname, 'dist/extension');

const runBuilds = async () => {
  const scripts = [
    {
      name: 'service-worker',
      path: 'src/serviceWorker/index.ts',
      format: 'es',
    },
    {
      name: 'content-script',
      path: 'src/contentScript/index.ts',
      format: 'iife',
    },
    {
      name: 'js-cookie-content-script',
      path: 'src/contentScript/jsCookie.ts',
      format: 'iife',
    },
    {
      name: 'prebid-content-script',
      path: 'src/contentScript/prebid/prebidContentScript.ts',
      format: 'iife',
    },
    {
      name: 'prebid-interface',
      path: 'src/contentScript/prebid/prebidInterface.tsx',
      format: 'iife',
    },
  ];

  for (const script of scripts) {
    // eslint-disable-next-line no-await-in-loop
    await build(
      mergeConfig(baseConfig, {
        build: {
          watch: isDev ? {} : null,
          emptyOutDir: false,
          target: 'esnext',
          outDir: distDir,
          minify: !isDev ? 'terser' : false,
          rollupOptions: {
            input: {
              [script.name]: path.resolve(
                __dirname,
                'packages/extension',
                script.path
              ),
            },
            output: {
              format: script.format,
              entryFileNames: '[name].js',
            },
          },
        },
      })
    );
  }

  // 2. Build UI Components (Popup, DevTools, Report, etc.)
  const uiTargets = [
    // Popup Page
    {
      root: 'packages/extension/src/view/popup',
      outDir: path.join(distDir, 'popup'),
      input: { popup: 'src/view/popup/index.html' },
      watch: isDev ? {} : null,
    },
    // DevTools Panel UI
    {
      root: 'packages/extension/src/view/devtools',
      outDir: path.join(distDir, 'devtools'),
      input: { index: './src/view/devtools/index.html' },
      watch: isDev ? {} : null,
    },
    // Report Page (inlined into a single file)
    {
      root: 'packages/extension/src/view/report',
      outDir: path.join(distDir, 'devtools'),
      input: { dashboard: './src/view/report/dashboard.html' },
      plugins: [viteSingleFile()],
    },
    // DevTools setup page and static asset copying
    {
      root: 'packages/extension/src/view/devtools',
      outDir: path.join(distDir, 'devtools'),
      input: { devtools: './src/view/devtools/devtools.html' },
      watch: isDev ? {} : null,
      plugins: [
        viteStaticCopy({
          targets: [
            { src: '../../manifest.json', dest: '../' },
            { src: '../../../icons', dest: '../' },
            { src: '../../../../../assets', dest: '../' },
            { src: '../../../../../data', dest: '../' },
            {
              src: '../../../../i18n/_locales/messages/*',
              dest: '../_locales/',
            },
            { src: '../../../../../node_modules/p5/lib/p5.min.js', dest: './' },
          ],
        }),
      ],
    },
  ];

  for (const target of uiTargets) {
    // eslint-disable-next-line no-await-in-loop
    await build(
      mergeConfig(baseConfig, {
        root: path.resolve(__dirname, target.root),
        base: '', // Ensures correct asset paths in HTML
        build: {
          watch: target.watch || null,
          emptyOutDir: false,
          sourcemap: isDev ? true : false,
          outDir: target.outDir,
          minify: !isDev,
          rollupOptions: {
            input: target.input,
          },
        },
        plugins: target.plugins || [],
      })
    );
  }
};

(async () => {
  try {
    await runBuilds();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Build failed:', error);
    process.exit(1);
  }
})();

export default defineConfig({});
