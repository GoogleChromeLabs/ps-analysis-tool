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

const page = process.env.PAGE;
const isDev = process.env.DEV === 'true';

export default defineConfig(() => {
  if (page === 'root') {
    return mergeConfig(baseConfig, {
      sourcemap: isDev,
      build: {
        outDir: `../../dist/extension`,
        rollupOptions: {
          input: {
            'service-worker': 'src/serviceWorker/index.ts',
            'content-script': 'src/contentScript/index.ts',
            'js-cookie-content-script': 'src/contentScript/jsCookie.ts',
          },
          output: {
            entryFileNames: '[name].js',
          },
        },
      },
    });
  }

  const commonConfig = mergeConfig(baseConfig, {
    base: '', // important to make sure the paths are correct
    build: {
      outDir: `../../../../../dist/extension/${page}`,
      sourcemap: isDev,
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
        rollupOptions: {
          input: {
            dashboard: './src/view/report/dashboard.html',
          },
        },
      },
    });
  }

  return mergeConfig(commonConfig, {
    root: path.resolve(__dirname, 'packages/extension/src/view/devtools'),
    build: {
      rollupOptions: {
        input: {
          devtools: './src/view/devtools/devtools.html',
          index: './src/view/devtools/index.html',
        },
      },
    },
  });
});
