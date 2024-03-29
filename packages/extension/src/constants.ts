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
export const ALLOWED_NUMBER_OF_TABS = 1;
export const WEBPAGE_PORT_NAME = 'psat-webpage';
export const DEVTOOL_PORT_NAME = 'psat-devtool';

export const SETTING_PAGE_CONTROLS = [
  {
    id: 'enableCDP',
    heading: 'Enable CDP',
    description:
      'The Chrome DevTools Protocol allows for tools to instrument, inspect, debug and profile Chromium, Chrome and other Blink-based browsers. <a class="text-bright-navy-blue dark:text-jordy-blue" href="https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/PSAT-Settings-and-Permissions#enabling-chrome-devtools-protocol-in-psat" target="_blank">Learn More.</a>',
  },
  {
    id: 'multitabDebugging',
    heading: 'Multitab Debugging',
    description:
      "The PSAT tool is designed for efficient single-tab analysis. While <a class='text-bright-navy-blue dark:text-jordy-blue' href='https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/PSAT-Settings-and-Permissions#multi-tab-debugging' target='_blank'>multi-tab debugging</a> is available for more comprehensive analysis, it is intended for examining 2-3 tabs simultaneously. Using more tabs may impact the tool's responsiveness.",
  },
];
