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
  PSHelpCenterIcon,
  PSDevSiteIcon,
  PSStoriesIcon,
  PSDemosIcon,
  PSWikiIcon,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

const LINKS = {
  IP_PROTECTION: {
    doc: 'https://developers.google.com/privacy-sandbox/protections/ip-protection',
    story: 'https://privacysandbox-stories.com/web-stories/ip-protection/',
  },
  BOUNCE_TRACKING: {
    doc: 'https://developers.google.com/privacy-sandbox/protections/bounce-tracking',
    story:
      'https://privacysandbox-stories.com/web-stories/bounce-tracking-mitigations/',
  },
  USER_AGENT_REDUCTION: {
    doc: 'https://developers.google.com/privacy-sandbox/protections/user-agent-reduction',
    story:
      'https://privacysandbox-stories.com/web-stories/user-agent-reduction/',
  },
  PRIVATE_STATE_TOKENS: {
    doc: 'https://developers.google.com/privacy-sandbox/protections/private-state-tokens',
    story:
      'https://privacysandbox-stories.com/web-stories/private-state-tokens/',
  },
  TOPICS: {
    doc: 'https://developers.google.com/privacy-sandbox/relevance/topics',
    story: 'https://privacysandbox-stories.com/web-stories/the-topics-api/',
  },
  PROTECTED_AUDIENCE: {
    doc: 'https://developers.google.com/privacy-sandbox/relevance/protected-audience',
    story:
      'https://privacysandbox-stories.com/web-stories/the-protected-audience-api/',
  },
  ATTRIBUTION_REPORTING: {
    doc: 'https://developers.google.com/privacy-sandbox/relevance/attribution-reporting',
    story:
      'https://privacysandbox-stories.com/web-stories/the-attribution-reporting-api/',
  },
  PRIVATE_AGGREGATION: {
    doc: 'https://developers.google.com/privacy-sandbox/relevance/private-aggregation',
    story:
      'https://privacysandbox-stories.com/web-stories/private-aggregation-api/',
  },
  COOKIES: {
    doc: 'https://developers.google.com/privacy-sandbox/cookies',
    story:
      'https://privacysandbox-stories.com/web-stories/chrome-shifts-to-user-choice-for-third-party-cookies/',
  },
  CHIPS: {
    doc: 'https://developers.google.com/privacy-sandbox/3pcd/chips',
    story: 'https://privacysandbox-stories.com/web-stories/chips/',
  },
  STORAGE_ACCESS: {
    doc: 'https://developers.google.com/privacy-sandbox/3pcd/storage-access-api',
    story: 'https://privacysandbox-stories.com/web-stories/storage-access-api/',
  },
  RELATED_WEBSITE_SETS: {
    doc: 'https://developers.google.com/privacy-sandbox/3pcd/related-website-sets',
    story:
      'https://privacysandbox-stories.com/web-stories/related-website-sets/',
  },
  FEDERATED_CREDENTIAL: {
    doc: 'https://developers.google.com/privacy-sandbox/3pcd/fedcm',
    story:
      'https://privacysandbox-stories.com/web-stories/federated-credential-management-api/',
  },
  PS_TRACKING_PROTECTION: {
    doc: 'https://privacysandbox.google.com/protections',
  },
  PS_SITE_BOUNDARIES: {
    doc: 'https://privacysandbox.google.com/cookies',
  },
  PS_PRIVATE_ADVERTISING: {
    doc: 'https://privacysandbox.google.com/private-advertising',
  },
  PS_LEARNING: {
    doc: 'https://privacysandbox.google.com',
  },
};

