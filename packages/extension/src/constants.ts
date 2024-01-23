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
      'The Chrome DevTools Protocol allows for tools to instrument, inspect, debug and profile Chromium, Chrome and other Blink-based browsers.',
  },
  {
    id: 'multitabDebugging',
    heading: 'Multitab Debugging',
    description:
      "By default, the PSAT tool analyzes one tab at a time. You can enable multi-tab debugging by toggling the appropriate option. However, be aware that this may slow down the extension's performance",
  },
];
