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
import {
  WikiIcon,
  WebStoriesIcon,
  DevGuideIcon,
  Help,
  SIDEBAR_ITEMS_KEYS,
  DemosIcon,
} from '@google-psat/design-system';

export const FEATURED_ITEMS = [
  {
    name: 'Help Center',
    icon: Help,
    sidebarKey: SIDEBAR_ITEMS_KEYS.HELP_CENTER,
    description:
      'Find answers to common questions, troubleshooting guides, and support at the Privacy Sandbox Help Center.',
  },
  {
    name: 'Dev Site',
    icon: DevGuideIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.DEV_SITE,
    description:
      'Access documentation, API references, and implementation guides on the Privacy Sandbox Developer site.',
    colorClasses: {
      heading: 'text-red-700',
    },
  },
  {
    name: 'Wiki',
    icon: WikiIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.WIKI,
    description:
      'Learn about the PSAT extension, its features, and usage through detailed documentation in the official Wiki.',
    colorClasses: {
      heading: 'text-blue-600',
    },
  },
  {
    name: 'Stories',
    icon: WebStoriesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.STORIES,
    description:
      'Explore interactive web stories to grasp the fundamental concepts of the Privacy Sandbox and its impact on the web.',
    colorClasses: {
      heading: 'text-yellow-500',
    },
  },
  {
    name: 'Demos',
    icon: DemosIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.DEMOS,
    description:
      'Explore and test Privacy Sandbox APIs in action using the PSAT extension for hands-on insights.',
    colorClasses: {
      heading: 'text-green-700',
    },
  },
];
