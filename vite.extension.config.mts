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
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.shared.config.mjs';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

const page = process.env.PAGE;
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig(() => {
  const commonConfig = mergeConfig(baseConfig, {
    base: '', // important to make sure the paths are correct in output index.html
    build: {
      emptyOutDir: false, // don't empty the output directory, output folder is re-used
      outDir: `../../../../../dist/extension/${page}`,
      minify: !isDev,
      rollupOptions: {
        external: ['p5'],
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: '../../manifest.json',
            dest: '../',
          },
          {
            src: '../../../icons',
            dest: '../',
          },
          {
            src: '../../../../../assets',
            dest: '../',
          },
          {
            src: '../../../../../data',
            dest: '../',
          },
          {
            src: '../../../../i18n/_locales/messages/*',
            dest: '../_locales/',
          },
        ],
      }),
    ],
  });

  if (page === 'popup') {
    return mergeConfig(commonConfig, {
      root: path.resolve(__dirname, 'packages/extension/src/view/popup'),
      build: {
        rollupOptions: {
          input: {
            popup: 'src/view/popup/index.html',
          },
        },
      },
    });
  }

  if (page === 'report') {
    return mergeConfig(commonConfig, {
      root: path.resolve(__dirname, 'packages/extension/src/view/report'),
      build: {
        outDir: `../../../../../dist/extension/devtools`,
        rollupOptions: {
          input: {
            dashboard: './src/view/report/dashboard.html',
          },
        },
      },
      plugins: [viteSingleFile()],
    });
  }

  // devtools
  return mergeConfig(commonConfig, {
    root: path.resolve(__dirname, 'packages/extension/src/view/devtools'),
    build: {
      watch: isDev ? {} : null,
      rollupOptions: {
        input: {
          devtools: './src/view/devtools/devtools.html',
          index: './src/view/devtools/index.html',
        },
      },
    },
    plugins: [
      viteStaticCopy({
        // use this file instead public folder to make sure we use the same version across the app
        // P5 need to be added as separated script due to issues with ESM and strict mode
        targets: [
          {
            src: '../../../../../node_modules/p5/lib/p5.min.js',
            dest: './',
          },
        ],
      }),
    ],
  });
});
