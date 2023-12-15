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
 * External dependencies.
 */
import { type Cookie as ParsedCookie } from 'simple-cookie';
import { TabCookies, TabFrames } from '@ps-analysis-tool/common';

export const emptyAnalytics = {
  platform: '',
  category: 'Uncategorized',
  name: '',
  domain: '',
  description: '',
  retention: '',
  dataController: '',
  gdprUrl: '',
  wildcard: '',
};

const emptyCookie = {
  name: '',
  value: '',
  domain: '',
  samesite: '',
  secure: false,
  httponly: false,
  path: '',
  expires: '',
};

export const uncategorized1pCookie: ParsedCookie = {
  ...emptyCookie,
  name: '_cb',
  value: 'v1%3A168740954476563235',
  domain: '.cnn.com',
};

export const uncategorized3pCookie: ParsedCookie = {
  ...emptyCookie,
  name: 'pubsyncexp',
  value: 'uncategorized3pCookie',
  domain: '.ads.pubmatic.com',
};

export const known1pCookie: ParsedCookie = {
  ...emptyCookie,
  name: '__qca',
  value: 'known1pCookie',
  domain: '.cnn.com',
};

export const known3pCookie: ParsedCookie = {
  ...emptyCookie,
  name: 'KRTBCOOKIE_290',
  value: 'known3pCookie',
  domain: '.pubmatic.com',
};

export const known3pCookieWithValue: ParsedCookie = {
  ...emptyCookie,
  name: 'KRTBCOOKIE_290',
  value: 'known3p_Cookie-with%20value',
  domain: '.pubmatic.com',
};

const data: {
  tabCookies: TabCookies;
  tabUrl: string;
  tabFrames: TabFrames;
  selectedFrame: string;
} = {
  tabCookies: {
    [uncategorized1pCookie.name]: {
      parsedCookie: uncategorized1pCookie,
      analytics: { ...emptyAnalytics },
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
      isFirstParty: true,
      isBlocked: false,
      frameIdList: [1],
    },
    [uncategorized3pCookie.name]: {
      parsedCookie: uncategorized3pCookie,
      analytics: { ...emptyAnalytics },
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
      isFirstParty: false,
      isBlocked: false,
      frameIdList: [1],
    },
    [known1pCookie.name]: {
      parsedCookie: known1pCookie,
      analytics: {
        platform: 'Quantcast',
        category: 'Marketing',
        name: '__qca',
        domain: "Advertiser's website domain",
        description:
          'This cookie is set by Quantcast, who present targeted advertising. Stores browser and HTTP request information.',
        retention: '1 year',
        dataController: 'Quantcast',
        gdprUrl: 'https://www.quantcast.com/privacy/',
        wildcard: '0',
      },
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
      isFirstParty: true,
      isBlocked: false,
      frameIdList: [1],
    },
    [known3pCookie.name]: {
      parsedCookie: known3pCookie,
      analytics: {
        platform: 'PubMatic',
        category: 'Marketing',
        name: 'KRTBCOOKIE_*',
        domain: 'pubmatic.com',
        description:
          "Registers a unique ID that identifies the user's device during return visits across websites that use the same ad network. The ID is used to allow targeted ads.",
        retention: '29 days',
        dataController: 'Pubmatic',
        gdprUrl: 'N/A',
        wildcard: '1',
      },
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
      isFirstParty: false,
      isBlocked: false,
      frameIdList: [1],
    },
    [known3pCookieWithValue.name]: {
      parsedCookie: known3pCookieWithValue,
      analytics: {
        platform: 'PubMatic',
        category: 'Marketing',
        name: 'KRTBCOOKIE_*',
        domain: 'pubmatic.com',
        description:
          "Registers a unique ID that identifies the user's device during return visits across websites that use the same ad network. The ID is used to allow targeted ads.",
        retention: '29 days',
        dataController: 'Pubmatic',
        gdprUrl: 'N/A',
        wildcard: '1',
      },
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
      isFirstParty: false,
      isBlocked: false,
      frameIdList: [1],
    },
  },
  tabUrl: 'https://edition.cnn.com/',
  tabFrames: {
    'https://edition.cnn.com/': {
      frameIds: [1],
    },
  },
  selectedFrame: 'https://edition.cnn.com/',
};

export default data;
