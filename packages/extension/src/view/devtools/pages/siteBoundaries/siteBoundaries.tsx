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
    title: () => I18n.getMessage('chips'),
    description: () => I18n.getMessage('chipsDescription'),
    url: 'https://developers.google.com/privacy-sandbox/3pcd/chips',
    storyUrl: 'https://privacysandbox-stories.com/web-stories/chips/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.CHIPS,
  },
  {
    title: () => I18n.getMessage('storageAccessAPI'),
    description: () => I18n.getMessage('storageAccessAPIDescription'),
    url: 'https://developers.google.com/privacy-sandbox/3pcd/storage-access-api',
    storyUrl:
      'https://privacysandbox-stories.com/web-stories/storage-access-api/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.STORAGE_ACCESS,
  },
  {
    title: () => I18n.getMessage('rws'),
    description: () => I18n.getMessage('rwsDescription'),
    url: 'https://developers.google.com/privacy-sandbox/3pcd/related-website-sets',
    storyUrl:
      'https://privacysandbox-stories.com/web-stories/related-website-sets/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
  },
  {
    title: () => 'FedCM',
    description: () =>
      'The Federated Credential Management API enables privacy-preserving identity federation.',
    url: 'https://developers.google.com/privacy-sandbox/3pcd/fedcm',
    storyUrl:
      'https://privacysandbox-stories.com/web-stories/federated-credential-management-api/',
    sidebarItemKey: SIDEBAR_ITEMS_KEYS.FEDERATED_CREDENTIAL,
  },
];

const SiteBoundaries = () => {
  return (
    <>
      <LandingPageContainer
        title={I18n.getMessage('siteBoundaries')}
        contentPanelTitle={I18n.getMessage('siteBoundariesDescription')}
        content={content}
        counterStyles="bg-green-700"
        titleStyles="text-green-700"
        extraClasses="min-h-[78vh] w-full"
      />
    </>
  );
};

export default SiteBoundaries;
