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

import { CompleteJson } from '../cookies.types';

export const mockData1: CompleteJson = {
  pageUrl: 'https://edition.cnn.com/',
  erroredOutUrls: [],
  cookieData: {
    'https://edition.cnn.com': {
      frameCookies: {
        'aniC:.aniview.com:/': {
          parsedCookie: {
            name: 'aniC',
            value: '1701171490978-172028097154-001000-014-006837',
            domain: '.aniview.com',
            path: '/',
            expires: '2023-12-18T04:40:15.773Z',
            httponly: true,
            secure: true,
            samesite: 'None',
            partitionKey: '',
          },
          analytics: {
            platform: 'Unknown',
            category: 'Uncategorized',
            GDPR: '',
            description: '',
          },
          isBlocked: true,
          isFirstParty: false,
          url: '',
        },
        '1_C_78:.aniview.com:/': {
          parsedCookie: {
            name: '1_C_78',
            value: 'y-VtIM9z9E2uLA7R8YJPsMjYl829FyKbka~A',
            domain: '.aniview.com',
            path: '/',
            expires: '2023-12-18T04:25:51.777Z',
            httponly: false,
            secure: true,
            samesite: 'None',
            partitionKey: '',
          },
          analytics: {
            platform: 'Unknown',
            category: 'Uncategorized',
            GDPR: '',
            description: '',
          },
          url: '',
          isBlocked: true,
          isFirstParty: false,
        },
      },
    },
    'https://s.amazon-adsystem.com': {
      frameCookies: {
        'ad-id:.amazon-adsystem.com:/': {
          parsedCookie: {
            name: 'ad-id',
            value: 'A7I1e9XiFEw6tE_FYubHJnE|t',
            domain: '.amazon-adsystem.com',
            path: '/',
            expires: '2023-12-18T09:22:30.184Z',
            httponly: true,
            partitionKey: '',
            secure: true,
            samesite: 'None',
          },
          analytics: {
            platform: 'Amazon',
            category: 'Marketing',
            GDPR: 'https://amazon.com/privacy/',
            description:
              'Clickthroughs to Amazon websites: Noting how the user got to Amazon via this website',
          },
          url: '',
          isBlocked: true,
          isFirstParty: false,
        },
      },
    },
  },
  libraryMatches: {},
};

export const mockData2: CompleteJson = {
  pageUrl: 'https://edition.cnn.com/',
  erroredOutUrls: [],
  cookieData: {
    'https://edition.cnn.com': {
      frameCookies: {
        'aniC:.aniview.com:/': {
          parsedCookie: {
            name: 'aniC',
            value: 'value',
            domain: '.aniview.com',
            path: '/',
            expires: '2023-12-18T04:40:15.773Z',
            httponly: true,
            partitionKey: '',
            secure: true,
            samesite: 'None',
          },
          analytics: {
            platform: 'Unknown',
            category: 'Uncategorized',
            GDPR: '',
            description: '',
          },
          url: '',
          isBlocked: true,
          isFirstParty: false,
        },
        '1_C_78:.aniview.com:/': {
          parsedCookie: {
            name: '1_C_78',
            value: 'value2',
            domain: '.aniview.com',
            path: '/',
            expires: '2023-12-18T04:25:51.777Z',
            httponly: false,
            partitionKey: '',
            secure: true,
            samesite: 'None',
          },
          analytics: {
            platform: 'Unknown',
            category: 'Uncategorized',
            GDPR: '',
            description: '',
          },
          url: '',
          isBlocked: true,
          isFirstParty: false,
        },
        'usprivacy:.cnn.com:/': {
          parsedCookie: {
            name: 'usprivacy',
            value: 'val',
            domain: '.cnn.com',
            path: '/',
            expires: '2023-11-28T11:38:36.290Z',
            httponly: false,
            partitionKey: '',
            secure: true,
            samesite: 'None',
          },
          analytics: {
            platform: 'ShareThis',
            category: 'Functional',
            GDPR: 'https://sharethis.com/privacy/',
            description:
              'ShareThis reads if the usprivacy cookie is present in the publisher domain.',
          },
          url: '',
          isBlocked: false,
          isFirstParty: true,
        },
      },
    },
    'https://s.amazon-adsystem.com': {
      frameCookies: {
        'ad-id:.amazon-adsystem.com:/': {
          parsedCookie: {
            name: 'ad-id',
            value: 'value3',
            domain: '.amazon-adsystem.com',
            path: '/',
            expires: '2023-12-18T09:22:30.184Z',
            httponly: true,
            partitionKey: '',
            secure: true,
            samesite: 'None',
          },
          analytics: {
            platform: 'Amazon',
            category: 'Marketing',
            GDPR: 'https://amazon.com/privacy/',
            description:
              'Clickthroughs to Amazon websites: Noting how the user got to Amazon via this website',
          },
          url: '',
          isBlocked: true,
          isFirstParty: false,
        },
        '1_C_78:.aniview.com:/': {
          parsedCookie: {
            name: '1_C_78',
            value: 'y-VtIM9z9E2uLA7R8YJPsMjYl829FyKbka~A',
            domain: '.aniview.com',
            path: '/',
            expires: '2023-12-18T04:25:51.777Z',
            httponly: false,
            partitionKey: '',
            secure: true,
            samesite: 'None',
          },
          analytics: {
            platform: 'Unknown',
            category: 'Uncategorized',
            GDPR: '',
            description: '',
          },
          url: '',
          isBlocked: true,
          isFirstParty: false,
        },
      },
    },
  },
  libraryMatches: {},
};
export const tempSinglePageData: CompleteJson = {
  pageUrl: 'https://edition.cnn.com/sitemaps/sitemap-section.xml',
  libraryMatches: {},
  erroredOutUrls: [],
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
};

export const tempMultiPageData: CompleteJson[] = [
  {
    libraryMatches: {},
    erroredOutUrls: [],
    pageUrl: 'https://www.cnn.com/index.html',
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
    erroredOutUrls: [],
    pageUrl: 'https://edition.cnn.com/index.html',
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
