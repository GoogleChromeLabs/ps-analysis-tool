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
import { ContentPanel, LandingPage } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

const content = [
  {
    title: () => I18n.getMessage('ipProtection'),
    description: () => I18n.getMessage('ipProtectionDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/ip-protection',
  },
  {
    title: () => I18n.getMessage('bounceTrackingMitigations'),
    description: () => I18n.getMessage('bounceTrackingMitigationsDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/bounce-tracking-mitigations',
  },
  {
    title: () => I18n.getMessage('privacyBudget'),
    description: () => I18n.getMessage('privacyBudgetDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/privacy-budget',
  },
  {
    title: () => I18n.getMessage('userAgentReduction'),
    description: () => I18n.getMessage('userAgentReductionDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/user-agent',
  },
  {
    title: () => I18n.getMessage('privateStateTokens'),
    description: () => I18n.getMessage('privateStateTokensDescription'),
    url: 'https://developers.google.com/privacy-sandbox/protections/private-state-tokens',
  },
];

const AntiCovertTracking = () => {
  return (
    <LandingPage
      title={I18n.getMessage('trackingProtection')}
      extraClasses="min-h-[78vh] w-full"
      contentPanel={
        <ContentPanel
          title={I18n.getMessage('antiCovertTrackingDescription')}
          content={content}
          counterStyles="bg-yellow-500"
          titleStyles="text-yellow-500"
        />
      }
    />
  );
};

export default AntiCovertTracking;