export const PRIVACY_PROTECTION_CONTENT = [
  {
    title: () => I18n.getMessage('ipProtection'),
    description: () => I18n.getMessage('ipProtectionDescription'),
    url: LINKS.IP_PROTECTION.doc,
    storyUrl: LINKS.IP_PROTECTION.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.IP_PROTECTION,
  },
  {
    title: () => I18n.getMessage('bounceTrackingMitigations'),
    description: () => I18n.getMessage('bounceTrackingMitigationsDescription'),
    url: LINKS.BOUNCE_TRACKING.doc,
    storyUrl: LINKS.BOUNCE_TRACKING.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING,
  },
  {
    title: () => I18n.getMessage('userAgentReduction'),
    description: () => I18n.getMessage('userAgentReductionDescription'),
    url: LINKS.USER_AGENT_REDUCTION.doc,
    storyUrl: LINKS.USER_AGENT_REDUCTION.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.FINGERPRINTING,
  },
  {
    title: () => I18n.getMessage('privateStateTokens'),
    description: () => I18n.getMessage('privateStateTokensDescription'),
    url: LINKS.PRIVATE_STATE_TOKENS.doc,
    storyUrl: LINKS.PRIVATE_STATE_TOKENS.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.PRIVATE_STATE_TOKENS,
  },
];

export const PRIVATE_ADVERTISING_CONTENT = [
  {
    title: () => I18n.getMessage('topics'),
    description: () => I18n.getMessage('topicsDescription'),
    url: LINKS.TOPICS.doc,
    storyUrl: LINKS.TOPICS.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.TOPICS,
  },
  {
    title: () => I18n.getMessage('protectedAudience'),
    description: () => I18n.getMessage('protectedAudienceDescription'),
    url: LINKS.PROTECTED_AUDIENCE.doc,
    storyUrl: LINKS.PROTECTED_AUDIENCE.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
  },
  {
    title: () => I18n.getMessage('attributionReporting'),
    description: () => I18n.getMessage('attributionReportingDescription'),
    url: LINKS.ATTRIBUTION_REPORTING.doc,
    storyUrl: LINKS.ATTRIBUTION_REPORTING.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.ATTRIBUTION_REPORTING,
  },
  {
    title: () => I18n.getMessage('privateAggregation'),
    description: () => I18n.getMessage('privateAggregationDescription'),
    url: LINKS.PRIVATE_AGGREGATION.doc,
    storyUrl: LINKS.PRIVATE_AGGREGATION.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.PRIVATE_AGGREGATION,
  },
];

export const SITE_BOUNDARIES_CONTENT = [
  {
    title: () => 'Cookies',
    description: () =>
      'Insights into the distribution and behavior of cookies on web pages while users navigate across sites during browsing sessions.',
    url: LINKS.COOKIES.doc,
    storyUrl: LINKS.COOKIES.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.COOKIES,
  },
  {
    title: () => I18n.getMessage('chips'),
    description: () => I18n.getMessage('chipsDescription'),
    url: LINKS.CHIPS.doc,
    storyUrl: LINKS.CHIPS.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.CHIPS,
  },
  {
    title: () => I18n.getMessage('storageAccessAPI'),
    description: () => I18n.getMessage('storageAccessAPIDescription'),
    url: LINKS.STORAGE_ACCESS.doc,
    storyUrl: LINKS.STORAGE_ACCESS.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.STORAGE_ACCESS,
  },
  {
    title: () => I18n.getMessage('rws'),
    description: () => I18n.getMessage('rwsDescription'),
    url: LINKS.RELATED_WEBSITE_SETS.doc,
    storyUrl: LINKS.RELATED_WEBSITE_SETS.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
  },
  {
    title: () => 'FedCM',
    description: () =>
      'The Federated Credential Management API enables privacy-preserving identity federation.',
    url: LINKS.FEDERATED_CREDENTIAL.doc,
    storyUrl: LINKS.FEDERATED_CREDENTIAL.story,
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.FEDERATED_CREDENTIAL,
  },
];

