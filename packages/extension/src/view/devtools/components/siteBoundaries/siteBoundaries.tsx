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
    title: 'CHIPS',
    description:
      'The new cookie attribute, Partitioned, allows developers to opt a cookie into partitioned storage, with separate cookie jars per top-level site.',
    url: 'https://developers.google.com/privacy-sandbox/3pcd/chips',
  },
  {
    title: 'Storage Access API',
    description:
      'Storage Access API allows iframes to request storage access permissions when access would otherwise be denied by browser settings.',
    url: 'https://developers.google.com/privacy-sandbox/3pcd/storage-access-api',
  },
  {
    title: 'Related Website Sets',
    description:
      'Related Website Sets (RWS) is a way for a company to declare relationships among sites, so that browsers allow limited third-party cookie access for specific purposes.',
    url: 'https://developers.google.com/privacy-sandbox/3pcd/related-website-sets',
  },
  {
    title: 'Federated Credential Management API',
    description: 'A web API for privacy-preserving identity federation.',
    url: 'https://developers.google.com/privacy-sandbox/3pcd/fedcm',
  },
];

const SiteBoundaries = () => {
  return (
    <LandingPage
      title="Site Boundaries"
      contentPanel={
        <ContentPanel
          title="Privacy-preserving APIs ensuring that information collected on one site is not automatically shared with another site, unless the user explicitly consents."
          content={content}
          counterStyles="bg-green-700"
          titleStyles="text-green-700"
        />
      }
      extraClasses="min-h-[78vh] w-full"
    />
  );
};

export default SiteBoundaries;
