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
  TopicsIcon,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

export const PINNED_ITEMS = [
  {
    name: I18n.getMessage('protectedAudience'),
    icon: GroupsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
  },
  {
    name: I18n.getMessage('cookies'),
    icon: CookieIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
  },
  {
    name: I18n.getMessage('rws'),
    icon: RelatedWebsiteSetsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
  },
  {
    name: I18n.getMessage('topics'),
    icon: TopicsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.TOPICS,
  },
];

export const FEATURE_LIST = [
  {
    name: I18n.getMessage('cookies'),
    icon: CookieIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
    description:
      'Gain insights into the behavior and distribution of cookies on web pages while navigating across sites during browsing sessions.',
    buttons: [
      {
        name: 'Insights',
        sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
      },
    ],
  },
  {
    name: I18n.getMessage('privateAdvertising'),
    icon: PrivateAdvertisingIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_ADVERTISING,
    description: I18n.getMessage('privateAdvertisingDescription'),
    colorClasses: {
      heading: 'text-blue-600',
    },
    buttons: [
      {
        name: I18n.getMessage('topics'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.TOPICS,
      },
      {
        name: I18n.getMessage('attribution'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.ATTRIBUTION_REPORTING,
      },
      {
        name: I18n.getMessage('protectedAudience'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
      },
      {
        name: I18n.getMessage('privateAggregation'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_AGGREGATION,
      },
    ],
  },
  {
    name: I18n.getMessage('trackingProtection'),
    icon: AntiCovertTrackingIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING,
    description: I18n.getMessage('antiCovertTrackingDescription'),
    colorClasses: {
      heading: 'text-yellow-500',
    },
    buttons: [
      {
        name: I18n.getMessage('bounceTracking'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING,
      },
      {
        name: I18n.getMessage('fingerprinting'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.FINGERPRINTING,
      },
    ],
  },
  {
    name: I18n.getMessage('siteBoundaries'),
    icon: SiteBoundariesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES,
    description: I18n.getMessage('siteBoundariesDescription'),
    colorClasses: {
      heading: 'text-green-700',
    },
    buttons: [
      {
        name: I18n.getMessage('chips'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.CHIPS,
      },
      {
        name: I18n.getMessage('rws'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
      },
    ],
  },
];