export const PRIVACY_SANDBOX_LANDINGE_PAGE_BOXES = [
  {
    name: I18n.getMessage('siteBoundaries'),
    icon: PSSiteBoundriesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES,
    description: 'Prevent unintended data sharing across sites.',
    url: LINKS.PS_SITE_BOUNDARIES.doc,
    buttons: [
      {
        name: 'Cookies',
        sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
      },
      {
        name: I18n.getMessage('chips'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.CHIPS,
        url: LINKS.CHIPS.doc,
      },
      {
        name: 'Storage Access API',
        sidebarKey: SIDEBAR_ITEMS_KEYS.STORAGE_ACCESS,
        url: LINKS.STORAGE_ACCESS.doc,
      },
      {
        name: I18n.getMessage('rws'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
        url: LINKS.RELATED_WEBSITE_SETS.doc,
      },
      {
        name: 'FedCM',
        sidebarKey: SIDEBAR_ITEMS_KEYS.FEDERATED_CREDENTIAL,
        url: LINKS.FEDERATED_CREDENTIAL.doc,
      },
    ],
  },
  {
    name: I18n.getMessage('privateAdvertising'),
    url: LINKS.PS_PRIVATE_ADVERTISING.doc,
    icon: PSPrivateAdvertisingIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_ADVERTISING,
    description: 'Privacy-preserving relevance and measurement APIs.',
    buttons: [
      {
        name: I18n.getMessage('topics'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.TOPICS,
        url: LINKS.TOPICS.doc,
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
        url: LINKS.PRIVATE_AGGREGATION.doc,
      },
    ],
  },
  {
    name: I18n.getMessage('trackingProtection'),
    icon: PSTrackingProtectionIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING,
    description: 'Limit covert tracking techniques.',
    url: LINKS.PS_TRACKING_PROTECTION.doc,
    buttons: [
      {
        name: 'IP Protection',
        sidebarKey: SIDEBAR_ITEMS_KEYS.IP_PROTECTION,
        url: LINKS.IP_PROTECTION.doc,
      },
      {
        name: I18n.getMessage('bounceTracking'),
        sidebarKey: SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING,
        url: LINKS.BOUNCE_TRACKING.doc,
      },
      {
        name: 'User Agent Reduction',
        sidebarKey: SIDEBAR_ITEMS_KEYS.FINGERPRINTING,
        url: LINKS.USER_AGENT_REDUCTION.doc,
      },
      {
        name: 'Private State Tokens',
        sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_STATE_TOKENS,
        url: LINKS.PRIVATE_STATE_TOKENS.doc,
      },
    ],
  },
  {
    name: 'Learning',
    icon: PSLearningIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.LEARNING,
    description: 'Learn everything about the Privacy Sandbox.',
    url: LINKS.PS_LEARNING.doc,
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

export const LEARNING_BOX_ITEMS = [
  {
    name: 'Dev Site',
    icon: PSDevSiteIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.DEV_SITE,
    title: 'Ready to start developing with the Privacy Sandbox?',
    description:
      'Privacy Sandbox Dev Site is your central hub for all developer resources.  Dive deep into comprehensive documentation covering every aspect of the Privacy Sandbox, from foundational concepts to advanced API usage.  Go on exploring in the current browser tab to the left.',
    colorClasses: {
      heading: 'text-red-700',
    },
  },
  {
    name: 'Help Center',
    icon: PSHelpCenterIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.HELP_CENTER,
    title: 'Need help with Privacy Sandbox?',
    description:
      'The Privacy Sandbox Help Center is your comprehensive resource for finding quick answers and effective learning. Explore a wealth of information, FAQs, and guidance directly in the current browser tab to the left.',
  },
  {
    name: 'Stories',
    icon: PSStoriesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.STORIES,
    description:
      'Explore interactive web stories to grasp the fundamental concepts of the Privacy Sandbox and its impact on the web.',
    colorClasses: {
      heading: 'text-yellow-500',
    },
  },
  {
    name: 'Demos',
    icon: PSDemosIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.DEMOS,
    title: 'Want to see Privacy Sandbox APIs in action?',
    description:
      'Explore and test Privacy Sandbox APIs firsthand using the PSAT extension. Gain hands-on insights by interacting with real-world scenarios and experimenting directly within your browser.',
    colorClasses: {
      heading: 'text-green-700',
    },
  },
  {
    name: 'Wiki',
    icon: PSWikiIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.WIKI,
    title: 'Looking for in-depth guidance on using PSAT?',
    description:
      "The PSAT Wiki Page is your dedicated resource where you'll find detailed explanations of the extension's features, practical guidance on how to leverage its tools effectively, and answers to frequently asked questions about its functionality.  Explore the PSAT Wiki in the current browser tab to the left of PSAT.",
    colorClasses: {
      heading: 'text-blue-600',
    },
  },
];
