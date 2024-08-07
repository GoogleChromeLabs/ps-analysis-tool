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
 * External dependencies
 */
import { type CompleteJson } from '@google-psat/common';

export const tempSinglePageData: CompleteJson = {
  pageUrl: 'https://edition.cnn.com/sitemaps/sitemap-section.xml',
  libraryMatches: {},
  cookieData: {
    'https://edition.cnn.com': {
      frameCookies: {
        'countryCode:.cnn.com:/': {
          parsedCookie: {
            name: 'countryCode',
            domain: '.cnn.com',
            path: '/',
            value: 'IN',
            samesite: 'None',
            expires: 'Session',
            httponly: false,
            secure: true,
            partitionKey: '',
          },
          analytics: {
            platform: 'Unknown',
            category: 'Uncategorized',
            GDPR: '',
            description: '',
          },
          url: '',
          isBlocked: false,
          isFirstParty: true,
        },
      },
    },
  },
  technologyData: [
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
    },
  ],
};

export const tempMultiPageData: CompleteJson[] = [
  {
    libraryMatches: {},
    pageUrl: 'https://www.cnn.com/index.html',
    technologyData: [
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
      },
    ],
    cookieData: {
      'https://edition.cnn.com': {
        frameCookies: {
          'countryCode:.cnn.com:/': {
            parsedCookie: {
              name: 'countryCode',
              domain: '.cnn.com',
              path: '/',
              value: 'IN',
              samesite: 'None',
              expires: 'Session',
              httponly: false,
              secure: true,
              partitionKey: '',
            },
            analytics: {
              platform: 'Unknown',
              category: 'Uncategorized',
              GDPR: '',
              description: '',
            },
            url: '',
            isBlocked: false,
            blockedReasons: ['ThirdPartyPhaseout'],
            isFirstParty: true,
          },
        },
      },
    },
  },
  {
    libraryMatches: {},
    pageUrl: 'https://edition.cnn.com/index.html',
    technologyData: [
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
      },
    ],
    cookieData: {
      'https://edition.cnn.com': {
        frameCookies: {
          'countryCode:.cnn.com:/': {
            parsedCookie: {
              name: 'countryCode',
              domain: '.cnn.com',
              path: '/',
              value: 'IN',
              samesite: 'None',
              expires: 'Session',
              httponly: false,
              secure: true,
              partitionKey: '',
            },
            analytics: {
              platform: 'Unknown',
              category: 'Uncategorized',
              GDPR: '',
              description: '',
            },
            url: '',
            isBlocked: false,
            blockedReasons: ['ThirdPartyPhaseout'],
            isFirstParty: true,
          },
        },
      },
    },
  },
];
