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
import { build, defineConfig } from 'vite';

const isDev = process.env.NODE_ENV === 'development';

// content scripts and worker defined in the manifest.json
const scripts = [
  {
    name: 'service-worker',
    path: 'src/serviceWorker/index.ts',
  },
  {
    name: 'content-script',
    path: 'src/contentScript/index.ts',
  },
  {
    name: 'js-cookie-content-script',
    path: 'src/contentScript/jsCookie.ts',
  },
  {
    name: 'prebid-content-script',
    path: 'src/contentScript/prebid/prebidContentScript.ts',
  },
  {
    name: 'prebid-interface',
    path: 'src/contentScript/prebid/prebidInterface.tsx',
  },
] as const;

const createConfig = (script: (typeof scripts)[number]) => {
  return defineConfig({
    build: {
      emptyOutDir: false,
      outDir: `../../dist/extension`,
      minify: !isDev,
      watch: isDev ? {} : null,
      rollupOptions: {
        input: {
          [script.name]: script.path,
        },
        output: {
          format: 'iife',
          chunkFileNames: '[name].js',
          entryFileNames: '[name].js',
        },
      },
    },
  });
};

// vite/rollup does not support multiple input files when using inlineDynamicImports
// so we need to create a config for each script
const start = async () => {
  for (const script of scripts) {
    // eslint-disable-next-line no-await-in-loop
    await build(createConfig(script)); // run each build in queue, when `watch: true` promise will be resolved anyway after first build
  }
};

(async () => {
  await start();
})();
