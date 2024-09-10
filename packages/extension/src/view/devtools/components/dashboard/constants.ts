/*
 * Copyright 2024 Google LLC
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
 * External dependencies.
 */
import {
  GroupsIcon,
  CookieIcon,
  RelatedWebsiteSetsIcon,
  AntiCovertTrackingIcon,
  SiteBoundariesIcon,
  SIDEBAR_ITEMS_KEYS,
  PrivateAdvertisingIcon,
} from '@google-psat/design-system';

export const PINNED_ITEMS = [
  {
    name: 'Protected Audience',
    icon: GroupsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
  },
  {
    name: 'Cookies',
    icon: CookieIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
  },
  {
    name: 'Related Website Sets',
    icon: RelatedWebsiteSetsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
  },
];

export const FEATURE_LIST = [
  {
    name: 'Cookies',
    icon: CookieIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
    description:
      'Gain insights into the behavior and distribution of cookies on web pages while navigating across sites during browsing sessions.',
    buttons: [
      {
        name: 'Landing Page',
        sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
      },
    ],
  },
  {
    name: 'Private Advertising',
    icon: PrivateAdvertisingIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_ADVERTISING,
    description:
      'Enable your critical advertising use cases without relying on cross-site tracking via APIs providing accurate relevance information and and measurement data for digital ads.',
    colorClasses: {
      heading: 'text-blue-600',
    },
    buttons: [
      {
        name: 'Topics',
        sidebarKey: SIDEBAR_ITEMS_KEYS.TOPICS,
      },
      {
        name: 'Attribution',
        sidebarKey: SIDEBAR_ITEMS_KEYS.ATTRIBUTION_REPORTING,
      },
      {
        name: 'Protected Audience',
        sidebarKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
      },
      {
        name: 'Private Aggregation',
        sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_AGGREGATION,
      },
    ],
  },
  {
    name: 'Tracking Protection',
    icon: AntiCovertTrackingIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING,
    description:
      'The Privacy Sandbox initiative also includes efforts designed to limit covert tracking, including addressing specific covert tracking techniques such as fingerprinting and network-level tracking.',
    colorClasses: {
      heading: 'text-yellow-500',
    },
    buttons: [
      {
        name: 'Bounce Tracking',
        sidebarKey: SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING,
      },
      {
        name: 'Fingerprinting',
        sidebarKey: SIDEBAR_ITEMS_KEYS.FINGERPRINTING,
      },
    ],
  },
  {
    name: 'Site Boundaries',
    icon: SiteBoundariesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES,
    description:
      'Privacy-preserving APIs ensuring that information collected on one site is not automatically shared with another site, unless the user explicitly consents.',
    colorClasses: {
      heading: 'text-green-700',
    },
    buttons: [
      {
        name: 'CHIPS',
        sidebarKey: SIDEBAR_ITEMS_KEYS.CHIPS,
      },
      {
        name: 'Related Website Sets',
        sidebarKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
      },
    ],
  },
];
