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

/**
 * External Dependencies
 */
import {
  SIDEBAR_ITEMS_KEYS,
  PSTrackingProtectionIcon,
  PSSiteBoundriesIcon,
  PSPrivateAdvertisingIcon,
  PSLearningIcon,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

export const PRIVACY_SANDBOX_LANDINGE_PAGE_BOXES = [
  {
    name: I18n.getMessage('trackingProtection'),
    icon: PSTrackingProtectionIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING,
    description: 'Limit covert tracking techniques.',
    url: 'https://privacysandbox.google.com/protections',
    buttons: [
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
    description: 'Prevent unintended data sharing across sites.',
    url: 'https://privacysandbox.google.com/cookies',
    buttons: [
      {
        name: 'Cookies',
        sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
      },
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
    url: 'https://privacysandbox.google.com/private-advertising',
    icon: PSPrivateAdvertisingIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_ADVERTISING,
    description: 'Privacy-preserving relevance and measurement APIs.',
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
    description: 'Learn everything about the Privacy Sandbox.',
    url: 'https://privacysandbox.google.com',
    buttons: [
      {
        name: 'Help Center',
        sidebarKey: SIDEBAR_ITEMS_KEYS.HELP_CENTER,
      },
      {
        name: 'Dev Site',
        sidebarKey: SIDEBAR_ITEMS_KEYS.DEV_SITE,
      },
      {
        name: 'Stories',
        sidebarKey: SIDEBAR_ITEMS_KEYS.STORIES,
      },
      {
        name: 'Demos',
        sidebarKey: SIDEBAR_ITEMS_KEYS.DEMOS,
      },
      {
        name: 'PSAT Wiki',
        sidebarKey: SIDEBAR_ITEMS_KEYS.WIKI,
      },
    ],
  },
];

export const PRIVACY_PROTECTION_CONTENT = [
  {
    title: () => I18n.getMessage('ipProtection'),
    description: () => I18n.getMessage('ipProtectionDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/ip-protection',
    storyUrl: 'https://privacysandbox-stories.com/web-stories/ip-protection/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.IP_PROTECTION,
  },
  {
    title: () => I18n.getMessage('bounceTrackingMitigations'),
    description: () => I18n.getMessage('bounceTrackingMitigationsDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/bounce-tracking-mitigations',
    storyUrl:
      'https://privacysandbox-stories.com/web-stories/bounce-tracking-mitigations/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING,
  },
  {
    title: () => I18n.getMessage('userAgentReduction'),
    description: () => I18n.getMessage('userAgentReductionDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/user-agent',
    storyUrl:
      'https://privacysandbox-stories.com/web-stories/user-agent-reduction/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.FINGERPRINTING,
  },
  {
    title: () => I18n.getMessage('privateStateTokens'),
    description: () => I18n.getMessage('privateStateTokensDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/private-state-tokens',
    storyUrl:
      'https://privacysandbox-stories.com/web-stories/private-state-tokens/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.PRIVATE_STATE_TOKENS,
  },
];
