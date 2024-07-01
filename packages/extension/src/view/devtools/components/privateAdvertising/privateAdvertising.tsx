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
    title: () => I18n.getMessage('protectedAudience'),
    description: () => I18n.getMessage('protectedAudienceDescription'),
    url: 'https://developers.google.com/privacy-sandbox/relevance/protected-audience',
  },
  {
    title: () => I18n.getMessage('attributionReporting'),
    description: () => I18n.getMessage('attributionReportingDescription'),
    url: 'https://developers.google.com/privacy-sandbox/relevance/attribution-reporting',
  },
  {
    title: () => I18n.getMessage('privateAggregation'),
    description: () => I18n.getMessage('privateAggregationDescription'),
    url: 'https://developers.google.com/privacy-sandbox/relevance/private-aggregation',
  },
  {
    title: () => I18n.getMessage('topics'),
    description: () => I18n.getMessage('topicsDescription'),
    url: 'https://developers.google.com/privacy-sandbox/relevance/topics',
  },
];

const PrivateAdvertising = () => {
  return (
    <LandingPage
      title={I18n.getMessage('privateAdvertising')}
      extraClasses="min-h-[78vh] w-full"
      contentPanel={
        <ContentPanel
          title={I18n.getMessage('privateAdvertisingDescription')}
          content={content}
          counterStyles="bg-blue-600"
          titleStyles="text-blue-600"
        />
      }
    />
  );
};

export default PrivateAdvertising;
