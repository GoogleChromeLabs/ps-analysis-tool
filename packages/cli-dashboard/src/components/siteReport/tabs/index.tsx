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

/**
 * Internal dependencies.
 */
import {
  CookieIcon,
  CookieIconWhite,
  SiteBoundariesIcon,
  SiteBoundariesIconWhite,
} from '@cookie-analysis-tool/design-system';
import CookiesTab from './cookies';
import TechnologiesTab from './technologies';
import AffectedCookiesTab from './affectedCookies';

export const TABS = [
  {
    display_name: 'Cookies',
    component: CookiesTab,
    id: 'cookies',
    icons: {
      default: CookieIcon,
      selected: CookieIconWhite,
    },
    parentId: undefined,
  },
  {
    display_name: 'Technologies',
    component: TechnologiesTab,
    id: 'technologies',
    icons: {
      default: SiteBoundariesIcon,
      selected: SiteBoundariesIconWhite,
    },
    parentId: undefined,
  },
  {
    display_name: 'Affected Cookies',
    component: AffectedCookiesTab,
    id: 'affected_cookies',
    icons: {
      default: SiteBoundariesIcon,
      selected: SiteBoundariesIconWhite,
    },
    parentId: undefined,
  },
];
