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
import { mergeConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

// eslint-disable-next-line import/no-relative-packages
import baseConfig from './vite.shared.config.mjs';

export default mergeConfig(baseConfig, {
  root: path.resolve(__dirname, 'packages/cli-dashboard'),
  build: {
    outDir: './dist',
    rollupOptions: {
      input: {
        index: './index.html',
      },
    },
  },
  plugins: [
    viteSingleFile(),
    viteStaticCopy({
      targets: [
        {
          src: '../i18n/_locales/messages/*',
          dest: './dist/_locales/',
        },
      ],
    }),
  ],
});
