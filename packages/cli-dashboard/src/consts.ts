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

export const cookies = [
  {
    name: '_dd_s',
    value:
      'logs=1&id=15b35e3a-868c-44d7-bda3-2e9c24beb8f4&created=1695278089864&expire=1695278989864',
    domain: 'edition.cnn.com',
    path: '/',
    expires: 1695279006,
    httpOnly: false,
    secure: false,
    sameSite: 'Strict',
    platform: 'Unknown Platform',
    category: 'Unknown Category',
    description: '-',
    isFirstParty: 'Yes',
    pageUrl: 'https://edition.cnn.com/',
    frameUrl: 'https://edition.cnn.com/',
  },
  {
    name: '__gpi',
    value:
      'UID=00000c4e3b60e30a:T=1695278091:RT=1695278091:S=ALNI_MbEJocTf0rPK6msvAMWilgSlsHmyw',
    domain: '.cnn.com',
    path: '/',
    expires: 1728974091,
    httpOnly: false,
    secure: false,
    sameSite: 'Lax',
    platform: 'Google Adsense',
    category: 'Marketing',
    description:
      'Collects information on user behaviour on multiple websites. This information is used in order to optimize the relevance of advertisement on the website.',
    isFirstParty: 'Yes',
    pageUrl: 'https://edition.cnn.com/',
    frameUrl: 'https://edition.cnn.com/',
  },
  {
    name: 'KRTBCOOKIE_18',
    value: '22947-1991787318307913867',
    domain: '.pubmatic.com',
    path: '/',
    expires: 1702972820.659555,
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    platform: 'Unknown Platform',
    category: 'Unknown Category',
    description: '-',
    isFirstParty: 'No',
    pageUrl: 'https://edition.cnn.com/',
    frameUrl: 'https://pubmatic.com',
  },
  {
    name: 'KRTBCOOKIE_18',
    value: '22947-1991787318307913867',
    domain: '.pubmatic.com',
    path: '/',
    expires: 1702972820.659555,
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    platform: 'Unknown Platform',
    category: 'Unknown Category',
    description: '-',
    isFirstParty: 'No',
    pageUrl: 'https://www.cnn.com/index.html',
    frameUrl: 'https://www.cnn.com/index.html',
  },
  {
    name: 'KRTBCOOKIE_1310',
    value: '23431-pk59tpc17zlc&KRTB&23465-pk59tpc17zlc',
    domain: '.pubmatic.com',
    path: '/',
    expires: 1697788819.743095,
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    platform: 'Unknown Platform',
    category: 'Unknown Category',
    description: '-',
    isFirstParty: 'No',
    pageUrl: 'https://www.cnn.com/index.html',
    frameUrl: 'https://someother.com',
  },
];

export const technologies = [
  {
    slug: 'aniview-video-ad-player',
    name: 'Aniview Video Ad Player',
    description:
      'Aniview Video Ad Player is a video player technology developed by Aniview, a company that specialises in providing video advertising solutions.',
    confidence: 100,
    version: '6.1',
    icon: 'Aniview.png',
    website: 'https://aniview.com/video-ad-player/',
    cpe: null,
    categories: [
      {
        id: 14,
        slug: 'video-players',
        name: 'Video players',
      },
    ],
    rootPath: true,
  },
  {
    slug: 'varnish',
    name: 'Varnish',
    description: 'Varnish is a reverse caching proxy.',
    confidence: 100,
    version: null,
    icon: 'Varnish.svg',
    website: 'https://www.varnish-cache.org',
    cpe: 'cpe:2.3:a:varnish-software:varnish_cache:*:*:*:*:*:*:*:*',
    categories: [
      {
        id: 23,
        slug: 'caching',
        name: 'Caching',
      },
    ],
    rootPath: true,
  },
  {
    slug: 'aniview-ad-server',
    name: 'Aniview Ad Server',
    description:
      'Aniview Ad Server is a technology developed by Aniview, a company that specialises in providing video advertising solutions. The Aniview Ad Server is a platform designed to manage and serve video ads to publishers, advertisers, and agencies.',
    confidence: 100,
    version: null,
    icon: 'Aniview.png',
    website: 'https://aniview.com/video-ad-servers/',
    cpe: null,
    categories: [
      {
        id: 36,
        slug: 'advertising',
        name: 'Advertising',
      },
    ],
  },
  {
    slug: 'vidazoo',
    name: 'Vidazoo',
    description: 'Vidazoo is a video content and yield management platform.',
    confidence: 100,
    version: null,
    icon: 'Vidazoo.svg',
    website: 'https://www.vidazoo.com',
    cpe: null,
    categories: [
      {
        id: 36,
        slug: 'advertising',
        name: 'Advertising',
      },
    ],
    rootPath: true,
  },
  {
    slug: 'onetrust',
    name: 'OneTrust',
    description:
      'OneTrust is a cloud-based data privacy management compliance platform.',
    confidence: 100,
    version: null,
    icon: 'OneTrust.svg',
    website: 'https://www.onetrust.com',
    cpe: null,
    categories: [
      {
        id: 67,
        slug: 'cookie-compliance',
        name: 'Cookie compliance',
      },
    ],
    rootPath: true,
  },
  {
    slug: 'google-publisher-tag',
    name: 'Google Publisher Tag',
    description:
      'Google Publisher Tag (GPT) is an ad tagging library for Google Ad Manager which is used to dynamically build ad requests.',
    confidence: 100,
    version: null,
    icon: 'Google Developers.svg',
    website: 'https://developers.google.com/publisher-tag/guides/get-started',
    cpe: null,
    categories: [
      {
        id: 36,
        slug: 'advertising',
        name: 'Advertising',
      },
    ],
    rootPath: true,
  },
  {
    slug: 'wunderkind',
    name: 'Wunderkind',
    description:
      'Wunderkind (Formerly BounceX) is a software for behavioural marketing technologies, created to de-anonymise site visitors, analyse their digital behaviour and create relevant digital experiences regardless of channel or device.',
    confidence: 100,
    version: null,
    icon: 'Wunderkind.svg',
    website: 'https://www.wunderkind.co',
    cpe: null,
    categories: [
      {
        id: 32,
        slug: 'marketing-automation',
        name: 'Marketing automation',
      },
    ],
    rootPath: true,
  },
  {
    slug: 'quantcast-measure',
    name: 'Quantcast Measure',
    description:
      'Quantcast Measure is an audience insights and analytics tool.',
    confidence: 100,
    version: null,
    icon: 'Quantcast.png',
    website: 'https://www.quantcast.com/products/measure-audience-insights',
    cpe: null,
    categories: [
      {
        id: 10,
        slug: 'analytics',
        name: 'Analytics',
      },
    ],
    rootPath: true,
  },
  {
    slug: 'pubsubjs',
    name: 'PubSubJS',
    description:
      'PubSubJS is a topic-based publish/subscribe library written in JavaScript.',
    confidence: 100,
    version: null,
    icon: 'pubsub-js.png',
    website: 'https://github.com/mroderick/PubSubJS',
    cpe: null,
    categories: [
      {
        id: 59,
        slug: 'javascript-libraries',
        name: 'JavaScript libraries',
      },
    ],
    rootPath: true,
  },
];
