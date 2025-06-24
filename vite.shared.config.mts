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
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'node:fs';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagesDir = resolve(__dirname, 'packages');
const aliases = readdirSync(packagesDir).map((name) => ({
  find: `@google-psat/${name}`,
  replacement: resolve(packagesDir, name, 'src'),
}));

export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: aliases,
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});

export { __dirname };
