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
  SIDEBAR_ITEMS_KEYS,
  TopicsIcon,
  AttributionIcon,
  PSSiteBoundriesIcon,
  PSPrivateAdvertisingIcon,
  PSTrackingProtectionIcon,
  PSLearningIcon,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

export const PINNED_ITEMS = [
  {
    name: I18n.getMessage('protectedAudience'),
    icon: GroupsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
  },
  {
    name: I18n.getMessage('attributionReporting'),
    icon: AttributionIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.ATTRIBUTION_REPORTING,
  },
  {
    name: I18n.getMessage('topics'),
    icon: TopicsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.TOPICS,
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
];

export const FEATURE_LIST = [
  {
    name: I18n.getMessage('trackingProtection'),
    icon: PSTrackingProtectionIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING,
    description:
      'Features and capabilities designed to limit specific covert tracking techniques such as fingerprinting and network-level tracking.',
    buttons: [
      {
        name: 'Cookies',
        sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
      },
      {
        name: 'IP Protection',
        sidebarKey: SIDEBAR_ITEMS_KEYS.IP_PROTECTION,
      },
      {
        name: I18n.getMessage('bounceTracking'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING,
      },
      {
        name: 'User Agent Reduction',
        sidebarKey: SIDEBAR_ITEMS_KEYS.FINGERPRINTING,
      },
      {
        name: 'Private State Tokens',
        sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_STATE_TOKENS,
      },
    ],
  },
  {
    name: I18n.getMessage('siteBoundaries'),
    icon: PSSiteBoundriesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES,
    description: I18n.getMessage('siteBoundariesDescription'),
    buttons: [
      {
        name: I18n.getMessage('chips'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.CHIPS,
      },
      {
        name: 'Storage Access API',
        sidebarKey: SIDEBAR_ITEMS_KEYS.STORAGE_ACCESS,
      },
      {
        name: I18n.getMessage('rws'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
      },
      {
        name: 'FedCM',
        sidebarKey: SIDEBAR_ITEMS_KEYS.FEDERATED_CREDENTIAL,
      },
    ],
  },
  {
    name: I18n.getMessage('privateAdvertising'),
    icon: PSPrivateAdvertisingIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_ADVERTISING,
    description:
      'Private-preserving APIs supporting critical advertising use cases without relying on cross-site tracking, while providing accurate relevance information and measurement data for digital ads.',
    buttons: [
      {
        name: I18n.getMessage('topics'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.TOPICS,
      },
      {
        name: I18n.getMessage('protectedAudience'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
      },
      {
        name: 'Attribution Reporting',
        sidebarKey: SIDEBAR_ITEMS_KEYS.ATTRIBUTION_REPORTING,
      },
      {
        name: I18n.getMessage('privateAggregation'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_AGGREGATION,
      },
    ],
  },
  {
    name: 'Learning',
    icon: PSLearningIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.LEARNING,
    description:
      'Explore and learn everything about the Privacy Sandbox via the Help Center, developer documentation, and Stories, and learn about PSAT via the wiki.',
    buttons: [
      {
        name: 'Wiki',
        sidebarKey: SIDEBAR_ITEMS_KEYS.WIKI,
      },
      {
        name: 'Stories',
        sidebarKey: SIDEBAR_ITEMS_KEYS.STORIES,
      },
      {
        name: 'Help Center',
        sidebarKey: SIDEBAR_ITEMS_KEYS.HELP_CENTER,
      },
      {
        name: 'Dev Site',
        sidebarKey: SIDEBAR_ITEMS_KEYS.DEV_SITE,
      },
    ],
  },
];
