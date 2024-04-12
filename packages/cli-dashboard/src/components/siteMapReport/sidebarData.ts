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
  SIDEBAR_ITEMS_KEYS,
  WarningBare,
  type SidebarItems,
} from '@ps-analysis-tool/design-system';

const sidebarData: SidebarItems = {
  [SIDEBAR_ITEMS_KEYS.COOKIES]: {
    title: 'cdSitemapReport',
    children: {},
    dropdownOpen: true,
  },
  [SIDEBAR_ITEMS_KEYS.COOKIES_WITH_ISSUES]: {
    title: 'cdCookieIssues',
    children: {},
    icon: {
      Element: WarningBare,
      props: {
        className: 'fill-granite-gray',
      },
    },
    selectedIcon: {
      Element: WarningBare,
      props: {
        className: 'fill-white',
      },
    },
  },
};

export default sidebarData;
