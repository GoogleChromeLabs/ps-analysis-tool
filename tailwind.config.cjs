/*
 * Copyright 2023 Google LLC
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

const path = require('path');

module.exports = {
  darkMode: 'class',
  content: [
    path.resolve(__dirname, './packages/extension/src/**/*.{tsx,ts,js}'),
    path.resolve(__dirname, './packages/design-system/src/**/*.{tsx,ts,js}'),
    path.resolve(__dirname, './packages/cli-dashboard/src/**/*.{tsx,ts,js}'),
    path.resolve(__dirname, './packages/report/src/**/*.{tsx,ts,js}'),
  ],
};
