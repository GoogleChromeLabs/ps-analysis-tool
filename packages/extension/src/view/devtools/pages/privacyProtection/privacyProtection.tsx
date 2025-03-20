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
 * External Dependencies
 */
import React from 'react';
import {
  LandingPageContainer,
  SIDEBAR_ITEMS_KEYS,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

const content = [
  {
    title: () => 'Cookies',
    description: () =>
      'Insights into the distribution and behavior of cookies on web pages while users navigate across sites during browsing sessions.',
    url: 'https://developers.google.com/privacy-sandbox/cookies',
    storyUrl:
      'https://privacysandbox-stories.com/web-stories/chrome-shifts-to-user-choice-for-third-party-cookies/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.COOKIES,
  },
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

const PrivacyProtection = () => {
  return (
    <LandingPageContainer
      title="Privacy Protection"
      extraClasses="min-h-[78vh] w-full"
      contentPanelTitle={I18n.getMessage('antiCovertTrackingDescription')}
      content={content}
      counterStyles="bg-blue-600"
      titleStyles="text-blue-600"
    />
  );
};

export default PrivacyProtection;
