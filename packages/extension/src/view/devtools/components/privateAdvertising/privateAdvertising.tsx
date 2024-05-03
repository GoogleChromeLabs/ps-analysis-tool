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
import { ContentPanel, LandingPage } from '@ps-analysis-tool/design-system';

const content = [
  {
    title: 'Protected Audience',
    description:
      'The Protected Audience API serves remarketing and custom audience use cases without third party cross-site tracking.',
  },
  {
    title: 'Attribution Reporting',
    description:
      'The Attribution Reporting API enables measurement of ad performance without third party cross-site tracking.',
  },
  {
    title: 'Private Aggregation',
    description:
      'The Private Aggregation API has been built for aggregating and reporting on cross-site data in a privacy-preserving manner.',
  },
  {
    title: 'Topics',
    description:
      'The Topics API enables interest-based advertising while preserving user privacy.',
  },
];

const PrivateAdvertising = () => {
  return (
    <LandingPage
      title="Private Advertising"
      extraClasses="min-h-[78vh] w-full"
      contentPanel={
        <ContentPanel
          title="Enable your critical advertising use cases without relying on cross-site tracking via APIs providing accurate relevance information and and measurement data for digital ads."
          content={content}
          counterStyles="bg-blue-600"
          titleStyles="text-blue-600"
        />
      }
    />
  );
};

export default PrivateAdvertising;
