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
 * External dependencies
 */
import {
  CookieIcon,
  CookieIconWhite,
  SIDEBAR_ITEMS_KEYS,
  type SidebarItems,
} from '@ps-analysis-tool/design-system';

const sidebarData: SidebarItems = {
  [SIDEBAR_ITEMS_KEYS.COOKIES]: {
    title: 'Sitemap Report',
    children: {},
    dropdownOpen: true,
  },
  [SIDEBAR_ITEMS_KEYS.COOKIES_WITH_ISSUES]: {
    title: 'Cookies With Issues',
    children: {},
    icon: {
      Element: CookieIcon,
    },
    selectedIcon: {
      Element: CookieIconWhite,
    },
  },
};

export default sidebarData;
