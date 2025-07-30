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
/**
 * External dependencies:
 */
import { build, defineConfig, mergeConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

/**
 * Internal dependencies:
 */
import baseConfig, { __dirname } from './vite.shared.config.mjs';

const isDev = process.env.NODE_ENV === 'development';

type Script = {
  name: string;
  path: string;
  // all content scripts must be in iife format
  format: 'es' | 'iife';
};

// content scripts and worker defined in the manifest.json
const scripts: Script[] = [
  {
    name: 'service-worker',
    path: 'src/serviceWorker/index.ts',
    format: 'es', // defined as module in manifest.json
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
] as const;

const createScriptConfig = (script: (typeof scripts)[number]) => {
  let minifier: boolean | 'terser' = 'terser';
  if (script.name === 'prebid-interface') {
    minifier = false;
  } else {
    if (isDev) {
      minifier = false;
    } else {
      minifier = 'terser';
    }
  }

  return defineConfig({
    build: {
      watch: isDev ? {} : null,
      emptyOutDir: false,
      target: 'esnext',
      outDir: `../../dist/extension`,
      minify: minifier,
      rollupOptions: {
        input: {
          [script.name]: script.path,
        },
        output: {
          format: script.format || 'iife',
          chunkFileNames: '[name].js',
          entryFileNames: '[name].js',
        },
      },
    },
  });
};

const createExtensionConfig = (target: string) => {
  const commonConfig = mergeConfig(baseConfig, {
    base: '', // important to make sure the paths are correct in output index.html
    sourcemap: isDev ? 'inline' : false,
    build: {
      emptyOutDir: false, // don't empty the output directory, output folder is re-used
      outDir: `../../../../../dist/extension/${target}`,
      minify: !isDev,
    },
  });

  if (target === 'popup') {
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

  if (target === 'report') {
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

  if (target === 'assets') {
    return mergeConfig(commonConfig, {
      root: path.resolve(__dirname, 'packages/extension/src/view/devtools'),
      build: {
        outDir: `../../../../../dist/extension/devtools`,
        rollupOptions: {
          input: {
            devtools: './src/view/devtools/devtools.html',
          },
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
            {
              src: '../../../../../node_modules/p5/lib/p5.min.js',
              dest: './',
            },
          ],
        }),
      ],
    });
  }

  if (target === 'devtools') {
    return mergeConfig(commonConfig, {
      root: path.resolve(__dirname, 'packages/extension/src/view/devtools'),
      build: {
        watch: isDev ? {} : null,
        rollupOptions: {
          input: {
            index: './src/view/devtools/index.html',
          },
        },
      },
    });
  }

  return commonConfig;
};

const start = async () => {
  // vite/rollup does not support multiple input files when using inlineDynamicImports(forced with iife)
  // so we need to create a config for each script
  for (const script of scripts) {
    // eslint-disable-next-line no-await-in-loop
    await build(createScriptConfig(script)); // run each build in queue, when `watch: true` promise will be resolved anyway after first build
  }

  for (const target of ['popup', 'report', 'assets', 'devtools']) {
    // eslint-disable-next-line no-await-in-loop
    await build(createExtensionConfig(target));
  }
};

(async () => {
  await start();
})();
